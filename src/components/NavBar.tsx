"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Scan, Search, Heart, Link2, BookOpen, MoreHorizontal, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const primaryNav = [
  { href: "/", label: "Home", icon: Shield },
  { href: "/dashboard", label: "Scanner", icon: Scan },
  { href: "/checker", label: "Checker", icon: Search },
  { href: "/more", label: "More", icon: MoreHorizontal },
];

const moreNav = [
  { href: "/health", label: "Wallet Health", icon: Heart, color: "text-green-400" },
  { href: "/phishing", label: "Phishing Check", icon: Link2, color: "text-red-400" },
  { href: "/token", label: "Token Risk", icon: Shield, color: "text-purple-400" },
  { href: "/learn", label: "Learn Security", icon: BookOpen, color: "text-yellow-400" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* More menu overlay */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMore(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="absolute bottom-20 left-4 right-4 max-w-lg mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-strong border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-gray-500 tracking-wider">TOOLS</span>
                  <button onClick={() => setShowMore(false)} className="text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {moreNav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowMore(false)}
                        className="glass border-white/5 p-3 rounded-xl hover:bg-white/[0.04] transition-colors flex items-center gap-3"
                      >
                        <Icon className={`w-5 h-5 ${item.color}`} />
                        <span className="text-sm text-white">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-lg mx-auto glass border-t border-white/5">
          <div className="flex items-center justify-around py-2">
            {primaryNav.map((item) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : item.href === "/more"
                  ? moreNav.some((m) => pathname.startsWith(m.href))
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              if (item.href === "/more") {
                return (
                  <button
                    key="more"
                    onClick={() => setShowMore(!showMore)}
                    className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${
                      showMore ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                );
              }

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
    </>
  );
}
