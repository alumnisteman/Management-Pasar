"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Search, X, Users, CreditCard, Grid3X3,
  ArrowRight, Loader2, Command,
} from "lucide-react";

const STATUS_COLOR = {
  active: "text-emerald-400", lunas: "text-emerald-400",
  inactive: "text-gray-400", unpaid: "text-rose-400",
  menunggak: "text-rose-400", occupied: "text-blue-400",
  available: "text-gray-400", sengketa: "text-yellow-400",
};

function statusLabel(s) {
  const map = {
    active: "Aktif", inactive: "Nonaktif", menunggak: "Menunggak",
    lunas: "Lunas", unpaid: "Belum Bayar", paid: "Lunas",
    occupied: "Terisi", available: "Tersedia", sengketa: "Sengketa",
  };
  return map[s] || s;
}

function fmtRp(n) {
  return `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const allItems = results
    ? [
        ...results.traders.map((t) => ({ type: "trader", data: t })),
        ...results.bills.map((b) => ({ type: "bill", data: b })),
        ...results.stalls.map((s) => ({ type: "stall", data: s })),
      ]
    : [];

  const openSearch = useCallback(() => {
    setOpen(true);
    setQuery("");
    setResults(null);
    setCursor(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults(null);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? closeSearch() : openSearch();
      }
      if (e.key === "Escape" && open) closeSearch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, openSearch, closeSearch]);

  useEffect(() => {
    if (!query || query.length < 2) { setResults(null); return; }
    setLoading(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setCursor(0);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const goTo = useCallback((item) => {
    closeSearch();
    if (item.type === "trader") navigate(`/admin/traders`);
    else if (item.type === "bill") navigate(`/admin/billing`);
    else if (item.type === "stall") navigate(`/admin/grid`);
  }, [closeSearch, navigate]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, allItems.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
      if (e.key === "Enter" && allItems[cursor]) goTo(allItems[cursor]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, allItems, cursor, goTo]);

  const ICON = { trader: Users, bill: CreditCard, stall: Grid3X3 };
  const LABEL = { trader: "Pedagang", bill: "Tagihan", stall: "Kios" };
  const COLOR = { trader: "text-violet-400", bill: "text-rose-400", stall: "text-blue-400" };
  const BG = { trader: "bg-violet-500/10", bill: "bg-rose-500/10", stall: "bg-blue-500/10" };

  return (
    <>
      <button
        onClick={openSearch}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-medium group"
        title="Pencarian global (Ctrl+K)"
      >
        <Search size={13} />
        <span className="hidden sm:inline">Cari...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/5 border border-white/10 text-gray-500 group-hover:border-white/20">
          <Command size={9} />K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeSearch(); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSearch} />

          <div className="relative w-full max-w-xl bg-[#10131c] border border-white/10 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-150">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
              {loading
                ? <Loader2 size={16} className="text-gray-500 animate-spin shrink-0" />
                : <Search size={16} className="text-gray-500 shrink-0" />
              }
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari pedagang, tagihan, atau kios..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-600"
              />
              {query && (
                <button onClick={() => { setQuery(""); setResults(null); inputRef.current?.focus(); }} className="text-gray-500 hover:text-gray-300">
                  <X size={14} />
                </button>
              )}
              <kbd className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/10 text-gray-600">ESC</kbd>
            </div>

            {!query && (
              <div className="px-4 py-8 text-center">
                <Search size={28} className="text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Ketik nama pedagang, kode kios, atau bulan tagihan</p>
                <div className="flex items-center justify-center gap-3 mt-4 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↑↓</kbd> navigasi</span>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Enter</kbd> buka</span>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">ESC</kbd> tutup</span>
                </div>
              </div>
            )}

            {query && query.length < 2 && (
              <div className="px-4 py-6 text-center text-gray-600 text-sm">Ketik minimal 2 karakter...</div>
            )}

            {results && allItems.length === 0 && !loading && (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-500 text-sm">Tidak ada hasil untuk <span className="text-white font-medium">"{query}"</span></p>
              </div>
            )}

            {results && allItems.length > 0 && (
              <div className="max-h-[360px] overflow-y-auto py-2">
                {[
                  { key: "trader", items: results.traders, label: "Pedagang" },
                  { key: "bill", items: results.bills, label: "Tagihan" },
                  { key: "stall", items: results.stalls, label: "Kios" },
                ].filter((g) => g.items.length > 0).map((group) => {
                  const Icon = ICON[group.key];
                  return (
                    <div key={group.key}>
                      <div className="px-4 py-1.5 flex items-center gap-2">
                        <Icon size={11} className={COLOR[group.key]} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${COLOR[group.key]}`}>{group.label}</span>
                      </div>
                      {group.items.map((item, idx) => {
                        const globalIdx = allItems.findIndex(
                          (a) => a.type === group.key && a.data === item
                        );
                        const active = globalIdx === cursor;
                        return (
                          <button
                            key={item.id}
                            onClick={() => goTo({ type: group.key, data: item })}
                            onMouseEnter={() => setCursor(globalIdx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${active ? "bg-white/8" : "hover:bg-white/5"}`}
                          >
                            <div className={`p-1.5 rounded-lg shrink-0 ${BG[group.key]}`}>
                              <Icon size={13} className={COLOR[group.key]} />
                            </div>
                            <div className="flex-1 min-w-0">
                              {group.key === "trader" && (
                                <>
                                  <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                                  <p className="text-xs text-gray-500">{item.stall_code ? `Kios ${item.stall_code}` : "—"} · Zona {item.zone || "—"} · {item.phone || "—"}</p>
                                </>
                              )}
                              {group.key === "bill" && (
                                <>
                                  <p className="text-sm font-semibold text-white truncate">{item.trader_name}</p>
                                  <p className="text-xs text-gray-500">{item.bill_month} · {fmtRp(item.amount)} · Kios {item.stall_code || "—"}</p>
                                </>
                              )}
                              {group.key === "stall" && (
                                <>
                                  <p className="text-sm font-semibold text-white">{item.stall_code}</p>
                                  <p className="text-xs text-gray-500">Zona {item.zone} · {item.category} · {fmtRp(item.monthly_fee)}/bln</p>
                                </>
                              )}
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <span className={`text-[10px] font-semibold capitalize ${STATUS_COLOR[item.status] || "text-gray-500"}`}>
                                {statusLabel(item.status)}
                              </span>
                              <ArrowRight size={12} className={`${active ? "text-gray-400" : "text-transparent"} transition-colors`} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-gray-600">Sistem Manajemen Pasar Terpadu</span>
              <span className="text-[10px] text-gray-600">
                {allItems.length > 0 ? `${allItems.length} hasil` : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
