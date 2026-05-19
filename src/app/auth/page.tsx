"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wallet, User, ArrowLeft, Shield, Sparkles, ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/store/app";

export default function AuthPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [connecting, setConnecting] = useState(false);
  const [method, setMethod] = useState<"wallet" | "social" | null>(null);

  const handleConnect = async (type: "wallet" | "social") => {
    setMethod(type);
    setConnecting(true);
    // Simulate connection delay
    await new Promise((r) => setTimeout(r, 1200));
    login("Alex", type === "wallet" ? "0x7a3E…f92B" : "alex@email.com");
    router.push("/dashboard");
  };

  return (
    <main className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full px-5 pt-5">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </header>

      <section className="flex-1 flex items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white">Start Your Quest</h1>
            <p className="text-sm text-gray-400 mt-2">
              Connect your wallet or sign in with social login
            </p>
          </div>

          {/* Wallet connect */}
          <button
            onClick={() => handleConnect("wallet")}
            disabled={connecting}
            className="glass w-full p-4 flex items-center gap-4 mb-3 hover:bg-white/5 transition-colors border-white/10 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-white">Connect Wallet</div>
              <div className="text-xs text-gray-400">MetaMask, OKX, Rabby, Coinbase</div>
            </div>
            {connecting && method === "wallet" ? (
              <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {/* Social login */}
          <button
            onClick={() => handleConnect("social")}
            disabled={connecting}
            className="glass w-full p-4 flex items-center gap-4 mb-3 hover:bg-white/5 transition-colors border-white/10 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center">
              <User className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-white">Continue with Email</div>
              <div className="text-xs text-gray-400">No seed phrase required for beginners</div>
            </div>
            {connecting && method === "social" ? (
              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {/* Info */}
          <div className="glass p-4 border-cyan-400/10 mt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
              <div className="text-sm text-gray-400">
                <strong className="text-gray-300">New to Web3?</strong> No worries! We guide you
                step by step. Social login creates a secure wallet for you — no seed phrases
                to remember.
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
