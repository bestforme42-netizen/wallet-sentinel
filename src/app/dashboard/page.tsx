"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Loader2,
  ExternalLink, ChevronDown, Zap, RefreshCw, Info,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import ChainSelector from "@/components/ChainSelector";
import GlassCard from "@/components/GlassCard";

interface Approval {
  token: string;
  spender: string;
  amountDisplay: string;
  isUnlimited: boolean;
  risk: {
    level: string;
    label: string;
    factors: string[];
  };
  chainId: number;
  chainName: string;
  explorerLink: string;
}

const riskColors: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-red-400/10", text: "text-red-400", border: "border-red-400/20" },
  high: { bg: "bg-orange-400/10", text: "text-orange-400", border: "border-orange-400/20" },
  medium: { bg: "bg-yellow-400/10", text: "text-yellow-400", border: "border-yellow-400/20" },
  low: { bg: "bg-blue-400/10", text: "text-blue-400", border: "border-blue-400/20" },
  safe: { bg: "bg-green-400/10", text: "text-green-400", border: "border-green-400/20" },
};

export default function DashboardPage() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("all");
  const [loading, setLoading] = useState(false);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState("");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const handleScan = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError("Enter a valid wallet address (0x...)");
      return;
    }
    setError("");
    setLoading(true);
    setScanned(false);

    try {
      const chainParam = chain === "all" ? "all" : chain;
      const res = await fetch(`/api/scan?address=${address}&chain=${chainParam}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setApprovals(data.approvals || []);
      setScanned(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = (approval: Approval) => {
    // Encode approve(spender, 0) calldata
    const approveSelector = "0x095ea7b3";
    const spenderPadded = approval.spender.toLowerCase().replace("0x", "").padStart(64, "0");
    const zeroPadded = "0".repeat(64);
    const calldata = approveSelector + spenderPadded + zeroPadded;

    // Trigger wallet popup (MetaMask)
    const eth = typeof window !== "undefined" ? (window as {ethereum?: {request: (a: {method: string; params: unknown[]}) => Promise<unknown>}}).ethereum : undefined;
    if (eth) {
      eth.request({
        method: "eth_sendTransaction",
        params: [{ from: address, to: approval.token, data: calldata }],
      });
    } else {
      alert("Connect a wallet extension (MetaMask, Rabby, etc.) to revoke approvals.");
    }
  };

  return (
    <main className="min-h-dvh pb-24">
      {/* Header */}
      <header className="bg-gradient-to-b from-cyan-400/5 to-transparent pt-6 pb-6 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-orange-400/20 flex items-center justify-center mx-auto mb-3 border border-cyan-400/10">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-xl font-bold font-display text-white">Approval Scanner</h1>
          <p className="text-xs text-gray-400 mt-1">Scan any wallet for risky token approvals across all chains</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        {/* Scan form */}
        <GlassCard className="mb-4">
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x... wallet address to scan"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none transition-colors font-mono"
              />
            </div>
            <ChainSelector selected={chain} onSelect={setChain} />
            <button
              onClick={handleScan}
              disabled={loading || !address}
              className="btn-cyan w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Scanning…</>
              ) : (
                <><Zap className="w-4 h-4" /> Scan Approvals</>
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
        {scanned && (
          <>
            {/* Summary bar */}
            <div className="glass border-cyan-400/10 p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-300">
                  Found <strong className="text-white">{approvals.length}</strong> active approvals
                </span>
              </div>
              <button onClick={handleScan} className="text-cyan-400 hover:text-cyan-300">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {approvals.length === 0 ? (
              <GlassCard className="text-center py-8">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <div className="text-white font-semibold">All Clear!</div>
                <div className="text-sm text-gray-400 mt-1">No risky approvals found for this wallet.</div>
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {approvals.map((a, i) => {
                  const rc = riskColors[a.risk.level] || riskColors.low;
                  const isExpanded = expandedIdx === i;

                  return (
                    <motion.div
                      key={`${a.chainId}-${a.token}-${a.spender}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlassCard animate={false} className={`border ${rc.border}`}>
                        <button
                          onClick={() => setExpandedIdx(isExpanded ? null : i)}
                          className="w-full text-left"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`chip text-[10px] ${rc.bg} ${rc.text} border ${rc.border}`}>
                                  {a.risk.label}
                                </span>
                                <span className="chip text-[10px] bg-white/5 text-gray-400 border border-white/5">
                                  {a.chainName}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400 font-mono truncate">
                                Token: {a.token.slice(0, 8)}…{a.token.slice(-6)}
                              </div>
                              <div className="text-xs text-gray-400 font-mono truncate">
                                Spender: {a.spender.slice(0, 8)}…{a.spender.slice(-6)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Amount: {a.isUnlimited ? "⚠️ Unlimited" : a.amountDisplay}
                              </div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3 mt-3 border-t border-white/5 space-y-3">
                                {/* Risk factors */}
                                <div>
                                  <div className="text-[10px] text-gray-500 font-mono mb-2">RISK FACTORS</div>
                                  {a.risk.factors.map((f, j) => (
                                    <div key={j} className="flex items-start gap-2 mb-1.5">
                                      <AlertTriangle className="w-3 h-3 text-orange-400 mt-0.5 shrink-0" />
                                      <span className="text-xs text-gray-400">{f}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleRevoke(a)}
                                    className="btn-danger flex-1 flex items-center justify-center gap-1.5 py-2 text-xs"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Revoke Approval
                                  </button>
                                  <a
                                    href={a.explorerLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-ghost flex items-center gap-1.5 px-3 py-2 text-xs"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Info box */}
        {!scanned && !loading && (
          <GlassCard className="mt-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-white">How it works:</strong> Enter any wallet address to scan for active ERC-20 token approvals. 
                Approvals let smart contracts spend your tokens — unlimited approvals are the #1 cause of wallet drains.
                <div className="mt-2 flex flex-wrap gap-2">
                  {["ETH", "Base", "ARB", "OP", "MATIC", "BSC", "AVAX"].map((c) => (
                    <span key={c} className="chip text-[9px] bg-white/5 text-gray-400 border border-white/5">{c}</span>
                  ))}
                  <span className="text-[9px] text-gray-500">+ more</span>
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
