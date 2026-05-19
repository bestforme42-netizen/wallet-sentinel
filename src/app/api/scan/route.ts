import { NextRequest, NextResponse } from "next/server";
import { getChainById, getChainByName, SUPPORTED_CHAINS } from "@/lib/chains";
import { scoreApproval } from "@/lib/risk-engine";

const APPROVAL_TOPIC = "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";
const ZERO_TOPIC = "0x0000000000000000000000000000000000000000000000000000000000000000";

interface RawLog {
  address: string;
  topics: string[];
  data: string;
  blockNumber: string;
  transactionHash: string;
}

async function getLatestBlock(rpc: string): Promise<number> {
  const res = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
  });
  const data = await res.json();
  return parseInt(data.result, 16);
}

async function fetchLogs(chainId: number, address: string, fromBlock: number): Promise<RawLog[]> {
  const chain = getChainById(chainId);
  if (!chain) return [];
  const logs: RawLog[] = [];
  let current = fromBlock;
  const latest = await getLatestBlock(chain.rpc);
  while (current < latest) {
    const to = Math.min(current + 9999, latest);
    const res = await fetch(chain.rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1, method: "eth_getLogs",
        params: [{ topics: [APPROVAL_TOPIC, address.toLowerCase()], fromBlock: "0x" + current.toString(16), toBlock: "0x" + to.toString(16) }],
      }),
    });
    const data = await res.json();
    if (data.result) logs.push(...data.result);
    current = to + 1;
  }
  return logs;
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const chainParam = req.nextUrl.searchParams.get("chain") || "all";

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  const chains = chainParam === "all"
    ? SUPPORTED_CHAINS.filter((c) => c.id !== 84532)
    : [getChainByName(chainParam) || getChainById(Number(chainParam))].filter(Boolean) as NonNullable<ReturnType<typeof getChainById>>[];

  if (!chains.length) {
    return NextResponse.json({ error: "Chain not found" }, { status: 400 });
  }

  try {
    const results = await Promise.allSettled(
      chains.map(async (chain) => {
        const latest = await getLatestBlock(chain.rpc);
        const fromBlock = Math.max(0, latest - 100000);
        const logs = await fetchLogs(chain.id, address, fromBlock);
        return logs
          .filter((l) => l.topics.length >= 3 && l.topics[2] !== ZERO_TOPIC)
          .map((l) => ({
            token: l.address,
            spender: "0x" + l.topics[2].slice(26),
            amount: l.data,
            blockNumber: l.blockNumber,
            txHash: l.transactionHash,
            chainId: chain.id,
            chainName: chain.shortName,
          }));
      })
    );

    const all: { token: string; spender: string; amount: string; blockNumber: string; txHash: string; chainId: number; chainName: string }[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") all.push(...r.value);
    }

    // Deduplicate
    const byKey = new Map<string, (typeof all)[0]>();
    for (const a of all) {
      const key = `${a.chainId}:${a.token.toLowerCase()}:${a.spender.toLowerCase()}`;
      const existing = byKey.get(key);
      if (!existing || parseInt(a.blockNumber, 16) > parseInt(existing.blockNumber, 16)) {
        byKey.set(key, a);
      }
    }

    // Filter active + score
    const scored = Array.from(byKey.values())
      .filter((e) => BigInt(e.amount) > BigInt(0))
      .map((entry) => {
        const amount = BigInt(entry.amount);
        const isUnlimited = amount >= BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        const amountDisplay = isUnlimited ? "Unlimited" : amount.toString();
        const report = scoreApproval({
          token: entry.token,
          tokenName: "Unknown",
          tokenSymbol: "???",
          spender: entry.spender,
          amount: entry.amount,
          amountFormatted: amountDisplay,
          isUnlimited,
          blockNumber: parseInt(entry.blockNumber, 16),
          txHash: entry.txHash,
          timestamp: 0,
        });
        return {
          token: entry.token,
          spender: entry.spender,
          amountDisplay,
          isUnlimited,
          risk: { level: report.risk, label: report.risk.toUpperCase(), factors: report.reasons },
          chainId: entry.chainId,
          chainName: entry.chainName,
          explorerLink: `${getChainById(entry.chainId)?.explorer}/tx/${entry.txHash}`,
        };
      });

    scored.sort((a, b) => {
      const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, safe: 4 };
      return (order[a.risk.level] ?? 5) - (order[b.risk.level] ?? 5);
    });

    return NextResponse.json({
      address,
      chainCount: chains.length,
      chains: chains.map((c) => c.shortName),
      totalApprovals: scored.length,
      approvals: scored,
    });
  } catch (e) {
    console.error("Scan error:", e);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
