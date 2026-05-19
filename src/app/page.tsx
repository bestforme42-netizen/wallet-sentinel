import Link from "next/link";
import { Shield, Scan, Search, Zap, Eye, Lock } from "lucide-react";

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
            Your wallet has a 24/7 bodyguard. Scan approvals, check contracts, stay safe.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-lg mx-auto px-5 pb-8">
        <div className="text-xs font-mono text-gray-500 mb-4 tracking-wider text-center">FEATURES</div>
        <div className="space-y-3">
          <Link href="/dashboard">
            <div className="glass border-cyan-400/10 p-4 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                  <Scan className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">Approval Scanner</div>
                  <div className="text-xs text-gray-400 mt-0.5">Scan any wallet for risky token approvals across 7+ chains</div>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/checker">
            <div className="glass border-orange-400/10 p-4 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">SC Checker</div>
                  <div className="text-xs text-gray-400 mt-0.5">Analyze smart contracts for honeypots, dangerous functions, and risks</div>
                </div>
              </div>
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
              <div className="text-2xl font-bold font-display text-orange-400">100%</div>
              <div className="text-[10px] text-gray-500">Client-side</div>
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
            { step: "01", title: "Paste Address", desc: "Enter any wallet address", icon: <Eye className="w-4 h-4 text-cyan-400" /> },
            { step: "02", title: "Multi-chain Scan", desc: "Check approvals on 7+ networks", icon: <Zap className="w-4 h-4 text-orange-400" /> },
            { step: "03", title: "Risk Assessment", desc: "AI-powered risk scoring", icon: <Shield className="w-4 h-4 text-purple-400" /> },
            { step: "04", title: "Revoke & Protect", desc: "One-click revoke dangerous approvals", icon: <Lock className="w-4 h-4 text-green-400" /> },
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
