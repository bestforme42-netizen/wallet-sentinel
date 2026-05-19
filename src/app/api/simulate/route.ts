import { NextRequest, NextResponse } from "next/server";
import { getChainById } from "@/lib/chains";

interface SimulationResult {
  to: string;
  chain: string;
  method: string;
  estimatedGas: string;
  status: "success" | "revert" | "warning";
  decodedAction: string;
  riskFactors: string[];
  nativeValue: string;
}

const KNOWN_METHODS: Record<string, { name: string; risk: "low" | "medium" | "high" }> = {
  "0x095ea7b3": { name: "approve", risk: "medium" },
  "0xa22cb465": { name: "setApprovalForAll", risk: "high" },
  "0x23b872dd": { name: "transferFrom", risk: "medium" },
  "0xa9059cbb": { name: "transfer", risk: "low" },
  "0x3593564c": { name: "multicall", risk: "medium" },
  "0x5ae401dc": { name: "multicall(uint256,bytes[])", risk: "medium" },
  "0x1249c58b": { name: "mint", risk: "low" },
  "0x40c10f19": { name: "mint(address,uint256)", risk: "low" },
  "0x8dc6e399": { name: "claimAirdrop", risk: "high" },
  "0x4e71d92d": { name: "claim", risk: "medium" },
};

export async function POST(req: NextRequest) {
  try {
    const { to, data, value, chainId, from } = await req.json();

    if (!to || !data || !chainId) {
      return NextResponse.json({ error: "Missing required fields: to, data, chainId" }, { status: 400 });
    }

    const chain = getChainById(Number(chainId));
    if (!chain) return NextResponse.json({ error: "Unsupported chain" }, { status: 400 });

    const selector = data.slice(0, 10).toLowerCase();
    const methodInfo = KNOWN_METHODS[selector];
    const riskFactors: string[] = [];

    // Decode action
    let decodedAction = methodInfo ? methodInfo.name : `Unknown (${selector})`;
    let status: "success" | "revert" | "warning" = "success";

    // Risk analysis
    if (methodInfo?.risk === "high") {
      riskFactors.push("High-risk function call");
      status = "warning";
    }

    if (selector === "0x095ea7b3") {
      // approve — check if unlimited
      const amount = BigInt("0x" + data.slice(74, 138));
      const MAX = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
      if (amount >= MAX) {
        riskFactors.push("UNLIMITED approval — contract can spend ALL your tokens");
        decodedAction = "approve (UNLIMITED)";
        status = "warning";
      } else {
        decodedAction = "approve (limited amount)";
      }
    }

    if (selector === "0xa22cb465") {
      riskFactors.push("setApprovalForAll — grants FULL access to all NFTs");
      status = "warning";
    }

    // Check if sending to known drainer patterns
    const toLC = (to || "").toLowerCase();
    if (toLC === "0x0000000000000000000000000000000000000000") {
      riskFactors.push("Sending to zero address (burn)");
    }

    // Estimate gas (mock — real version uses eth_estimateGas RPC)
    const estimatedGas = methodInfo
      ? methodInfo.name === "approve" ? "46,000" : methodInfo.name === "transfer" ? "21,000" : "65,000"
      : "100,000";

    const nativeValue = value ? (parseInt(value, 16) / 1e18).toFixed(6) + " " + "ETH" : "0";

    // Simulate via eth_call
    try {
      const res = await fetch(chain.rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0", id: 1, method: "eth_call",
          params: [{ from, to, data, value }, "latest"],
        }),
      });
      const json = await res.json();
      if (json.error) {
        status = "revert";
        riskFactors.push(`Simulation reverted: ${json.error.message || "unknown error"}`);
      }
    } catch {
      // RPC failed, continue with heuristic
    }

    const result: SimulationResult = {
      to,
      chain: chain.shortName,
      method: decodedAction,
      estimatedGas,
      status,
      decodedAction,
      riskFactors,
      nativeValue,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error("Simulate error:", e);
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 });
  }
}
