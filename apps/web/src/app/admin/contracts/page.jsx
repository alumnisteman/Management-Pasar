"use client";

import { useState } from "react";
import { useRole } from "@/app/useRole";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileSignature, Plus, Search, CheckCircle2, Clock, AlertTriangle,
  X, Calendar, Download, Trash2, RefreshCw,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";

const fmtRp = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const statusConfig = {
  active: { label: "Aktif", text: "text-green-400", bg: "bg-green-500/10 border-green-500/30", icon: CheckCircle2 },
  expired: { label: "Kadaluarsa", text: "text-red-400", bg: "bg-red-500/10 border-red-500/30", icon: AlertTriangle },
  terminated: { label: "Diputus", text: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/30", icon: X },
  expiring: { label: "Segera Habis", text: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", icon: Clock },
};

function ContractModal({ traders, onClose, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    trader_id: traders[0]?.id || "",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
    rent_amount: 500000,
    terms: "1. Pembayaran dilakukan setiap tanggal 1.\n2. Dilarang mengubah struktur lapak.\n3. Kontrak diperpanjang 30 hari sebelum kedaluwarsa.",
  });
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#13151f] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <FileSignature size={18} className="text-violet-400" /> Buat Kontrak Digital
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Pedagang</label>
            <select value={form.trader_id} onChange={(e) => setForm((f) => ({ ...f, trader_id: Number(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500">
              {traders.map((t) => <option key={t.id} value={t.id} className="bg-[#13151f]">{t.name} ({t.stall_code || "—"})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[["Tanggal Mulai", "start_date", "date"], ["Tanggal Berakhir", "end_date", "date"], ["Sewa Bulanan (Rp)", "rent_amount", "number"]].slice(0, 2).map(([label, key, type]) => (
              <div key={key}>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">{label}</label>
                <input type={type} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500" />
              </div>
            ))}
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Sewa Bulanan (Rp)</label>
            <input type="number" value={form.rent_amount} onChange={(e) => setForm((f) => ({ ...f, rent_amount: Number(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Syarat &amp; Ketentuan</label>
            <textarea value={form.terms} onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))} rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 resize-none" />
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Batal</button>
          <button onClick={() => onSubmit(form)} disabled={!form.trader_id || isLoading}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 flex items-center gap-2">
            {isLoading && <RefreshCw size={14} className="animate-spin" />}
            {isLoading ? "Menyimpan..." : "Buat Kontrak"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContractsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [role] = useRole();
  const queryClient = useQueryClient();

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ["adminContracts"],
    queryFn: () => fetch("/api/admin/contracts").then((r) => r.json()),
  });

  const { data: traders = [] } = useQuery({
    queryKey: ["adminTraders"],
    queryFn: () => fetch("/api/admin/traders").then((r) => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data) => fetch("/api/admin/contracts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["adminContracts"] }); setShowModal(false); },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => fetch("/api/admin/contracts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminContracts"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`/api/admin/contracts?id=${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminContracts"] }),
  });

  const getStatus = (c) => {
    if (c.status === "terminated") return "terminated";
    if (c.status === "expired") return "expired";
    const days = (new Date(c.end_date) - new Date()) / (1000 * 60 * 60 * 24);
    if (days < 0) return "expired";
    if (days <= 30) return "expiring";
    return "active";
  };

  const shown = contracts.filter((c) => {
    const matchSearch = !search || c.trader_name?.toLowerCase().includes(search.toLowerCase()) || c.stall_code?.includes(search);
    const matchFilter = filter === "all" || getStatus(c) === filter;
    return matchSearch && matchFilter;
  });

  const stats = { total: contracts.length, active: 0, expiring: 0, expired: 0 };
  contracts.forEach((c) => { const s = getStatus(c); if (stats[s] !== undefined) stats[s]++; });

  const exportCSV = () => {
    window.location.href = "/api/admin/export?type=traders";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AnimatePresence>
        {showModal && (
          <ContractModal traders={traders} onClose={() => setShowModal(false)} onSubmit={createMutation.mutate} isLoading={createMutation.isPending} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileSignature size={24} className="text-violet-400" /> Kontrak Digital Kios
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manajemen kontrak sewa lapak pedagang secara digital</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
            <Download size={16} /> Export Excel
          </button>
          {role === "admin" && (
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
              <Plus size={16} /> Buat Kontrak
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Kontrak", val: stats.total, color: "text-white" },
          { label: "Aktif", val: stats.active, color: "text-green-400" },
          { label: "Segera Habis", val: stats.expiring, color: "text-yellow-400" },
          { label: "Kadaluarsa", val: stats.expired, color: "text-red-400" },
        ].map(({ label, val, color }) => (
          <motion.div key={label} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center shadow-lg">
            <p className={twMerge("text-2xl font-bold", color)}>{val}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <Search size={14} className="text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama pedagang / kode lapak..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none" />
        </div>
        <div className="flex gap-2">
          {[["all", "Semua"], ["active", "Aktif"], ["expiring", "Segera Habis"], ["expired", "Kadaluarsa"]].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={twMerge("px-3 py-2 rounded-lg text-xs font-semibold border transition-colors",
                filter === key ? "bg-violet-600 text-white border-transparent" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20")}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              {["Pedagang", "Masa Kontrak", "Sewa/Bulan", "Durasi", "Status", ...(role === "admin" ? ["Aksi"] : [])].map((h) => (
                <th key={h} className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500 text-sm">Memuat data kontrak...</td></tr>
            ) : shown.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <FileSignature size={32} className="text-gray-600" />
                  <p className="text-gray-500 text-sm">Belum ada kontrak{filter !== "all" ? " dengan status ini" : ""}</p>
                </div>
              </td></tr>
            ) : (
              shown.map((c) => {
                const s = getStatus(c);
                const sc = statusConfig[s] || statusConfig.active;
                const StatusIcon = sc.icon;
                const daysLeft = Math.floor((new Date(c.end_date) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-white">{c.trader_name || `Pedagang #${c.trader_id}`}</p>
                      <p className="text-[10px] text-gray-500">{c.stall_code} · {c.zone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-300">
                        <Calendar size={11} className="text-gray-500" />
                        {fmtDate(c.start_date)}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">s/d {fmtDate(c.end_date)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-white">{fmtRp(c.rent_amount)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className={twMerge("text-xs font-semibold", daysLeft < 0 ? "text-red-400" : daysLeft <= 30 ? "text-yellow-400" : "text-gray-300")}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}h lalu` : `${daysLeft} hari lagi`}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={twMerge("inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full border", sc.bg, sc.text)}>
                        <StatusIcon size={10} /> {sc.label}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          {(s === "expired" || s === "expiring") && (
                            <button onClick={() => updateMutation.mutate({ id: c.id, status: "active", end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10) })}
                              disabled={updateMutation.isPending}
                              className="text-[10px] text-violet-400 border border-violet-500/30 px-2.5 py-1 rounded-lg hover:bg-violet-500/10 transition-colors font-semibold flex items-center gap-1">
                              <RefreshCw size={11} /> Perpanjang
                            </button>
                          )}
                          {s === "active" && (
                            <button onClick={() => updateMutation.mutate({ id: c.id, status: "terminated", end_date: c.end_date })}
                              className="text-[10px] text-red-400 border border-red-500/30 px-2.5 py-1 rounded-lg hover:bg-red-500/10 transition-colors font-semibold">
                              Putus
                            </button>
                          )}
                          <button onClick={() => { if (confirm("Hapus kontrak ini?")) deleteMutation.mutate(c.id); }}
                            className="text-[10px] text-gray-500 hover:text-red-400 px-1.5 py-1 rounded-lg transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
