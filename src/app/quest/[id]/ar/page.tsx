"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, Eye, ChevronRight } from "lucide-react";

export default function ARDiscoveryPage() {
  const params = useParams();
  const router = useRouter();
  const [phase, setPhase] = useState<"searching" | "found" | "scanning">("searching");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("found"), 2000);
    return () => clearTimeout(t1);
  }, []);

  const handleScan = () => {
    setPhase("scanning");
    setTimeout(() => {
      router.push(`/quest/${params.id}/puzzle`);
    }, 1500);
  };

  return (
    <main className="min-h-dvh relative overflow-hidden bg-navy-900">
      {/* Camera mock background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900" />
        <div className="absolute inset-0 map-grid opacity-20" />
        <div className="absolute inset-0 ar-overlay" />
      </div>

      {/* Top HUD */}
      <div className="relative z-10 max-w-lg mx-auto px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-cyan-400/60 tracking-wider">AR DISCOVERY</div>
          <div className="chip-cyan text-[10px]">LIVE</div>
        </div>
      </div>

      {/* Center crosshair / clue */}
      <div className="relative z-10 flex-1 flex items-center justify-center min-h-[60vh]">
        {/* Crosshair */}
        <div className="absolute">
          <Crosshair className="w-32 h-32 text-cyan-400/20 animate-pulse" />
        </div>

        <AnimatePresence mode="wait">
          {phase === "searching" && (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 border-2 border-cyan-400/30 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Eye className="w-8 h-8 text-cyan-400/50" />
              </div>
              <div className="text-sm text-gray-400 mt-4 font-mono">Scanning for clues…</div>
              <div className="flex justify-center gap-1 mt-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {phase === "found" && (
            <motion.div
              key="found"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              {/* Floating clue */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="glass-strong p-6 border-cyan-400/20 inline-block float"
              >
                <div className="text-4xl mb-2">🔍</div>
                <div className="text-sm font-semibold text-cyan-400">Clue Discovered!</div>
                <div className="text-xs text-gray-400 mt-1 max-w-[200px]">
                  &quot;The seed is the key. Guard it with your life.&quot;
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleScan}
                className="btn-cyan mt-8 flex items-center gap-2 mx-auto"
              >
                Scan Clue <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {phase === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm text-cyan-400 mt-4 font-mono">Analyzing clue…</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom HUD */}
      <div className="relative z-10 max-w-lg mx-auto px-5 pb-8">
        <div className="glass p-3 border-white/5 text-center">
          <div className="text-[10px] text-gray-500 font-mono">
            {phase === "searching" ? "Move your device to scan the area" :
             phase === "found" ? "Tap the clue to examine it" :
             "Processing…"}
          </div>
        </div>
      </div>
    </main>
  );
}
