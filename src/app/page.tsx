import Link from "next/link";
import {
  Shield, Scan, Search, Zap, Heart, Link2, BookOpen, Coins,
  Play, Trash2, Fuel, BookMarked,
} from "lucide-react";
import Footer from "@/components/Footer";

export default function HomePage() {
  const tools = [
    { href: "/dashboard", label: "Approval Scanner", desc: "Multi-chain approval scan + risk score", icon: Scan, color: "border-cyan-400/10" },
    { href: "/revoke", label: "Batch Revoke", desc: "Select & revoke multiple approvals", icon: Trash2, color: "border-red-400/10" },
    { href: "/checker", label: "SC Checker", desc: "Smart contract safety analysis", icon: Search, color: "border-orange-400/10" },
    { href: "/health", label: "Wallet Health", desc: "Safety score A-F for any wallet", icon: Heart, color: "border-green-400/10" },
    { href: "/phishing", label: "Phishing Check", desc: "Detect phishing URLs", icon: Link2, color: "border-red-400/10" },
    { href: "/token", label: "Token Risk", desc: "Honeypot & scam detection", icon: Coins, color: "border-purple-400/10" },
    { href: "/simulate", label: "Tx Simulator", desc: "Preview tx before signing", icon: Play, color: "border-cyan-400/10" },
    { href: "/gas", label: "Gas Tracker", desc: "Real-time gas across chains", icon: Fuel, color: "border-orange-400/10" },
    { href: "/address-book", label: "Address Book", desc: "Save & label addresses", icon: BookMarked, color: "border-purple-400/10" },
    { href: "/learn", label: "Learn Security", desc: "Interactive Web3 safety lessons", icon: BookOpen, color: "border-yellow-400/10" },
  ];

  return (
    <main className="min-h-dvh grid-bg">
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

      {/* Quick stats */}
      <section className="max-w-lg mx-auto px-5 pb-6">
        <div className="glass border-white/5 p-4 rounded-xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold font-display text-cyan-400">7+</div>
              <div className="text-[10px] text-gray-500">Chains</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-orange-400">10</div>
              <div className="text-[10px] text-gray-500">Tools</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-purple-400">0</div>
              <div className="text-[10px] text-gray-500">Keys Needed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="max-w-lg mx-auto px-5 pb-8">
        <div className="text-xs font-mono text-gray-500 mb-4 tracking-wider text-center">SECURITY TOOLS</div>
        <div className="grid grid-cols-2 gap-3">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={t.href}>
                <div className={`glass ${t.color} p-4 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer h-full`}>
                  <Icon className="w-5 h-5 text-white/60 mb-2" />
                  <div className="font-semibold text-white text-sm">{t.label}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{t.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-lg mx-auto px-5 pb-8">
        <div className="text-xs font-mono text-gray-500 mb-4 tracking-wider text-center">HOW IT WORKS</div>
        <div className="space-y-2">
          {[
            { step: "01", title: "Paste Address", desc: "Enter any wallet or contract address" },
            { step: "02", title: "Multi-chain Scan", desc: "Check across 7+ networks simultaneously" },
            { step: "03", title: "Risk Assessment", desc: "AI-powered scoring and risk analysis" },
            { step: "04", title: "Take Action", desc: "Revoke, report, and protect your assets" },
          ].map((s) => (
            <div key={s.step} className="glass border-white/5 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono text-cyan-400">{s.step}</div>
                <div>
                  <div className="text-sm font-semibold text-white">{s.title}</div>
                  <div className="text-xs text-gray-400">{s.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-lg mx-auto px-5 pb-6">
        <Link href="/dashboard" className="btn-cyan w-full flex items-center justify-center gap-2 py-4 text-base font-semibold">
          <Zap className="w-5 h-5" /> Start Scanning
        </Link>
      </section>

      <Footer />
    </main>
  );
}
