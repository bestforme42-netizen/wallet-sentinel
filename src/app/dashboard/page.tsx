"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAccount, useSendTransaction } from "wagmi";
import { isAddress, encodeFunctionData, erc20Abi } from "viem";
import { ConnectButton } from "@/components/ConnectButton";
import { scoreAll, type ApprovalRecord, type RiskReport } from "@/lib/risk-engine";
import {
  Shield, Eye, AlertTriangle, ShieldCheck, ShieldX,
  CheckCircle, ExternalLink, RefreshCw, Search, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BASESCAN_BASE } from "@/lib/contracts";

type ScanResponse = {
  address: string;
  scannedBlocks: { from: number; to: number };
  activeApprovals: number;
  approvals: Array<{
    token: string;
    spender: string;
    amount: string;
    blockNumber: number;
    txHash: string;
  }>;
};

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [target, setTarget] = useState("");
  const [reports, setReports] = useState<RiskReport[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [scannedAddress, setScannedAddress] = useState("");
  const [scannedRange, setScannedRange] = useState<{ from: number; to: number } | null>(null);

  const handleScan = useCallback(async (addr: string) => {
    if (!isAddress(addr)) {
      setError("Invalid Ethereum address");
      return;
    }
    setScanning(true);
    setError("");
    setScannedAddress(addr);
    setReports([]);

    try {
      const res = await fetch(`/api/scan?address=${addr}`);
      if (!res.ok) throw new Error(`Scan failed: ${res.status}`);
      const data: ScanResponse = await res.json();

      setScannedRange(data.scannedBlocks);

      const records: ApprovalRecord[] = data.approvals.map((a) => ({
        token: a.token,
        tokenName: a.token.slice(0, 10) + "…",
        tokenSymbol: "?",
        spender: a.spender,
        amount: a.amount,
        amountFormatted: (parseFloat(BigInt(a.amount).toString()) / 1e18).toFixed(2),
        isUnlimited: BigInt(a.amount) >= BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
        blockNumber: a.blockNumber,
        txHash: a.txHash,
        timestamp: 0,
      }));

      setReports(scoreAll(records));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setScanning(false);
    }
  }, []);

  const riskCounts = {
    critical: reports.filter((r) => r.risk === "critical").length,
    high: reports.filter((r) => r.risk === "high").length,
    medium: reports.filter((r) => r.risk === "medium").length,
    low: reports.filter((r) => r.risk === "low").length,
    safe: reports.filter((r) => r.risk === "safe").length,
  };

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold inline-flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-green" />
          Wallet Sentinel
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-ink-mid hover:text-ink-hi text-sm transition-colors">Home</Link>
          <ConnectButton />
        </div>
      </header>

      {/* Scan bar */}
      <section className="max-w-4xl mx-auto px-6 mt-10">
        <div className="text-xs font-mono text-ink-low mb-3">WALLET SCANNER</div>
        <div className="panel p-4 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-ink-bg rounded-lg px-4 py-2.5">
            <Search className="w-4 h-4 text-ink-mid" />
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0x… or paste any address"
              className="bg-transparent flex-1 outline-none text-sm font-mono text-ink-hi placeholder:text-ink-mid"
              onKeyDown={(e) => { if (e.key === "Enter") handleScan(target); }}
            />
          </div>
          <button
            onClick={() => handleScan(target || address || "")}
            disabled={scanning || (!target && !address)}
            className="btn-primary inline-flex items-center gap-2 shrink-0"
          >
            {scanning ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Scanning…</>
            ) : (
              <><Eye className="w-4 h-4" /> Scan</>
            )}
          </button>
          {isConnected && address && (
            <button
              onClick={() => handleScan(address)}
              disabled={scanning}
              className="btn-ghost text-xs"
              title="Scan connected wallet"
            >
              My wallet
            </button>
          )}
        </div>

        {error && (
          <div className="mt-3 panel p-3 border-danger/30 text-sm text-danger flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {error}
          </div>
        )}
      </section>

      {/* Results */}
      {scannedAddress && (
        <section className="max-w-4xl mx-auto px-6 mt-8">
          {/* Summary row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-mono text-ink-low">SCAN RESULTS</div>
              <div className="text-sm font-mono text-ink-hi mt-1">
                {scannedAddress.slice(0, 6)}…{scannedAddress.slice(-4)}
              </div>
            </div>
            {scannedRange && (
              <div className="text-xs text-ink-mid font-mono">
                blocks {scannedRange.from} → {scannedRange.to}
              </div>
            )}
          </div>

          {reports.length === 0 && !scanning && !error && (
            <div className="panel p-8 text-center text-ink-mid">
              No active approvals found for this address.
            </div>
          )}

          {/* Risk summary cards */}
          {reports.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {[
                { label: "Critical", count: riskCounts.critical, cls: "border-danger/30 bg-danger/5" },
                { label: "High", count: riskCounts.high, cls: "border-danger/20 bg-danger/3" },
                { label: "Medium", count: riskCounts.medium, cls: "border-warn/20 bg-warn/5" },
                { label: "Low", count: riskCounts.low, cls: "border-neon-blue/20 bg-neon-blue/5" },
                { label: "Safe", count: riskCounts.safe, cls: "border-safe/20 bg-safe/5" },
              ].map((c) => (
                <div key={c.label} className={`panel p-3 border ${c.cls}`}>
                  <div className="text-xs text-ink-mid">{c.label}</div>
                  <div className="text-2xl font-bold mt-1">{c.count}</div>
                </div>
              ))}
            </div>
          )}

          {/* Approval rows */}
          <AnimatePresence>
            {reports.map((report, i) => (
              <motion.div
                key={report.approval.token + report.approval.spender}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ApprovalRow report={report} />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      )}
    </main>
  );
}

