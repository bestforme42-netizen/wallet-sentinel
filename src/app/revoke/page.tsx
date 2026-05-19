"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, CheckCircle, XCircle, AlertTriangle, Loader2, Shield,
} from "lucide-react";
import ChainSelector from "@/components/ChainSelector";
import GlassCard from "@/components/GlassCard";
import NavBar from "@/components/NavBar";

interface Approval {
  token: string;
  spender: string;
  amountDisplay: string;
  isUnlimited: boolean;
  risk: { level: string; label: string; factors: string[] };
  chainName: string;
  chainId: number;
  explorerLink: string;
}

const riskColor: Record<string, string> = {
  critical: "text-red-400", high: "text-orange-400", medium: "text-yellow-400", low: "text-cyan-400", safe: "text-green-400",
};

export default function RevokePage() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("all");
  const [loading, setLoading] = useState(false);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [revoking, setRevoking] = useState(false);
  const [revokeResult, setRevokeResult] = useState<{ success: number; failed: number } | null>(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) { setError("Enter a valid address"); return; }
    setError(""); setLoading(true); setApprovals([]); setSelected(new Set()); setRevokeResult(null);
    try {
      const res = await fetch(`/api/scan?address=${address}&chain=${chain}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApprovals(data.approvals || []);
      // Auto-select critical + high risk
      const autoSelect = new Set<number>();
      (data.approvals || []).forEach((a: Approval, i: number) => {
        if (["critical", "high"].includes(a.risk.level)) autoSelect.add(i);
      });
      setSelected(autoSelect);
    } catch (e) { setError(e instanceof Error ? e.message : "Scan failed"); }
    finally { setLoading(false); }
  };

  const toggle = (i: number) => {
    const next = new Set(selected);
    if (next.has(i)) { next.delete(i); } else { next.add(i); }
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === approvals.length) setSelected(new Set());
    else setSelected(new Set(approvals.map((_, i) => i)));
  };

  const handleRevoke = async () => {
    if (selected.size === 0) return;
    const eth = typeof window !== "undefined" ? (window as { ethereum?: { request: (a: { method: string; params: unknown[] }) => Promise<unknown> } }).ethereum : undefined;
    if (!eth) { setError("No wallet connected"); return; }

    setRevoking(true); setRevokeResult(null);
    let success = 0, failed = 0;

    for (const i of Array.from(selected)) {
      const a = approvals[i];
      try {
        const cd = "0x095ea7b3" + a.spender.slice(2).padStart(64, "0") + "0".repeat(64);
        await eth.request({
          method: "eth_sendTransaction",
          params: [{ from: address, to: a.token, data: cd }],
        });
        success++;
      } catch {
        failed++;
      }
    }

    setRevokeResult({ success, failed });
    setRevoking(false);
    // Re-scan after revoke
    if (success > 0) setTimeout(handleScan, 3000);
  };

  return (
    <main className="min-h-dvh pb-24">
      <header className="bg-gradient-to-b from-red-400/5 to-transparent pt-6 pb-6 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400/20 to-orange-400/20 flex items-center justify-center mx-auto mb-4 border border-red-400/10">
            <Trash2 className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Batch Revoke</h1>
          <p className="text-sm text-gray-400 mt-1">Select and revoke multiple approvals at once</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        {/* Scan input */}
        <GlassCard className="mb-4">
          <div className="space-y-3">
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x... wallet address"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none font-mono" />
            <ChainSelector selected={chain} onSelect={setChain} />
            <button onClick={handleScan} disabled={loading || !address} className="btn-cyan w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning…</> : <><Shield className="w-4 h-4" /> Scan Approvals</>}
            </button>
          </div>
        </GlassCard>

        {error && <div className="glass border-red-400/20 p-3 mb-4 flex items-center gap-2 text-red-400 text-sm"><XCircle className="w-4 h-4" /> {error}</div>}

        {/* Results */}
        {approvals.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono text-gray-500 tracking-wider">{approvals.length} APPROVALS FOUND</div>
              <button onClick={selectAll} className="text-xs text-cyan-400 hover:text-cyan-300">
                {selected.size === approvals.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {approvals.map((a, i) => {
                const isSelected = selected.has(i);
              
                return (
                  <motion.button key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    onClick={() => toggle(i)}
                    className={`w-full text-left glass p-3 rounded-xl transition-all ${
                      isSelected ? "border-red-400/30 bg-red-400/5" : "border-white/5 hover:bg-white/[0.03]"
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-red-400/20 border-red-400/40" : "border-white/10"
                      }`}>
                        {isSelected && <CheckCircle className="w-3 h-3 text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-white truncate">{a.token.slice(0, 8)}…{a.token.slice(-6)}</span>
                          <span className={`text-[9px] font-mono ${riskColor[a.risk.level] || "text-gray-400"}`}>{a.risk.label}</span>
                          {a.isUnlimited && <span className="chip-danger text-[8px]">UNLIMITED</span>}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          → {a.spender.slice(0, 8)}…{a.spender.slice(-6)} on {a.chainName}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Revoke button */}
            <button onClick={handleRevoke} disabled={selected.size === 0 || revoking}
              className="btn-danger w-full flex items-center justify-center gap-2 py-3.5 text-base font-semibold disabled:opacity-30">
              {revoking ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Revoking {selected.size} approvals…</>
              ) : (
                <><Trash2 className="w-5 h-5" /> Revoke {selected.size} Selected</>
              )}
            </button>

            {/* Result */}
            <AnimatePresence>
              {revokeResult && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <GlassCard className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      {revokeResult.failed === 0 ? <CheckCircle className="w-5 h-5 text-green-400" /> : <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                      <span className="text-sm font-semibold text-white">Revoke Complete</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      ✅ {revokeResult.success} revoked{revokeResult.failed > 0 ? ` · ❌ ${revokeResult.failed} failed` : ""}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {approvals.length === 0 && !loading && !error && (
          <GlassCard>
            <div className="text-center py-4">
              <Trash2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-sm text-gray-400">Enter an address to scan for approvals</div>
              <div className="text-xs text-gray-500 mt-1">Select the ones you want to revoke in bulk</div>
            </div>
          </GlassCard>
        )}
      </div>
      <NavBar />
    </main>
  );
}
