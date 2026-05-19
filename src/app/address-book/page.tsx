"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookMarked, Plus, Trash2, Edit2, CheckCircle, XCircle, Shield, AlertTriangle, Search,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NavBar from "@/components/NavBar";

interface SavedAddress {
  address: string;
  label: string;
  type: "safe" | "scam" | "unknown" | "defi" | "personal";
  chain: string;
  notes: string;
  addedAt: string;
}

const typeConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  safe: { color: "text-green-400", icon: <CheckCircle className="w-3.5 h-3.5 text-green-400" />, label: "Safe" },
  scam: { color: "text-red-400", icon: <XCircle className="w-3.5 h-3.5 text-red-400" />, label: "Scam" },
  defi: { color: "text-cyan-400", icon: <Shield className="w-3.5 h-3.5 text-cyan-400" />, label: "DeFi" },
  personal: { color: "text-purple-400", icon: <Shield className="w-3.5 h-3.5 text-purple-400" />, label: "Personal" },
  unknown: { color: "text-gray-400", icon: <AlertTriangle className="w-3.5 h-3.5 text-gray-400" />, label: "Unknown" },
};

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState({ address: "", label: "", type: "unknown" as SavedAddress["type"], chain: "all", notes: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ws-address-book");
    if (saved) setAddresses(JSON.parse(saved));
  }, []);

  const save = (data: SavedAddress[]) => {
    setAddresses(data);
    localStorage.setItem("ws-address-book", JSON.stringify(data));
  };

  const handleAdd = () => {
    if (!form.address || !form.label) return;
    const entry: SavedAddress = { ...form, addedAt: new Date().toISOString() };
    if (editIdx !== null) {
      const updated = [...addresses];
      updated[editIdx] = entry;
      save(updated);
    } else {
      save([...addresses, entry]);
    }
    setForm({ address: "", label: "", type: "unknown", chain: "all", notes: "" });
    setShowForm(false);
    setEditIdx(null);
  };

  const handleDelete = (i: number) => {
    save(addresses.filter((_, idx) => idx !== i));
  };

  const handleEdit = (i: number) => {
    setForm(addresses[i]);
    setEditIdx(i);
    setShowForm(true);
  };

  const filtered = addresses.filter((a) =>
    a.label.toLowerCase().includes(search.toLowerCase()) ||
    a.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-dvh pb-24">
      <header className="bg-gradient-to-b from-purple-400/5 to-transparent pt-6 pb-6 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400/20 to-cyan-400/20 flex items-center justify-center mx-auto mb-4 border border-purple-400/10">
            <BookMarked className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Address Book</h1>
          <p className="text-sm text-gray-400 mt-1">Save and label addresses you trust or avoid</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        {/* Search + Add */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search labels or addresses…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400/40 focus:outline-none" />
          </div>
          <button onClick={() => { setShowForm(true); setEditIdx(null); setForm({ address: "", label: "", type: "unknown", chain: "all", notes: "" }); }}
            className="btn-cyan px-4 py-2.5 flex items-center gap-1 text-sm shrink-0">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
              <GlassCard glow="purple">
                <div className="space-y-3">
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="0x… address"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-400/40 focus:outline-none font-mono" />
                  <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label (e.g. Uniswap Router)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-400/40 focus:outline-none" />
                  <div className="flex gap-2">
                    {(["safe", "defi", "personal", "unknown", "scam"] as const).map((t) => (
                      <button key={t} onClick={() => setForm({ ...form, type: t })}
                        className={`flex-1 text-[10px] py-2 rounded-lg border transition-colors ${
                          form.type === t ? `${typeConfig[t].color} border-current bg-current/5` : "border-white/5 text-gray-500"
                        }`}>
                        {typeConfig[t].label}
                      </button>
                    ))}
                  </div>
                  <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes (optional)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-400/40 focus:outline-none" />
                  <div className="flex gap-2">
                    <button onClick={handleAdd} className="btn-cyan flex-1 py-2.5 text-sm">{editIdx !== null ? "Update" : "Save"}</button>
                    <button onClick={() => { setShowForm(false); setEditIdx(null); }} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((a, i) => {
              const tc = typeConfig[a.type];
              return (
                <motion.div key={a.address + a.label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <GlassCard animate={false}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="mt-0.5">{tc.icon}</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white truncate">{a.label}</span>
                            <span className={`text-[9px] ${tc.color}`}>{tc.label}</span>
                          </div>
                          <div className="text-[10px] font-mono text-gray-500 truncate">{a.address}</div>
                          {a.notes && <div className="text-[10px] text-gray-400 mt-1">{a.notes}</div>}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0 ml-2">
                        <button onClick={() => handleEdit(i)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(i)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-gray-500 hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <GlassCard>
            <div className="text-center py-6">
              <BookMarked className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-sm text-gray-400">{search ? "No matches found" : "Your address book is empty"}</div>
              <div className="text-xs text-gray-500 mt-1">{search ? "Try a different search" : "Add addresses you want to track or avoid"}</div>
            </div>
          </GlassCard>
        )}
      </div>
      <NavBar />
    </main>
  );
}
