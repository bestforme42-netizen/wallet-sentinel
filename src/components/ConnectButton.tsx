"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseSepolia } from "wagmi/chains";
import { Wallet, ChevronDown, LogOut, AlertTriangle } from "lucide-react";
import { shortenAddress } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export function ConnectButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const wrongChain = isConnected && chain?.id !== baseSepolia.id;

  if (!isConnected) {
    return (
      <button onClick={() => connect({ connector: injected() })} className="btn-primary inline-flex items-center gap-2">
        <Wallet className="w-4 h-4" /> Connect Wallet
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="btn-ghost inline-flex items-center gap-2">
        {wrongChain ? <AlertTriangle className="w-4 h-4 text-warn" /> : null}
        <span className="font-mono text-sm">{shortenAddress(address!)}</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 panel p-1.5 z-50">
          {wrongChain && (
            <button
              onClick={() => switchChain({ chainId: baseSepolia.id })}
              className="w-full text-left px-3 py-2 text-sm rounded-md text-warn hover:bg-warn/10 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> Switch to Base Sepolia
            </button>
          )}
          <button
            onClick={() => { disconnect(); setOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm rounded-md text-ink-mid hover:text-ink-hi hover:bg-white/5 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
