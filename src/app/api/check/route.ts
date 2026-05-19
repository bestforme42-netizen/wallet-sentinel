import { NextRequest, NextResponse } from "next/server";
import { getChainById, getChainByName } from "@/lib/chains";
import { buildSCResult } from "@/lib/sc-checker";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const chainParam = req.nextUrl.searchParams.get("chain") || "ethereum";

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: "Invalid contract address" }, { status: 400 });
  }

  const chain = getChainByName(chainParam) || getChainById(Number(chainParam));
  if (!chain) {
    return NextResponse.json({ error: "Unsupported chain" }, { status: 400 });
  }

  try {
    // 1. Get bytecode
    const codeRes = await fetch(chain.rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getCode", params: [address, "latest"] }),
    });
    const codeData = await codeRes.json();
    const bytecode: string = codeData.result || "0x";

    // 2. Get tx count (nonce) to estimate activity
    const nonceRes = await fetch(chain.rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "eth_getTransactionCount", params: [address, "latest"] }),
    });
    const nonceData = await nonceRes.json();
    const txCount = parseInt(nonceData.result || "0x0", 16);

    // 3. Try explorer API for verification status (optional — may fail without API key)
    let isVerified = false;
    let isProxy = false;
    let contractName = "";
    let ageInDays: number | null = null;

    if (chain.explorerApi) {
      try {
        // Check if contract source is verified
        const verifyRes = await fetch(
          `${chain.explorerApi}?module=contract&action=getsourcecode&address=${address}&apikey=YourApiKeyToken`,
          { signal: AbortSignal.timeout(5000) }
        );
        const verifyData = await verifyRes.json();
        if (verifyData.status === "1" && verifyData.result?.[0]) {
          const result = verifyData.result[0];
          isVerified = result.SourceCode !== "";
          contractName = result.ContractName || "";
          isProxy = result.Proxy === "1";
        }
      } catch {
        // Explorer API failed — continue with bytecode-only analysis
      }

      // Get creation date from first tx
      try {
        const txlistRes = await fetch(
          `${chain.explorerApi}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=YourApiKeyToken`,
          { signal: AbortSignal.timeout(5000) }
        );
        const txlistData = await txlistRes.json();
        if (txlistData.status === "1" && txlistData.result?.[0]) {
          const creationTime = parseInt(txlistData.result[0].timeStamp);
          ageInDays = Math.floor((Date.now() / 1000 - creationTime) / 86400);
        }
      } catch {
        // Continue without age data
      }
    }

    const result = buildSCResult({
      address,
      chainId: chain.id,
      chainName: chain.name,
      bytecode,
      isVerified,
      isProxy,
      txCount,
      ageInDays,
      contractName,
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("SC check error:", e);
    return NextResponse.json({ error: "Contract check failed" }, { status: 500 });
  }
}
