"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Scan, Search, Wallet } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Shield },
  { href: "/dashboard", label: "Scanner", icon: Scan },
  { href: "/checker", label: "Checker", icon: Search },
  { href: "/wallet", label: "Wallet", icon: Wallet },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto glass border-t border-white/5">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${
                  isActive ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
