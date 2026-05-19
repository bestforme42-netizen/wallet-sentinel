"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Brain, Trophy, Gift, Footprints,
  Shield, Smartphone, Sparkles, ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: <Footprints className="w-6 h-6 text-cyan-400" />,
    title: "Move",
    desc: "Walk to real-world checkpoints and explore your city while earning rewards.",
    color: "border-cyan-400/20",
  },
  {
    icon: <Brain className="w-6 h-6 text-orange-400" />,
    title: "Solve",
    desc: "Discover AR clues and solve crypto-safety puzzles to protect the community.",
    color: "border-orange-400/20",
  },
  {
    icon: <Trophy className="w-6 h-6 text-purple-400" />,
    title: "Earn",
    desc: "Collect XP, points, and NFT badges as you level up your Web3 knowledge.",
    color: "border-purple-400/20",
  },
  {
    icon: <Gift className="w-6 h-6 text-green-400" />,
    title: "Redeem",
    desc: "Exchange points for real rewards from local merchants and partners.",
    color: "border-green-400/20",
  },
];

const stats = [
  { label: "Active Players", value: "12,400+" },
  { label: "Quests Completed", value: "89,000+" },
  { label: "Badges Minted", value: "45,000+" },
  { label: "Merchant Partners", value: "120+" },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full px-5 pt-5 flex items-center justify-between">
        <div className="text-lg font-bold font-display flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <span className="gradient-text">Move & Solve</span>
        </div>
        <Link href="/auth" className="btn-ghost text-sm px-4 py-2">
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-5 pt-16 pb-12">
        <div className="max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs font-mono text-cyan-400/60 mb-4 tracking-widest">
              AR CRYPTO TREASURE QUEST
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight">
              Walk. Discover.{" "}
              <span className="gradient-text">Solve.</span>
            </h1>
            <p className="text-lg text-gray-400 mt-4 max-w-xl mx-auto leading-relaxed">
              Explore real-world locations, find hidden crypto clues, solve safety puzzles,
              and earn NFT badges — all while getting your steps in.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link href="/auth" className="btn-cyan text-base px-8 py-3.5 flex items-center gap-2">
                Start Quest <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn-ghost px-6 py-3.5">
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold font-display gradient-text">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto w-full px-5 pb-16">
        <div className="text-xs font-mono text-gray-500 mb-6 tracking-widest">HOW IT WORKS</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className={`glass p-5 ${f.color}`}
            >
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Xiaomi ecosystem */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-16">
        <div className="glass p-6 md:p-8 border-cyan-400/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Smartphone className="w-12 h-12 text-cyan-400 shrink-0" />
            <div>
              <h3 className="font-semibold text-white text-lg mb-1">Xiaomi Ecosystem Ready</h3>
              <p className="text-sm text-gray-400">
                Optimized for Xiaomi devices with fitness tracker integration, Mi Band step counting,
                and seamless Xiaomi Smart Home notifications. Track your walks, earn rewards, and level
                up — all from your Xiaomi phone or wearable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Web3 safety */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-20">
        <div className="glass p-6 md:p-8 border-orange-400/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Shield className="w-12 h-12 text-orange-400 shrink-0" />
            <div>
              <h3 className="font-semibold text-white text-lg mb-1">Learn Web3 Safety</h3>
              <p className="text-sm text-gray-400">
                Every puzzle teaches a real crypto safety lesson — phishing detection, seed phrase protection,
                scam identification, and smart contract awareness. Start as a beginner, finish as a Web3
                security expert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-600">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3" />
          Move & Solve — Web3 Treasure Quest
        </div>
      </footer>
    </main>
  );
}
