"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, QrCode, Check,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import GlassCard from "@/components/GlassCard";
import { merchantRewards, currentUser } from "@/data/mock";

export default function RewardsPage() {
  const [redeemed, setRedeemed] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const user = currentUser;

  const handleRedeem = (id: string) => {
    setRedeemed(id);
    setTimeout(() => setShowQR(true), 800);
  };

  return (
    <main className="min-h-dvh pb-24">
      {/* Header */}
      <header className="max-w-lg mx-auto px-5 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-gray-500 tracking-wider">REWARDS</div>
            <h1 className="text-xl font-bold font-display text-white">Merchant Vouchers</h1>
          </div>
          <div className="chip-orange text-xs">
            <Star className="w-3 h-3" /> {user.points.toLocaleString()} pts
          </div>
        </div>
      </header>

      {/* Category filter */}
      <section className="max-w-lg mx-auto px-5 mt-4 flex gap-2 overflow-x-auto pb-2">
        {["All", "Food & Drink", "Fitness", "Digital", "Education"].map((cat, i) => (
          <button
            key={cat}
            className={`chip shrink-0 ${i === 0 ? "chip-cyan" : "bg-white/5 text-gray-400 border border-white/5"}`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Rewards grid */}
      <section className="max-w-lg mx-auto px-5 mt-4">
        <div className="space-y-3">
          {merchantRewards.map((reward, i) => {
            const canAfford = user.points >= reward.requiredPoints;
            const isRedeemed = redeemed === reward.id;

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard
                  animate={false}
                  className={isRedeemed ? "border-green-400/20" : ""}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{reward.merchantIcon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{reward.title}</div>
                      <div className="text-xs text-gray-400">{reward.merchantName}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="chip-orange text-[9px]">
                          <Star className="w-3 h-3" /> {reward.requiredPoints} pts
                        </span>
                        <span className="chip text-[9px] bg-white/5 text-gray-400 border border-white/5">
                          {reward.category}
                        </span>
                      </div>
                    </div>
                    {!isRedeemed ? (
                      <button
                        onClick={() => canAfford && handleRedeem(reward.id)}
                        disabled={!canAfford}
                        className={canAfford ? "btn-ghost text-xs px-3 py-1.5" : "text-xs text-gray-600 px-3 py-1.5"}
                      >
                        {canAfford ? "Redeem" : "Need pts"}
                      </button>
                    ) : (
                      <span className="chip-success text-[9px]"><Check className="w-3 h-3" /> Redeemed</span>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && redeemed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-5"
            onClick={() => { setShowQR(false); setRedeemed(null); }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="glass-strong p-6 border-cyan-400/20 max-w-xs w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-lg font-bold text-white font-display mb-1">Voucher Ready!</h3>
              <p className="text-xs text-gray-400 mb-4">
                Show this QR code to the merchant to redeem your reward.
              </p>

              {/* QR mock */}
              <div className="glass p-6 border-white/10 inline-block mb-4">
                <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-navy-900" />
                </div>
              </div>

              <div className="text-[10px] text-gray-500 font-mono">
                Voucher #{redeemed.slice(-4).toUpperCase()}
              </div>

              <button
                onClick={() => { setShowQR(false); setRedeemed(null); }}
                className="btn-ghost w-full mt-4 py-2.5 text-sm"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NavBar />
    </main>
  );
}
