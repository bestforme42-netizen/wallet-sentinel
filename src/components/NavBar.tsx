"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home, Map, Trophy, Wallet, Gift,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/map", icon: Map, label: "Quests" },
  { href: "/leaderboard", icon: Trophy, label: "Ranks" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/rewards", icon: Gift, label: "Rewards" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 px-3 rounded-xl transition-all text-xs",
                active ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]")} />
              <span className="text-[10px] font-medium">{label}</span>
              {active && (
                <div className="absolute bottom-0 w-6 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
