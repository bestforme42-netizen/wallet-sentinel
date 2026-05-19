"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame, Star, MapPin, Trophy, ChevronRight, Zap, Footprints, Target,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import GlassCard from "@/components/GlassCard";
import { currentUser, quests } from "@/data/mock";

export default function DashboardPage() {
  const user = currentUser;
  const activeQuest = quests.find((q) => q.isActive);
  const xpProgress = ((user.xp % 500) / 500) * 100;

  return (
    <main className="min-h-dvh pb-24">
      {/* Header */}
      <header className="max-w-lg mx-auto px-5 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{user.avatar}</div>
          <div>
            <div className="text-sm text-gray-400">Welcome back,</div>
            <div className="font-bold text-white font-display">{user.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 chip-cyan">
          <Flame className="w-3.5 h-3.5" />
          {user.streak} day streak
        </div>
      </header>

      {/* Level & XP */}
      <section className="max-w-lg mx-auto px-5 mt-5">
        <GlassCard glow="cyan">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-lg font-bold text-cyan-400 font-display">
                {user.level}
              </div>
              <div>
                <div className="text-xs text-gray-400">Level</div>
                <div className="text-sm font-semibold text-white">Crypto Explorer</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">XP</div>
              <div className="text-sm font-bold font-mono text-cyan-400">{user.xp.toLocaleString()}</div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${xpProgress}%` }} />
          </div>
          <div className="text-[10px] text-gray-500 mt-1 text-right">
            {user.xp % 500} / 500 XP to Level {user.level + 1}
          </div>
        </GlassCard>
      </section>

      {/* Quick stats */}
      <section className="max-w-lg mx-auto px-5 mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: <Star className="w-4 h-4 text-orange-400" />, label: "Points", value: user.points.toLocaleString() },
          { icon: <Trophy className="w-4 h-4 text-purple-400" />, label: "Badges", value: user.badges.length },
          { icon: <Target className="w-4 h-4 text-green-400" />, label: "Quests", value: user.questsCompleted },
        ].map((s) => (
          <GlassCard key={s.label} animate={false} className="text-center py-3">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <div className="text-lg font-bold font-display text-white">{s.value}</div>
            <div className="text-[10px] text-gray-500">{s.label}</div>
          </GlassCard>
        ))}
      </section>

      {/* Active Quest */}
      {activeQuest && (
        <section className="max-w-lg mx-auto px-5 mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono text-gray-500 tracking-wider">ACTIVE QUEST</div>
            <Link href="/map" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <Link href={`/quest/${activeQuest.id}`}>
            <GlassCard glow="orange" className="cursor-pointer hover:bg-white/[0.06] transition-colors">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{activeQuest.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{activeQuest.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{activeQuest.movementGoal}</div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span className="flex items-center gap-1">
                        <Footprints className="w-3 h-3" /> Progress
                      </span>
                      <span>{Math.round(activeQuest.movementProgress * 100)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${activeQuest.movementProgress * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="chip-cyan text-[10px]">+{activeQuest.rewardXP} XP</span>
                    <span className="chip-orange text-[10px]">+{activeQuest.rewardPoints} pts</span>
                    <span className={`chip text-[10px] ${
                      activeQuest.difficulty === "easy" ? "chip-success" :
                      activeQuest.difficulty === "medium" ? "chip-orange" : "chip-danger"
                    }`}>
                      {activeQuest.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
        </section>
      )}

      {/* Recent Badges */}
      <section className="max-w-lg mx-auto px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-mono text-gray-500 tracking-wider">RECENT BADGES</div>
          <Link href="/wallet" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {user.badges.map((badgeId, i) => (
            <motion.div
              key={badgeId}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="glass p-3 border-white/5 min-w-[100px] text-center shrink-0"
            >
              <div className="text-3xl mb-1">{["🎣", "🔐", "🛡️"][i]}</div>
              <div className="text-[10px] text-gray-400">{["Phishing", "Seed Guard", "Wallet"][i]}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-lg mx-auto px-5 mt-5 grid grid-cols-2 gap-3">
        <Link href="/map">
          <GlassCard className="cursor-pointer hover:bg-white/[0.06] transition-colors text-center py-5">
            <MapPin className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">Open Map</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Find quests nearby</div>
          </GlassCard>
        </Link>
        <Link href="/leaderboard">
          <GlassCard className="cursor-pointer hover:bg-white/[0.06] transition-colors text-center py-5">
            <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">Leaderboard</div>
            <div className="text-[10px] text-gray-500 mt-0.5">See your rank</div>
          </GlassCard>
        </Link>
      </section>

      <NavBar />
    </main>
  );
}
