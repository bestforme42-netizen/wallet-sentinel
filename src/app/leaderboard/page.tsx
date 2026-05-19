"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Star, Medal, Crown } from "lucide-react";
import NavBar from "@/components/NavBar";
import GlassCard from "@/components/GlassCard";
import { leaderboard } from "@/data/mock";

const rankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
  return <span className="text-sm text-gray-500 font-mono w-5 text-center">{rank}</span>;
};

export default function LeaderboardPage() {
  return (
    <main className="min-h-dvh pb-24">
      {/* Header */}
      <header className="max-w-lg mx-auto px-5 pt-5">
        <div className="text-xs font-mono text-gray-500 tracking-wider">LEADERBOARD</div>
        <h1 className="text-xl font-bold font-display text-white">Weekly Rankings</h1>
      </header>

      {/* Top 3 podium */}
      <section className="max-w-lg mx-auto px-5 mt-5">
        <div className="flex items-end justify-center gap-3">
          {leaderboard.slice(0, 3).map((entry, i) => {
            const positions = [1, 0, 2]; // second, first, third
            const e = leaderboard[positions[i]];
            const heights = ["h-24", "h-32", "h-20"];
            const glows = ["shadow-glow-orange", "shadow-glow", "shadow-glow-purple"];
            return (
              <motion.div
                key={e.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`glass ${glows[i]} border-white/10 ${heights[i]} w-28 flex flex-col items-center justify-end pb-3 rounded-t-2xl`}
              >
                <div className="text-2xl mb-1">{e.avatar}</div>
                <div className="text-xs font-semibold text-white truncate max-w-full px-2 text-center">{e.name}</div>
                <div className="text-[10px] text-gray-400 font-mono">{e.xp.toLocaleString()} XP</div>
                <div className="absolute -top-3">{rankIcon(e.rank)}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Full list */}
      <section className="max-w-lg mx-auto px-5 mt-6">
        <div className="space-y-2">
          {leaderboard.slice(3).map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (i + 3) * 0.05 }}
            >
              <GlassCard
                animate={false}
                className={`py-3 ${entry.isCurrentUser ? "border-cyan-400/20" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 flex justify-center">{rankIcon(entry.rank)}</div>
                  <div className="text-xl">{entry.avatar}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      {entry.name}
                      {entry.isCurrentUser && <span className="chip-cyan text-[9px]">YOU</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" /> {entry.xp.toLocaleString()} XP
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> {entry.badges} badges
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" /> {entry.streak}d streak
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <NavBar />
    </main>
  );
}
