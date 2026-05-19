"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, CheckCircle, XCircle, AlertTriangle, Loader2, Zap, Info,
} from "lucide-react";
import ChainSelector from "@/components/ChainSelector";
import GlassCard from "@/components/GlassCard";
import NavBar from "@/components/NavBar";

interface SimResult {
  to: string;
  chain: string;
  method: string;
  estimatedGas: string;
  status: "success" | "revert" | "warning";
  decodedAction: string;
  riskFactors: string[];
  nativeValue: string;
}

const statusConfig = {
  success: { color: "text-green-400", bg: "border-green-400/20", icon: <CheckCircle className="w-5 h-5 text-green-400" />, label: "SAFE" },
  warning: { color: "text-yellow-400", bg: "border-yellow-400/20", icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />, label: "WARNING" },
  revert: { color: "text-red-400", bg: "border-red-400/20", icon: <XCircle className="w-5 h-5 text-red-400" />, label: "REVERTS" },
};

export default function SimulatePage() {
  const [to, setTo] = useState("");
  const [data, setData] = useState("");
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("");
  const [chain, setChain] = useState("ethereum");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [error, setError] = useState("");

  const handleSimulate = async () => {
    if (!to || !data) { setError("To address and calldata are required"); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const chainMap: Record<string, number> = { ethereum: 1, base: 8453, arbitrum: 42161, optimism: 10, polygon: 137, bsc: 56, avalanche: 43114 };
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, data, value: value || "0x0", chainId: chainMap[chain] || 1, from }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setResult(d);
    } catch (e) { setError(e instanceof Error ? e.message : "Simulation failed"); }
    finally { setLoading(false); }
  };

  const sc = result ? statusConfig[result.status] : null;

  return (
    <main className="min-h-dvh pb-24">
      <header className="bg-gradient-to-b from-cyan-400/5 to-transparent pt-6 pb-6 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-400/20 flex items-center justify-center mx-auto mb-4 border border-cyan-400/10">
            <Play className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Tx Simulator</h1>
          <p className="text-sm text-gray-400 mt-1">Preview what a transaction will do before you sign it</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        <GlassCard className="mb-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">To Address *</label>
              <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x... contract address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none font-mono" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Calldata (hex) *</label>
              <textarea value={data} onChange={(e) => setData(e.target.value)} placeholder="0x095ea7b3..." rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none font-mono resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Value (hex)</label>
                <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="0x0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none font-mono" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">From (optional)</label>
                <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="0x..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none font-mono" />
              </div>
            </div>
            <ChainSelector selected={chain} onSelect={setChain} />
            <button onClick={handleSimulate} disabled={loading || !to || !data} className="btn-cyan w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Simulating…</> : <><Play className="w-4 h-4" /> Simulate Transaction</>}
            </button>
          </div>
        </GlassCard>

        {error && <div className="glass border-red-400/20 p-3 mb-4 flex items-center gap-2 text-red-400 text-sm"><XCircle className="w-4 h-4" /> {error}</div>}

        <AnimatePresence>
          {result && sc && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className={`mb-4 ${sc.bg}`}>
                <div className="flex items-center gap-3 mb-3">
                  {sc.icon}
                  <div>
                    <div className={`text-lg font-bold font-display ${sc.color}`}>{sc.label}</div>
                    <div className="text-xs text-gray-400">{result.method}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="glass border-white/5 p-2 rounded-lg text-center">
                    <Zap className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <div className="text-xs text-white font-mono">{result.estimatedGas}</div>
                    <div className="text-[9px] text-gray-500">Est. Gas</div>
                  </div>
                  <div className="glass border-white/5 p-2 rounded-lg text-center">
                    <span className="text-cyan-400">Ξ</span>
                    <div className="text-xs text-white font-mono mt-1">{result.nativeValue}</div>
                    <div className="text-[9px] text-gray-500">Value</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400"><span className="text-gray-500">Chain:</span> {result.chain}</div>
                <div className="text-xs text-gray-400 mt-1"><span className="text-gray-500">To:</span> <span className="font-mono">{result.to.slice(0, 10)}...{result.to.slice(-8)}</span></div>
              </GlassCard>

              {result.riskFactors.length > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-mono text-gray-500 tracking-wider">RISK FACTORS</div>
                  {result.riskFactors.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <div className="glass border-orange-400/10 p-3 rounded-xl flex items-center gap-2 text-sm text-gray-300">
                        <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" /> {f}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <GlassCard>
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-white">Transaction Simulator</strong> decodes calldata, estimates gas, and runs eth_call to preview the outcome — before you sign.
                <div className="mt-2">Paste the raw transaction data from your wallet popup to analyze it safely.</div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
      <NavBar />
    </main>
  );
}
