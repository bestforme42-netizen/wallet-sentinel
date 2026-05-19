"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Search, CheckCircle, XCircle, Info,
  Loader2, Zap, Lock, Unlock,
} from "lucide-react";
import ChainSelector from "@/components/ChainSelector";
import GlassCard from "@/components/GlassCard";
import type { SCCheckResult } from "@/lib/sc-checker";

const severityColors: Record<string, string> = {
  info: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  low: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  high: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  critical: "text-red-400 bg-red-400/10 border-red-400/20",
};

const safetyColor: Record<string, string> = {
  safe: "text-green-400",
  warning: "text-yellow-400",
  danger: "text-red-400",
  unknown: "text-gray-400",
};

const safetyBg: Record<string, string> = {
  safe: "from-green-400/20 to-transparent border-green-400/20",
  warning: "from-yellow-400/20 to-transparent border-yellow-400/20",
  danger: "from-red-400/20 to-transparent border-red-400/20",
  unknown: "from-gray-400/20 to-transparent border-gray-400/20",
};

export default function CheckerPage() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("ethereum");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SCCheckResult | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError("Enter a valid contract address (0x...)");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/check?address=${address}&chain=${chain}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh pb-8">
      {/* Header */}
      <header className="bg-gradient-to-b from-cyan-400/5 to-transparent pt-6 pb-8 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-400/20 flex items-center justify-center mx-auto mb-4 border border-cyan-400/10">
            <Shield className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">SC Checker</h1>
          <p className="text-sm text-gray-400 mt-1">Analyze smart contract safety before you interact</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        {/* Search */}
        <GlassCard className="mb-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x... contract address"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none transition-colors font-mono"
              />
            </div>
            <ChainSelector selected={chain} onSelect={setChain} />
            <button
              onClick={handleCheck}
              disabled={loading || !address}
              className="btn-cyan w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
              ) : (
                <><Zap className="w-4 h-4" /> Check Contract</>
              )}
            </button>
          </div>
        </GlassCard>

        {error && (
          <div className="glass border-red-400/20 p-3 mb-4 flex items-center gap-2 text-red-400 text-sm">
            <XCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {/* Safety score header */}
              <GlassCard className={`mb-4 bg-gradient-to-br ${safetyBg[result.safetyLevel]}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs font-mono text-gray-500 tracking-wider">SAFETY SCORE</div>
                    <div className={`text-4xl font-bold font-display ${safetyColor[result.safetyLevel]}`}>
                      {result.safetyScore}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold font-display uppercase ${safetyColor[result.safetyLevel]}`}>
                      {result.safetyLevel}
                    </div>
                    {result.isHoneypot && (
                      <div className="chip-danger text-[10px] mt-1">🍯 HONEYPOT SUSPECTED</div>
                    )}
                  </div>
                </div>

                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.safetyScore}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      result.safetyLevel === "safe" ? "bg-green-400" :
                      result.safetyLevel === "warning" ? "bg-yellow-400" :
                      "bg-red-400"
                    }`}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-3">{result.summary}</p>
              </GlassCard>

              {/* Quick facts */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Verified", value: result.isVerified ? "Yes" : "No", icon: result.isVerified ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" /> },
                  { label: "Proxy", value: result.isProxy ? "Yes" : "No", icon: result.isProxy ? <Unlock className="w-4 h-4 text-yellow-400" /> : <Lock className="w-4 h-4 text-green-400" /> },
                  { label: "Transactions", value: result.txCount.toLocaleString(), icon: <Zap className="w-4 h-4 text-cyan-400" /> },
                ].map((fact) => (
                  <GlassCard key={fact.label} animate={false} className="text-center py-3">
                    <div className="flex justify-center mb-1">{fact.icon}</div>
                    <div className="text-sm font-bold text-white font-display">{fact.value}</div>
                    <div className="text-[10px] text-gray-500">{fact.label}</div>
                  </GlassCard>
                ))}
              </div>

              {/* Contract info */}
              <GlassCard className="mb-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address</span>
                    <span className="font-mono text-gray-300">{result.address.slice(0, 8)}…{result.address.slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Chain</span>
                    <span className="text-white">{result.chainName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="text-white">{result.isContract ? "Smart Contract" : "EOA (Wallet)"}</span>
                  </div>
                  {result.ageInDays !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age</span>
                      <span className="text-white">{result.ageInDays} days</span>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Risk factors */}
              {result.riskFactors.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-mono text-gray-500 mb-3 tracking-wider">RISK FACTORS</div>
                  <div className="space-y-2">
                    {result.riskFactors.map((factor, i) => (
                      <motion.div
                        key={factor.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <GlassCard animate={false} className={`py-3 border ${severityColors[factor.severity]}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-base">{factor.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white">{factor.label}</span>
                                <span className={`chip text-[9px] ${severityColors[factor.severity]}`}>
                                  {factor.severity}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{factor.description}</p>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="glass border-yellow-400/10 p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                  <div className="text-[11px] text-gray-400 leading-relaxed">
                    <strong className="text-yellow-400">Disclaimer:</strong> This analysis is heuristic and not a security audit. 
                    Always DYOR. Verified source code doesn&apos;t guarantee safety. Low score = high risk, but high score doesn&apos;t guarantee safety either.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
