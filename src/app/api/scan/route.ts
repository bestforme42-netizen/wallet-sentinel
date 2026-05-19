import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";

// This MVP uses direct RPC calls. In production we'd use Basescan API with API key.
// For the demo we scan known Approval events by topic.

const RPC_URL = "https://sepolia.base.org";
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const address = url.searchParams.get("address");

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  try {
    const latestBlock = await getLatestBlock();

    // Look back ~10000 blocks (~3 hours on Base Sepolia at 2s/block)
    const fromBlock = latestBlock - 10000;
    const paddedAddress = address.toLowerCase().replace("0x", "0x" + "0".repeat(24));

    // ERC-20 Approval(address indexed owner, address indexed spender, uint256 value)
    // topic0 = 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925
    const approvalTopic0 = "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";

    // Get Approval events where owner = address
    const logs = await getLogs(fromBlock, latestBlock, [approvalTopic0, paddedAddress]);

    // Deduplicate: keep only latest approval per (token, spender)
    const byKey = new Map<string, Record<string, string>>();
    for (const log of logs) {
      const token = log.address;
      const spender = log.topics[2];
      const key = `${token.toLowerCase()}:${spender.toLowerCase()}`;
      // Keep the latest one
      const existing = byKey.get(key);
      if (!existing || parseInt(log.blockNumber, 16) > parseInt(existing.blockNumber, 16)) {
        byKey.set(key, { token, spender, value: log.data, blockNumber: log.blockNumber, txHash: log.transactionHash });
      }
    }

    // Filter out zero-value approvals (already revoked)
    const active = Array.from(byKey.values()).filter((entry) => {
      const value = BigInt(entry.value);
      return value > BigInt(0);
    });

    return NextResponse.json({
      address,
      scannedBlocks: { from: fromBlock, to: latestBlock },
      activeApprovals: active.length,
      approvals: active.map((a) => ({
        token: a.token,
        spender: a.spender,
        amount: a.value,
        blockNumber: parseInt(a.blockNumber, 16),
        txHash: a.txHash,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Scan failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}

async function getLatestBlock(): Promise<number> {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }),
  });
  const data = await res.json();
  return parseInt(data.result, 16);
}

async function getLogs(fromBlock: number, toBlock: number, topics: string[]): Promise<Array<Record<string, string>>> {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getLogs",
      params: [
        {
          fromBlock: "0x" + fromBlock.toString(16),
          toBlock: "0x" + toBlock.toString(16),
          topics,
        },
      ],
      id: 1,
    }),
  });
  const data = await res.json();
  return data.result ?? [];
}
