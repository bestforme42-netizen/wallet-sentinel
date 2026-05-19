"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Footprints, Clock, ChevronRight, Filter,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import GlassCard from "@/components/GlassCard";
import { quests } from "@/data/mock";

const difficultyColor = {
  easy: "chip-success",
  medium: "chip-orange",
  hard: "chip-danger",
};

export default function QuestMapPage() {
  return (
    <main className="min-h-dvh pb-24">
      {/* Header */}
      <header className="max-w-lg mx-auto px-5 pt-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-mono text-gray-500 tracking-wider">QUEST MAP</div>
          <h1 className="text-xl font-bold font-display text-white">Nearby Treasures</h1>
        </div>
        <button className="glass p-2 border-white/10 hover:bg-white/5">
          <Filter className="w-4 h-4 text-gray-400" />
        </button>
      </header>

      {/* Map mock */}
      <section className="max-w-lg mx-auto px-5 mt-4">
        <div className="glass border-cyan-400/10 overflow-hidden rounded-2xl">
          <div className="relative h-52 bg-navy-800 map-grid">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-30" />

            {/* User position */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-cyan-400 rounded-full pulse-glow" />
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-cyan-400 font-mono whitespace-nowrap">
                YOU
              </div>
            </div>

            {/* Quest markers */}
            {[
              { x: "25%", y: "30%", color: "bg-green-400", icon: "👻" },
              { x: "70%", y: "25%", color: "bg-orange-400", icon: "🛡️" },
              { x: "80%", y: "65%", color: "bg-red-400", icon: "🔍" },
              { x: "20%", y: "70%", color: "bg-purple-400", icon: "🔐" },
            ].map((m, i) => (
              <div key={i} className="absolute float" style={{ left: m.x, top: m.y, animationDelay: `${i * 0.5}s` }}>
                <div className={`w-8 h-8 ${m.color}/20 rounded-full flex items-center justify-center border border-current`}>
                  <span className="text-sm">{m.icon}</span>
                </div>
              </div>
            ))}

            {/* Scanline */}
            <div className="absolute inset-0 scanline pointer-events-none" />
          </div>

          <div className="p-3 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> 4 quests nearby
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Updated 2m ago
            </span>
          </div>
        </div>
      </section>

      {/* Quest list */}
      <section className="max-w-lg mx-auto px-5 mt-5">
        <div className="text-xs font-mono text-gray-500 mb-3 tracking-wider">AVAILABLE QUESTS</div>

        <div className="space-y-3">
          {quests.map((quest, i) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/quest/${quest.id}`}>
                <GlassCard
                  glow={quest.isCompleted ? "none" : quest.isActive ? "orange" : "none"}
                  animate={false}
                  className={`cursor-pointer hover:bg-white/[0.06] transition-colors ${quest.isCompleted ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{quest.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm truncate">{quest.title}</span>
                        {quest.isCompleted && <span className="chip-success text-[9px]">DONE</span>}
                        {quest.isActive && <span className="chip-cyan text-[9px]">ACTIVE</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {quest.locationName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Footprints className="w-3 h-3" /> {quest.distance}
                        </span>
                        <span className={`chip ${difficultyColor[quest.difficulty]} text-[9px]`}>
                          {quest.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="chip-orange text-[9px]">+{quest.rewardPoints} pts</span>
                        <span className="chip-cyan text-[9px]">+{quest.rewardXP} XP</span>
                        <span className="chip-purple text-[9px]">{quest.badgeName}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 shrink-0" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <NavBar />
    </main>
  );
}
