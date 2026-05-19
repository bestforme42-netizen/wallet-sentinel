"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart, Shield, AlertTriangle, CheckCircle, Loader2, TrendingDown, Info,
} from "lucide-react";
import ChainSelector from "@/components/ChainSelector";
import GlassCard from "@/components/GlassCard";
import NavBar from "@/components/NavBar";
import type { HealthReport } from "@/lib/wallet-health";

const gradeConfig: Record<string, { color: string; bg: string; emoji: string }> = {
  A: { color: "text-green-400", bg: "from-green-400/20 to-transparent border-green-400/20", emoji: "🟢" },
  B: { color: "text-cyan-400", bg: "from-cyan-400/20 to-transparent border-cyan-400/20", emoji: "🔵" },
  C: { color: "text-yellow-400", bg: "from-yellow-400/20 to-transparent border-yellow-400/20", emoji: "🟡" },
  D: { color: "text-orange-400", bg: "from-orange-400/20 to-transparent border-orange-400/20", emoji: "🟠" },
  F: { color: "text-red-400", bg: "from-red-400/20 to-transparent border-red-400/20", emoji: "🔴" },
};

export default function HealthPage() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("all");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<HealthReport | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError("Enter a valid wallet address");
      return;
    }
    setError("");
    setLoading(true);
    setReport(null);

    try {
      // Fetch approvals first
      const scanRes = await fetch(`/api/scan?address=${address}&chain=${chain}`);
      const scanData = await scanRes.json();
      if (!scanRes.ok) throw new Error(scanData.error);

      // Calculate health from approvals
      const res = await fetch("/api/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvals: scanData.approvals }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReport(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check failed");
    } finally {
      setLoading(false);
    }
  };

  const gc = report ? gradeConfig[report.grade] : null;

  return (
    <main className="min-h-dvh pb-24">
      <header className="bg-gradient-to-b from-green-400/5 to-transparent pt-6 pb-6 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/20 to-cyan-400/20 flex items-center justify-center mx-auto mb-4 border border-green-400/10">
            <Heart className="w-7 h-7 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Wallet Health</h1>
          <p className="text-sm text-gray-400 mt-1">Get a safety score for any wallet based on active approvals</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        <GlassCard className="mb-4">
          <div className="space-y-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="0x... wallet address"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none transition-colors font-mono"
            />
            <ChainSelector selected={chain} onSelect={setChain} />
            <button onClick={handleCheck} disabled={loading || !address} className="btn-cyan w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : <><Heart className="w-4 h-4" /> Check Health</>}
            </button>
          </div>
        </GlassCard>

        {error && <div className="glass border-red-400/20 p-3 mb-4 flex items-center gap-2 text-red-400 text-sm"><AlertTriangle className="w-4 h-4" /> {error}</div>}

        {report && gc && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Score card */}
            <GlassCard className={`mb-4 bg-gradient-to-br ${gc.bg}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs font-mono text-gray-500 tracking-wider">HEALTH SCORE</div>
                  <div className={`text-5xl font-bold font-display ${gc.color}`}>{report.score}</div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold font-display ${gc.color}`}>{report.grade}</div>
                  <div className="text-xs text-gray-400 mt-1">Grade</div>
                </div>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${report.score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${report.score >= 75 ? "bg-green-400" : report.score >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                />
              </div>
              <p className="text-xs text-gray-300">{report.summary}</p>
            </GlassCard>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Total", value: report.totalApprovals, icon: <Shield className="w-4 h-4 text-cyan-400" /> },
                { label: "Unlimited", value: report.unlimitedApprovals, icon: <TrendingDown className="w-4 h-4 text-orange-400" /> },
                { label: "Risky", value: report.riskyApprovals, icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
              ].map((s) => (
                <GlassCard key={s.label} animate={false} className="text-center py-3">
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <div className="text-lg font-bold text-white font-display">{s.value}</div>
                  <div className="text-[10px] text-gray-500">{s.label}</div>
                </GlassCard>
              ))}
            </div>

            {/* Chain breakdown */}
            {report.chainBreakdown.length > 0 && (
              <GlassCard className="mb-4">
                <div className="text-xs font-mono text-gray-500 mb-3 tracking-wider">CHAIN BREAKDOWN</div>
                {report.chainBreakdown.map((ch) => (
                  <div key={ch.chain} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-white">{ch.chain}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{ch.count} approvals</span>
                      {ch.risk > 0 && <span className="chip-danger text-[9px]">{ch.risk} risky</span>}
                    </div>
                  </div>
                ))}
              </GlassCard>
            )}

            {/* Tips */}
            <GlassCard>
              <div className="text-xs font-mono text-gray-500 mb-3 tracking-wider">RECOMMENDATIONS</div>
              {report.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-300">{tip}</span>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        )}

        {!report && !loading && (
          <GlassCard>
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-white">Wallet Health Score</strong> analyzes all active token approvals across chains and gives you a grade from A (safe) to F (critical risk).
                <div className="mt-2">Factors: unlimited approvals, unknown spenders, risky contracts, total exposure.</div>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
      <NavBar />
    </main>
  );
}
