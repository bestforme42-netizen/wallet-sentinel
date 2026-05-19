"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy, Star, Share2, ExternalLink, ArrowRight, Check,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { quests } from "@/data/mock";

export default function RewardPage() {
  const params = useParams();
  const quest = quests.find((q) => q.id === params.id);
  const [minting, setMinting] = useState(true);
  const [minted, setMinted] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setMinting(false);
      setMinted(true);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  if (!quest) return null;

  const mockTxHash = "0x" + Math.random().toString(16).slice(2, 10) + "…" + Math.random().toString(16).slice(2, 10);

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-5 py-12">
      <div className="max-w-sm w-full">
        {/* Minting animation */}
        {minting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-lg font-semibold text-white font-display">Minting Badge…</div>
            <div className="text-sm text-gray-400 mt-1">Writing to blockchain</div>
            <div className="flex justify-center gap-1 mt-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Success */}
        {minted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Celebration */}
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-6xl mb-3 inline-block"
              >
                🎉
              </motion.div>
              <h1 className="text-2xl font-bold font-display text-white">Quest Complete!</h1>
              <p className="text-sm text-gray-400 mt-1">{quest.title}</p>
            </div>

            {/* Badge */}
            <GlassCard glow="purple" className="text-center mb-4">
              <div className="text-5xl mb-3">{quest.icon}</div>
              <div className="text-lg font-bold text-white font-display">{quest.badgeName}</div>
              <div className="chip-purple text-[10px] mt-2">{quest.badgeRarity.toUpperCase()}</div>
            </GlassCard>

            {/* Rewards summary */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <GlassCard animate={false} className="text-center py-3">
                <Star className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-cyan-400 font-display">+{quest.rewardXP}</div>
                <div className="text-[10px] text-gray-500">XP Earned</div>
              </GlassCard>
              <GlassCard animate={false} className="text-center py-3">
                <Trophy className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-orange-400 font-display">+{quest.rewardPoints}</div>
                <div className="text-[10px] text-gray-500">Points Earned</div>
              </GlassCard>
            </div>

            {/* TX Hash */}
            <GlassCard className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500 font-mono">TRANSACTION</div>
                  <div className="text-xs font-mono text-gray-400 mt-1">{mockTxHash}</div>
                </div>
                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </GlassCard>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setShared(true)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                  shared ? "glass border-green-400/20 text-green-400" : "btn-ghost"
                }`}
              >
                {shared ? <><Check className="w-4 h-4" /> Shared!</> : <><Share2 className="w-4 h-4" /> Share Achievement</>}
              </button>

              <Link href="/dashboard" className="btn-cyan w-full flex items-center justify-center gap-2 py-3">
                Continue <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
