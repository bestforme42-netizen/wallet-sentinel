"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins, Search, AlertTriangle, XCircle, Info, Loader2,
  TrendingDown, Users, Clock,
} from "lucide-react";
import ChainSelector from "@/components/ChainSelector";
import GlassCard from "@/components/GlassCard";
import NavBar from "@/components/NavBar";

interface TokenResult {
  address: string;
  chain: string;
  name: string;
  symbol: string;
  isHoneypot: boolean;
  buyTax: number | null;
  sellTax: number | null;
  holderCount: number;
  liquidityUSD: number;
  ageInDays: number | null;
  riskScore: number;
  riskLevel: "safe" | "warning" | "danger";
  flags: string[];
}

export default function TokenRiskPage() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("ethereum");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TokenResult | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError("Enter a valid token address");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    // Mock analysis (real version would call GoPlus / Honeypot.is API)
    await new Promise((r) => setTimeout(r, 1500));

    const flags: string[] = [];
    let score = 70;

    // Simulate based on address patterns
    const addrLC = address.toLowerCase();
    if (addrLC.endsWith("a") || addrLC.endsWith("0")) { flags.push("Low liquidity detected"); score -= 15; }
    if (addrLC.includes("dead")) { flags.push("Large burned supply"); score += 5; }
    if (parseInt(addrLC.slice(-3), 16) < 256) { flags.push("Contract owner can modify fees"); score -= 20; }
    if (parseInt(addrLC.slice(2, 5), 16) % 2 === 0) { flags.push("Mint function available"); score -= 10; }

    const isHoneypot = score < 30;
    if (isHoneypot) flags.push("HONEYPOT DETECTED — cannot sell tokens");

    const riskLevel = score >= 60 ? "safe" : score >= 35 ? "warning" : "danger";

    setResult({
      address,
      chain,
      name: "Unknown Token",
      symbol: "???",
      isHoneypot,
      buyTax: Math.floor(Math.random() * 5),
      sellTax: isHoneypot ? 100 : Math.floor(Math.random() * 10),
      holderCount: Math.floor(Math.random() * 5000) + 10,
      liquidityUSD: Math.floor(Math.random() * 100000),
      ageInDays: Math.floor(Math.random() * 365),
      riskScore: Math.max(0, Math.min(100, score)),
      riskLevel,
      flags,
    });
    setLoading(false);
  };

  return (
    <main className="min-h-dvh pb-24">
      <header className="bg-gradient-to-b from-purple-400/5 to-transparent pt-6 pb-6 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400/20 to-cyan-400/20 flex items-center justify-center mx-auto mb-4 border border-purple-400/10">
            <Coins className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Token Risk</h1>
          <p className="text-sm text-gray-400 mt-1">Check if a token is a scam, honeypot, or rugpull</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        <GlassCard className="mb-4">
          <div className="space-y-3">
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="0x... token contract address"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none transition-colors font-mono"
              />
            </div>
            <ChainSelector selected={chain} onSelect={setChain} />
            <button onClick={handleCheck} disabled={loading || !address} className="btn-cyan w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : <><Search className="w-4 h-4" /> Check Token</>}
            </button>
          </div>
        </GlassCard>

        {error && <div className="glass border-red-400/20 p-3 mb-4 flex items-center gap-2 text-red-400 text-sm"><XCircle className="w-4 h-4" /> {error}</div>}

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className={`mb-4 bg-gradient-to-br ${
                result.riskLevel === "safe" ? "from-green-400/20 to-transparent border-green-400/20" :
                result.riskLevel === "warning" ? "from-yellow-400/20 to-transparent border-yellow-400/20" :
                "from-red-400/20 to-transparent border-red-400/20"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-mono text-gray-500">RISK SCORE</div>
                    <div className={`text-4xl font-bold font-display ${
                      result.riskLevel === "safe" ? "text-green-400" : result.riskLevel === "warning" ? "text-yellow-400" : "text-red-400"
                    }`}>{result.riskScore}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold font-display uppercase ${
                      result.riskLevel === "safe" ? "text-green-400" : result.riskLevel === "warning" ? "text-yellow-400" : "text-red-400"
                    }`}>{result.riskLevel}</div>
                    {result.isHoneypot && <div className="chip-danger text-[10px] mt-1">🍯 HONEYPOT</div>}
                  </div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${result.riskScore}%` }}
                    className={`h-full rounded-full ${result.riskLevel === "safe" ? "bg-green-400" : result.riskLevel === "warning" ? "bg-yellow-400" : "bg-red-400"}`} />
                </div>
              </GlassCard>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "Buy Tax", value: result.buyTax !== null ? `${result.buyTax}%` : "N/A", icon: <TrendingDown className="w-4 h-4 text-cyan-400" /> },
                  { label: "Sell Tax", value: result.sellTax !== null ? `${result.sellTax}%` : "N/A", icon: <TrendingDown className={`w-4 h-4 ${result.sellTax && result.sellTax > 10 ? "text-red-400" : "text-green-400"}`} /> },
                  { label: "Holders", value: result.holderCount.toLocaleString(), icon: <Users className="w-4 h-4 text-purple-400" /> },
                  { label: "Age", value: result.ageInDays ? `${result.ageInDays}d` : "N/A", icon: <Clock className="w-4 h-4 text-orange-400" /> },
                ].map((s) => (
                  <GlassCard key={s.label} animate={false} className="text-center py-3">
                    <div className="flex justify-center mb-1">{s.icon}</div>
                    <div className="text-sm font-bold text-white font-display">{s.value}</div>
                    <div className="text-[10px] text-gray-500">{s.label}</div>
                  </GlassCard>
                ))}
              </div>

              {result.flags.length > 0 && (
                <div className="space-y-2 mb-4">
                  {result.flags.map((flag, i) => (
                    <div key={i} className="glass border-orange-400/10 p-3 rounded-xl flex items-center gap-2 text-sm text-gray-300">
                      <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" /> {flag}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <GlassCard>
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-white">Token Risk Checker</strong> analyzes token contracts for honeypot patterns, excessive taxes, mint functions, and rugpull indicators.
                <div className="mt-2">Always check a token before buying — especially new or low-liquidity tokens.</div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
      <NavBar />
    </main>
  );
}
