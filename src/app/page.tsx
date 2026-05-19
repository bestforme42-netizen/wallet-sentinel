import Link from "next/link";
import { Shield, Eye, Zap, Activity } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
        <div className="text-lg font-semibold inline-flex items-center gap-2">
          <Shield className="w-5 h-5 text-neon-green" />
          Wallet Sentinel
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="text-ink-mid hover:text-ink-hi transition-colors">Dashboard</Link>
          <Link href="/dashboard" className="btn-primary">Launch App</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <div className="text-xs font-mono text-neon-green/60 mb-4">
            AUTONOMOUS WALLET SECURITY AGENT · BASE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Your wallet has a{" "}
            <span className="text-neon-green">24/7 bodyguard</span>
          </h1>
          <p className="text-ink-mid text-lg mt-4 max-w-xl mx-auto">
            Wallet Sentinel monitors your approvals, detects risky tokens, and alerts you
            <em> before </em> a drain happens. Fully autonomous AI agent.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
              <Eye className="w-4 h-4 mr-2 inline" />
              Scan My Wallet
            </Link>
            <a href="#how" className="btn-ghost px-6 py-3">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-5xl mx-auto w-full px-6 pb-20 mt-10">
        <div className="text-xs font-mono text-ink-low mb-6">HOW IT WORKS</div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Eye className="w-5 h-5 text-neon-blue" />,
              title: "1. Scan",
              desc: "Connect wallet. Sentinel scans all ERC-20 approvals on Base Sepolia.",
            },
            {
              icon: <Zap className="w-5 h-5 text-neon-amber" />,
              title: "2. Assess",
              desc: "AI-driven risk engine scores each approval: unlimited grants, unknown contracts, recent drainers.",
            },
            {
              icon: <Activity className="w-5 h-5 text-neon-green" />,
              title: "3. Protect",
              desc: "One-click revoke risky approvals. Autonomous agent monitors 24/7 via Telegram alerts.",
            },
          ].map((step) => (
            <div key={step.title} className="panel p-6">
              <div className="mb-3">{step.icon}</div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-ink-mid text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
