"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Footprints, Star, Clock, Play,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { quests } from "@/data/mock";

const difficultyStars = { easy: 1, medium: 2, hard: 3 };

export default function QuestDetailPage() {
  const params = useParams();

  const quest = quests.find((q) => q.id === params.id);

  if (!quest) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🤷</div>
          <div className="text-gray-400">Quest not found</div>
          <Link href="/map" className="btn-ghost mt-4 inline-block">Back to Map</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh pb-8">
      {/* Header */}
      <header className="relative">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-cyan-400/10 to-transparent" />
        <div className="relative max-w-lg mx-auto px-5 pt-5">
          <Link href="/map" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Map
          </Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 mt-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Icon & Title */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{quest.icon}</div>
            <h1 className="text-2xl font-bold font-display text-white">{quest.title}</h1>
            <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">{quest.description}</p>
          </div>

          {/* Story */}
          <GlassCard className="mb-4">
            <div className="text-xs font-mono text-cyan-400 mb-2 tracking-wider">BRIEFING</div>
            <p className="text-sm text-gray-300 leading-relaxed italic">&quot;{quest.story}&quot;</p>
          </GlassCard>

          {/* Quest details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <GlassCard animate={false} className="py-3 text-center">
              <MapPin className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-sm font-semibold text-white">{quest.locationName}</div>
              <div className="text-[10px] text-gray-500">{quest.distance} away</div>
            </GlassCard>
            <GlassCard animate={false} className="py-3 text-center">
              <Footprints className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <div className="text-sm font-semibold text-white">{quest.movementGoal}</div>
              <div className="text-[10px] text-gray-500">Movement goal</div>
            </GlassCard>
          </div>

          {/* Difficulty & Time */}
          <GlassCard className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Difficulty</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= difficultyStars[quest.difficulty] ? "text-orange-400 fill-orange-400" : "text-gray-600"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                ~{quest.difficulty === "easy" ? "10" : quest.difficulty === "medium" ? "20" : "30"} min
              </div>
            </div>
          </GlassCard>

          {/* Rewards */}
          <GlassCard glow="purple" className="mb-6">
            <div className="text-xs font-mono text-purple-400 mb-3 tracking-wider">REWARDS</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-400 font-display">+{quest.rewardXP}</div>
                <div className="text-[10px] text-gray-500">XP</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400 font-display">+{quest.rewardPoints}</div>
                <div className="text-[10px] text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="text-lg">{quest.icon}</div>
                <div className="text-[10px] text-gray-500">{quest.badgeName}</div>
              </div>
            </div>
          </GlassCard>

          {/* CTA */}
          {quest.isCompleted ? (
            <div className="glass p-4 border-green-400/20 text-center">
              <div className="text-green-400 font-semibold">✅ Quest Completed</div>
              <div className="text-xs text-gray-400 mt-1">Badge already earned</div>
            </div>
          ) : (
            <Link
              href={`/quest/${quest.id}/ar`}
              className="btn-cyan w-full flex items-center justify-center gap-2 text-base py-4"
            >
              <Play className="w-5 h-5" />
              Start Quest
            </Link>
          )}
        </motion.div>
      </div>
    </main>
  );
}