function ApprovalRow({ report }: { report: RiskReport }) {
  const { approval, risk, reasons, recommendation } = report;
  const [expanded, setExpanded] = useState(false);
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();

  const riskConfig = {
    critical: { chip: "chip-danger", icon: <ShieldX className="w-4 h-4 text-danger" />, glow: "glow-danger" },
    high:     { chip: "chip-danger", icon: <AlertTriangle className="w-4 h-4 text-danger" />, glow: "glow-danger" },
    medium:   { chip: "chip-warn",   icon: <AlertTriangle className="w-4 h-4 text-warn" />,   glow: "glow-warn" },
    low:      { chip: "chip",        icon: <ShieldCheck className="w-4 h-4 text-neon-blue" />, glow: "" },
    safe:     { chip: "chip-safe",   icon: <ShieldCheck className="w-4 h-4 text-safe" />,     glow: "glow-safe" },
  }[risk];

  const handleRevoke = () => {
    sendTransaction({
      to: approval.token as `0x${string}`,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [approval.spender as `0x${string}`, BigInt(0)],
      }),
    });
  };

  return (
    <div className={`panel p-4 mb-3 ${riskConfig.glow}`}>
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 shrink-0 flex justify-center">{riskConfig.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-ink-hi">
              {approval.token.slice(0, 8)}…{approval.token.slice(-4)}
            </span>
            <span className="text-xs text-ink-mid">→</span>
            <span className="font-mono text-sm text-ink-hi">
              {approval.spender.slice(0, 8)}…{approval.spender.slice(-4)}
            </span>
          </div>
          <div className="text-xs text-ink-mid mt-1 flex items-center gap-2">
            <span className={riskConfig.chip}>{risk.toUpperCase()}</span>
            {approval.isUnlimited && (
              <span className="chip-danger">UNLIMITED</span>
            )}
            <span className="text-ink-low font-mono">
              {approval.isUnlimited ? "∞" : approval.amountFormatted} tokens
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`${BASESCAN_BASE}/tx/${approval.txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-ink-mid hover:text-ink-hi p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {(risk === "critical" || risk === "high") && !isSuccess && (
            <button
              onClick={(e) => { e.stopPropagation(); handleRevoke(); }}
              disabled={isPending}
              className="btn-danger text-xs px-3 py-1.5"
            >
              {isPending ? "Revoking…" : "Revoke"}
            </button>
          )}
          {isSuccess && (
            <span className="chip-safe text-xs"><CheckCircle className="w-3 h-3" /> Revoked</span>
          )}
          <ChevronDown className={`w-4 h-4 text-ink-mid transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-white/5">
              <div className="text-xs text-ink-mid">
                <strong className="text-ink-hi">Risk factors:</strong>{" "}
                {reasons.join(", ") || "none detected"}
              </div>
              <div className="text-xs text-ink-mid mt-2">
                <strong className="text-ink-hi">Recommendation:</strong> {recommendation}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-ink-low font-mono">
                <span>Block: {approval.blockNumber}</span>
                <a
                  href={`${BASESCAN_BASE}/tx/${approval.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ink-hi"
                >
                  TX: {approval.txHash.slice(0, 10)}…
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
