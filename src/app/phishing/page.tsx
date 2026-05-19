"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, AlertTriangle, CheckCircle, XCircle, Info, Loader2, Link2, Globe,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NavBar from "@/components/NavBar";

interface URLCheckResult {
  url: string;
  domain: string;
  result: "safe" | "suspicious" | "dangerous";
  score: number;
  flags: string[];
  recommendation: string;
}

const resultConfig = {
  safe: { color: "text-green-400", bg: "from-green-400/20 to-transparent border-green-400/20", icon: <CheckCircle className="w-6 h-6 text-green-400" />, label: "SAFE" },
  suspicious: { color: "text-yellow-400", bg: "from-yellow-400/20 to-transparent border-yellow-400/20", icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />, label: "SUSPICIOUS" },
  dangerous: { color: "text-red-400", bg: "from-red-400/20 to-transparent border-red-400/20", icon: <XCircle className="w-6 h-6 text-red-400" />, label: "DANGEROUS" },
};

export default function PhishingPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<URLCheckResult | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!url) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/phishing?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check failed");
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? resultConfig[result.result] : null;

  return (
    <main className="min-h-dvh pb-24">
      <header className="bg-gradient-to-b from-red-400/5 to-transparent pt-6 pb-6 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400/20 to-orange-400/20 flex items-center justify-center mx-auto mb-4 border border-red-400/10">
            <Link2 className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Phishing Checker</h1>
          <p className="text-sm text-gray-400 mt-1">Check if a URL is a phishing attempt before you connect</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        <GlassCard className="mb-4">
          <div className="space-y-3">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="https://example.com or paste any URL"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none transition-colors"
              />
            </div>
            <button onClick={handleCheck} disabled={loading || !url} className="btn-cyan w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : <><Search className="w-4 h-4" /> Check URL</>}
            </button>
          </div>
        </GlassCard>

        {error && <div className="glass border-red-400/20 p-3 mb-4 flex items-center gap-2 text-red-400 text-sm"><XCircle className="w-4 h-4" /> {error}</div>}

        <AnimatePresence>
          {result && cfg && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className={`mb-4 bg-gradient-to-br ${cfg.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {cfg.icon}
                    <div>
                      <div className={`text-lg font-bold font-display ${cfg.color}`}>{cfg.label}</div>
                      <div className="text-xs text-gray-400">{result.domain}</div>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold font-display ${cfg.color}`}>{result.score}</div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    className={`h-full rounded-full ${result.result === "safe" ? "bg-green-400" : result.result === "suspicious" ? "bg-yellow-400" : "bg-red-400"}`}
                  />
                </div>
                <p className="text-xs text-gray-300">{result.recommendation}</p>
              </GlassCard>

              {result.flags.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-mono text-gray-500 mb-2 tracking-wider">DETECTED FLAGS</div>
                  <div className="space-y-2">
                    {result.flags.map((flag, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                        <div className="glass border-orange-400/10 p-3 rounded-xl flex items-center gap-2 text-sm text-gray-300">
                          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" /> {flag}
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
                <strong className="text-white">How it works:</strong> Paste any URL to check for phishing indicators. 
                We analyze domain patterns, TLD risk, keyword matching, URL obfuscation techniques, and known scam patterns.
                <div className="mt-2 text-[10px] text-gray-500">
                  Common phishing tactics: fake airdrops, wallet verification scams, seed phrase stealers, fake DEX frontends.
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
      <NavBar />
    </main>
  );
}
