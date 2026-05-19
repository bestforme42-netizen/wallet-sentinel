"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/lib/chains";

interface ChainSelectorProps {
  selected: string;
  onSelect: (chain: string) => void;
}

export default function ChainSelector({ selected, onSelect }: ChainSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedChain = selected === "all"
    ? null
    : SUPPORTED_CHAINS.find(
        (c) => c.shortName.toLowerCase() === selected.toLowerCase() || String(c.id) === selected
      );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="glass border-white/10 px-3 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-white/5 transition-colors w-full justify-between"
      >
        <span className="flex items-center gap-2">
          {selected === "all" ? (
            <>
              <span className="text-base">🌐</span>
              <span className="text-white font-medium">All Chains</span>
            </>
          ) : selectedChain ? (
            <>
              <span className="text-base">{selectedChain.icon}</span>
              <span className="text-white font-medium">{selectedChain.name}</span>
            </>
          ) : (
            <span className="text-gray-400">Select chain…</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-1 glass-strong border-white/10 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto"
          >
            {/* All chains option */}
            <button
              onClick={() => { onSelect("all"); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors ${selected === "all" ? "bg-cyan-400/5" : ""}`}
            >
              <span className="text-base">🌐</span>
              <span className="text-sm text-white flex-1">All Chains</span>
              {selected === "all" && <Check className="w-4 h-4 text-cyan-400" />}
            </button>

            <div className="border-t border-white/5" />

            {SUPPORTED_CHAINS.map((chain) => (
              <button
                key={chain.id}
                onClick={() => { onSelect(chain.shortName); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors ${selected === chain.shortName ? "bg-cyan-400/5" : ""}`}
              >
                <span className="text-base">{chain.icon}</span>
                <div className="flex-1">
                  <div className="text-sm text-white">{chain.name}</div>
                  <div className="text-[10px] text-gray-500">{chain.nativeCurrency}</div>
                </div>
                {selected === chain.shortName && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}
