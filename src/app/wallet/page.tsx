"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Copy, Star, Flame, Trophy,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import GlassCard from "@/components/GlassCard";
import { currentUser, badges as allBadges, quests } from "@/data/mock";

export default function WalletPage() {
  const user = currentUser;
  const userBadges = allBadges.filter((b) => user.badges.includes(b.id));
  const completedQuests = quests.filter((q) => q.isCompleted);

  const rarityColor = {
    common: "border-gray-400/20",
    rare: "border-cyan-400/20",
    epic: "border-purple-400/20",
    legendary: "border-orange-400/20",
  };

  return (
    <main className="min-h-dvh pb-24">
      {/* Header */}
      <header className="max-w-lg mx-auto px-5 pt-5 flex items-center justify-between">
        <Link href="/dashboard" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold font-display text-white">Wallet</h1>
        <div className="w-5" />
      </header>

      {/* Wallet card */}
      <section className="max-w-lg mx-auto px-5 mt-5">
        <GlassCard glow="cyan">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">{user.avatar}</div>
            <div className="flex-1">
              <div className="font-bold text-white">{user.name}</div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="font-mono">{user.walletAddress}</span>
                <button className="text-cyan-400 hover:text-cyan-300">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <Star className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-orange-400 font-display">{user.points.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500">Points</div>
            </div>
            <div className="text-center">
              <Trophy className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-purple-400 font-display">{userBadges.length}</div>
              <div className="text-[10px] text-gray-500">Badges</div>
            </div>
            <div className="text-center">
              <Flame className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-cyan-400 font-display">{user.streak}</div>
              <div className="text-[10px] text-gray-500">Streak</div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* NFT Badges */}
      <section className="max-w-lg mx-auto px-5 mt-6">
        <div className="text-xs font-mono text-gray-500 mb-3 tracking-wider">NFT BADGES</div>
        <div className="grid grid-cols-3 gap-3">
          {userBadges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard
                animate={false}
                className={`text-center py-4 border ${rarityColor[badge.rarity]}`}
              >
                <div className="text-3xl mb-2">{badge.image}</div>
                <div className="text-xs font-semibold text-white">{badge.name}</div>
                <div className="text-[9px] text-gray-500 mt-1">{badge.rarity}</div>
              </GlassCard>
            </motion.div>
          ))}

          {/* Empty slots */}
        {Array.from({ length: Math.max(0, 3 - userBadges.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="glass p-4 border-white/5 text-center opacity-30">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-[10px] text-gray-600">Locked</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quest History */}
      <section className="max-w-lg mx-auto px-5 mt-6">
        <div className="text-xs font-mono text-gray-500 mb-3 tracking-wider">QUEST HISTORY</div>
        {completedQuests.length === 0 ? (
          <GlassCard className="text-center py-6">
            <div className="text-gray-500 text-sm">No quests completed yet</div>
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {completedQuests.map((quest) => (
              <GlassCard key={quest.id} animate={false} className="py-3">
                <div className="flex items-center gap-3">
                  <div className="text-xl">{quest.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{quest.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="chip-cyan text-[9px]">+{quest.rewardXP} XP</span>
                      <span className="chip-orange text-[9px]">+{quest.rewardPoints} pts</span>
                    </div>
                  </div>
                  <div className="chip-success text-[9px]">✓</div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      {/* On-chain activity */}
      <section className="max-w-lg mx-auto px-5 mt-6">
        <div className="text-xs font-mono text-gray-500 mb-3 tracking-wider">ON-CHAIN ACTIVITY</div>
        <GlassCard className="py-3">
          {userBadges.map((badge) => (
            <div key={badge.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              <div className="text-lg">{badge.image}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-300">Minted {badge.name}</div>
                <div className="text-[10px] text-gray-500 font-mono truncate">{badge.txHash}</div>
              </div>
              <div className="text-[10px] text-gray-500">{badge.mintedAt}</div>
            </div>
          ))}
        </GlassCard>
      </section>

      <NavBar />
    </main>
  );
}
