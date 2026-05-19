"use client";

import NavBar from "@/components/NavBar";
import GlassCard from "@/components/GlassCard";
import { Wallet as WalletIcon, Shield, ExternalLink } from "lucide-react";

export default function WalletPage() {
  return (
    <main className="min-h-dvh pb-24">
      <header className="bg-gradient-to-b from-purple-400/5 to-transparent pt-6 pb-8 px-5">
        <div className="max-w-lg mx-auto text-center">
          <WalletIcon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold font-display text-white">Wallet</h1>
          <p className="text-xs text-gray-400 mt-1">Connect your wallet to see approvals and revoke</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        <GlassCard className="text-center py-8">
          <Shield className="w-10 h-10 text-cyan-400/30 mx-auto mb-3" />
          <div className="text-white font-semibold mb-1">Connect Wallet</div>
          <div className="text-sm text-gray-400 mb-4">Connect your wallet to manage approvals directly</div>
          <button className="btn-cyan px-6 py-2.5 text-sm">
            Connect Wallet
          </button>
        </GlassCard>

        <div className="mt-6">
          <div className="text-xs font-mono text-gray-500 mb-3 tracking-wider">QUICK LINKS</div>
          <div className="space-y-2">
            {[
              { label: "Scan Approvals", href: "/dashboard", icon: "🔍" },
              { label: "Check Contract", href: "/checker", icon: "🛡️" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="glass border-white/5 p-3 rounded-xl flex items-center gap-3 hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-sm text-white flex-1">{link.label}</span>
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <NavBar />
    </main>
  );
}
