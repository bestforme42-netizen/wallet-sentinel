import Link from "next/link";
import { Shield, Scan, Search, Zap, Eye, Lock, Heart, Link2, BookOpen, Coins } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      {/* Hero */}
      <section className="bg-gradient-to-b from-cyan-400/5 via-transparent to-transparent pt-12 pb-10 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-orange-400/20 flex items-center justify-center mx-auto mb-5 border border-cyan-400/10">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold font-display text-white leading-tight">
            Wallet<br />
            <span className="gradient-text">Sentinel</span>
          </h1>
          <p className="text-gray-400 mt-3 text-sm max-w-xs mx-auto">
            Your all-in-one Web3 security toolkit. Scan, check, protect — across every chain.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-lg mx-auto px-5 pb-8">
        <div className="text-xs font-mono text-gray-500 mb-4 tracking-wider text-center">SECURITY TOOLS</div>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/dashboard">
            <div className="glass border-cyan-400/10 p-4 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer h-full">
              <Scan className="w-6 h-6 text-cyan-400 mb-2" />
              <div className="font-semibold text-white text-sm">Approval Scanner</div>
              <div className="text-[10px] text-gray-400 mt-1">Scan approvals across 7+ chains</div>
            </div>
          </Link>
          <Link href="/checker">
            <div className="glass border-orange-400/10 p-4 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer h-full">
              <Search className="w-6 h-6 text-orange-400 mb-2" />
              <div className="font-semibold text-white text-sm">SC Checker</div>
              <div className="text-[10px] text-gray-400 mt-1">Analyze smart contract safety</div>
            </div>
          </Link>
          <Link href="/health">
            <div className="glass border-green-400/10 p-4 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer h-full">
              <Heart className="w-6 h-6 text-green-400 mb-2" />
              <div className="font-semibold text-white text-sm">Wallet Health</div>
              <div className="text-[10px] text-gray-400 mt-1">Get your safety score A-F</div>
            </div>
          </Link>
          <Link href="/phishing">
            <div className="glass border-red-400/10 p-4 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer h-full">
              <Link2 className="w-6 h-6 text-red-400 mb-2" />
              <div className="font-semibold text-white text-sm">Phishing Check</div>
              <div className="text-[10px] text-gray-400 mt-1">Verify URLs before connecting</div>
            </div>
          </Link>
          <Link href="/token">
            <div className="glass border-purple-400/10 p-4 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer h-full">
              <Coins className="w-6 h-6 text-purple-400 mb-2" />
              <div className="font-semibold text-white text-sm">Token Risk</div>
              <div className="text-[10px] text-gray-400 mt-1">Check tokens for scams</div>
            </div>
          </Link>
          <Link href="/learn">
            <div className="glass border-yellow-400/10 p-4 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer h-full">
              <BookOpen className="w-6 h-6 text-yellow-400 mb-2" />
              <div className="font-semibold text-white text-sm">Learn</div>
              <div className="text-[10px] text-gray-400 mt-1">Interactive security lessons</div>
            </div>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-lg mx-auto px-5 pb-8">
        <div className="glass border-white/5 p-5 rounded-xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold font-display text-cyan-400">7+</div>
              <div className="text-[10px] text-gray-500">Chains</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-orange-400">6</div>
              <div className="text-[10px] text-gray-500">Tools</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-purple-400">0</div>
              <div className="text-[10px] text-gray-500">Keys needed</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-lg mx-auto px-5 pb-10">
        <div className="text-xs font-mono text-gray-500 mb-4 tracking-wider text-center">HOW IT WORKS</div>
        <div className="space-y-3">
          {[
            { step: "01", title: "Paste Address", desc: "Enter any wallet or contract address", icon: <Eye className="w-4 h-4 text-cyan-400" /> },
            { step: "02", title: "Multi-chain Scan", desc: "Check across 7+ networks simultaneously", icon: <Zap className="w-4 h-4 text-orange-400" /> },
            { step: "03", title: "Risk Assessment", desc: "AI-powered scoring and risk analysis", icon: <Shield className="w-4 h-4 text-purple-400" /> },
            { step: "04", title: "Take Action", desc: "Revoke, report, and protect your assets", icon: <Lock className="w-4 h-4 text-green-400" /> },
          ].map((s) => (
            <div key={s.step} className="glass border-white/5 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono text-gray-500">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{s.title}</div>
                  <div className="text-xs text-gray-400">{s.desc}</div>
                </div>
                {s.icon}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-lg mx-auto px-5 pb-20">
        <Link href="/dashboard" className="btn-cyan w-full flex items-center justify-center gap-2 py-4 text-base font-semibold">
          <Zap className="w-5 h-5" />
          Start Scanning
        </Link>
      </section>
    </main>
  );
}
