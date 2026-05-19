import Link from "next/link";
import {
  Shield, Scan, Search, Heart, Link2, BookOpen, Coins,
  Play, Trash2, Fuel, BookMarked, Zap,
} from "lucide-react";

export default function HomePage() {
  const tools = [
    { href: "/dashboard", label: "Scanner", icon: Scan },
    { href: "/revoke", label: "Revoke", icon: Trash2 },
    { href: "/checker", label: "SC Check", icon: Search },
    { href: "/health", label: "Health", icon: Heart },
    { href: "/phishing", label: "Phishing", icon: Link2 },
    { href: "/token", label: "Token", icon: Coins },
    { href: "/simulate", label: "Simulate", icon: Play },
    { href: "/gas", label: "Gas", icon: Fuel },
    { href: "/address-book", label: "Addresses", icon: BookMarked },
    { href: "/learn", label: "Learn", icon: BookOpen },
  ];

  return (
    <main className="min-h-dvh grid-bg flex flex-col">
      {/* Hero — compact */}
      <section className="pt-8 pb-4 px-5 text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-orange-400/20 flex items-center justify-center mx-auto mb-3 border border-cyan-400/10">
          <Shield className="w-6 h-6 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold font-display text-white leading-tight">
          Wallet <span className="gradient-text">Sentinel</span>
        </h1>
        <p className="text-gray-400 mt-1 text-xs">Scan · Check · Protect — across every chain</p>
      </section>

      {/* Stats — inline */}
      <section className="px-5 pb-3">
        <div className="max-w-lg mx-auto glass border-white/5 px-4 py-2.5 rounded-xl flex items-center justify-around text-center">
          <div>
            <div className="text-lg font-bold font-display text-cyan-400">7+</div>
            <div className="text-[9px] text-gray-500">Chains</div>
          </div>
          <div className="w-px h-6 bg-white/5" />
          <div>
            <div className="text-lg font-bold font-display text-orange-400">10</div>
            <div className="text-[9px] text-gray-500">Tools</div>
          </div>
          <div className="w-px h-6 bg-white/5" />
          <div>
            <div className="text-lg font-bold font-display text-purple-400">0</div>
            <div className="text-[9px] text-gray-500">Keys</div>
          </div>
        </div>
      </section>

      {/* Tools — 4 col grid, fills remaining space */}
      <section className="flex-1 px-5 pb-3">
        <div className="max-w-lg mx-auto">
          <div className="text-[10px] font-mono text-gray-500 mb-2 tracking-wider text-center">SECURITY TOOLS</div>
          <div className="grid grid-cols-5 gap-1.5">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <Link key={t.href} href={t.href}>
                  <div className="glass border-white/5 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer flex flex-col items-center text-center aspect-square justify-center">
                    <Icon className="w-4.5 h-4.5 text-white/70 mb-1" />
                    <div className="font-medium text-white text-[9px] leading-tight">{t.label}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works — horizontal compact */}
      <section className="px-5 pb-3">
        <div className="max-w-lg mx-auto glass border-white/5 px-3 py-2 rounded-xl">
          <div className="flex items-center justify-between text-center">
            {[
              { n: "1", t: "Paste" },
              { n: "2", t: "Scan" },
              { n: "3", t: "Assess" },
              { n: "4", t: "Protect" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-[9px] font-mono text-cyan-400">{s.n}</div>
                <span className="text-[10px] text-gray-400">{s.t}</span>
                {i < 3 && <div className="w-3 h-px bg-white/10 ml-1" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — bottom */}
      <section className="px-5 pb-6">
        <div className="max-w-lg mx-auto">
          <Link href="/dashboard" className="btn-cyan w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl">
            <Zap className="w-4 h-4" /> Start Scanning
          </Link>
          <p className="text-center text-[9px] text-gray-600 mt-2">Wallet Sentinel · Web3 Security Toolkit</p>
        </div>
      </section>
    </main>
  );
}
