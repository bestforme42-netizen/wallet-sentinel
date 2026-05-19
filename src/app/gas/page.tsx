"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fuel, RefreshCw, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NavBar from "@/components/NavBar";

interface GasPrice {
  chain: string;
  chainId: number;
  symbol: string;
  low: number;
  average: number;
  fast: number;
  trend: "up" | "down" | "stable";
  color: string;
}

const mockGas: GasPrice[] = [
  { chain: "Ethereum", chainId: 1, symbol: "ETH", low: 12, average: 18, fast: 25, trend: "up", color: "text-blue-400" },
  { chain: "Base", chainId: 8453, symbol: "ETH", low: 0.01, average: 0.02, fast: 0.05, trend: "stable", color: "text-cyan-400" },
  { chain: "Arbitrum", chainId: 42161, symbol: "ETH", low: 0.1, average: 0.2, fast: 0.3, trend: "down", color: "text-blue-300" },
  { chain: "Optimism", chainId: 10, symbol: "ETH", low: 0.01, average: 0.03, fast: 0.05, trend: "stable", color: "text-red-400" },
  { chain: "Polygon", chainId: 137, symbol: "POL", low: 20, average: 30, fast: 50, trend: "up", color: "text-purple-400" },
  { chain: "BSC", chainId: 56, symbol: "BNB", low: 1, average: 3, fast: 5, trend: "stable", color: "text-yellow-400" },
  { chain: "Avalanche", chainId: 43114, symbol: "AVAX", low: 1, average: 2, fast: 4, trend: "down", color: "text-red-300" },
];

const TrendIcon = ({ t }: { t: "up" | "down" | "stable" }) => {
  if (t === "up") return <TrendingUp className="w-3.5 h-3.5 text-red-400" />;
  if (t === "down") return <TrendingDown className="w-3.5 h-3.5 text-green-400" />;
  return <Minus className="w-3.5 h-3.5 text-gray-400" />;
};

export default function GasPage() {
  const [gas, setGas] = useState<GasPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchGas = async () => {
    setLoading(true);
    // Simulate fetch with small random variation
    await new Promise((r) => setTimeout(r, 800));
    const varied = mockGas.map((g) => ({
      ...g,
      low: +(g.low * (0.9 + Math.random() * 0.2)).toFixed(2),
      average: +(g.average * (0.9 + Math.random() * 0.2)).toFixed(2),
      fast: +(g.fast * (0.9 + Math.random() * 0.2)).toFixed(2),
      trend: (["up", "down", "stable"] as const)[Math.floor(Math.random() * 3)],
    }));
    setGas(varied);
    setLastUpdate(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => { fetchGas(); }, []);

  return (
    <main className="min-h-dvh pb-24">
      <header className="bg-gradient-to-b from-orange-400/5 to-transparent pt-6 pb-6 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400/20 to-yellow-400/20 flex items-center justify-center mx-auto mb-4 border border-orange-400/10">
            <Fuel className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Gas Tracker</h1>
          <p className="text-sm text-gray-400 mt-1">Real-time gas prices across all supported chains</p>
          {lastUpdate && <p className="text-[10px] text-gray-500 mt-1">Last updated: {lastUpdate}</p>}
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        <button onClick={fetchGas} disabled={loading} className="btn-ghost w-full mb-4 flex items-center justify-center gap-2 py-2.5 text-sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {loading ? "Refreshing…" : "Refresh Prices"}
        </button>

        <div className="space-y-3">
          {gas.map((g, i) => (
            <motion.div key={g.chainId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <GlassCard animate={false}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${g.color}`}>{g.chain}</span>
                    <TrendIcon t={g.trend} />
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">{g.symbol}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "🐌 Low", value: g.low, cls: "text-green-400" },
                    { label: "⚡ Avg", value: g.average, cls: "text-yellow-400" },
                    { label: "🚀 Fast", value: g.fast, cls: "text-red-400" },
                  ].map((s) => (
                    <div key={s.label} className="text-center glass border-white/5 p-2 rounded-lg">
                      <div className={`text-sm font-bold font-mono ${s.cls}`}>{s.value}</div>
                      <div className="text-[9px] text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard className="mt-4">
          <div className="text-xs text-gray-400 text-center">
            💡 <strong className="text-white">Tip:</strong> Gas prices are in Gwei. L2s (Base, Arbitrum, Optimism) are 100-1000x cheaper than Ethereum mainnet.
          </div>
        </GlassCard>
      </div>
      <NavBar />
    </main>
  );
}
