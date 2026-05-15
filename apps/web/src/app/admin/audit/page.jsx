"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Search, Filter } from "lucide-react";
import { twMerge } from "tailwind-merge";

const moduleColors = {
  SIPTU: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Porter: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Billing: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Pedagang: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Grid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  WhatsApp: "bg-green-500/10 text-green-400 border-green-500/20",
  Laporan: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Sistem: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const actionColors = {
  CREATE: "text-green-400",
  UPDATE: "text-blue-400",
  DELETE: "text-red-400",
  PAYMENT: "text-yellow-400",
  GENERATE: "text-purple-400",
  EXPIRE: "text-orange-400",
  INCENTIVE: "text-cyan-400",
  DYNAMIC_PRICE: "text-yellow-300",
  EXPORT: "text-blue-300",
};

const MODULES = [
  "SIPTU",
  "Porter",
  "Billing",
  "Pedagang",
  "Grid",
  "WhatsApp",
  "Laporan",
  "Sistem",
];

export default function AuditPage() {
  const [moduleFilter, setModuleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(50);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["auditLogs", moduleFilter, limit],
    queryFn: () => {
      const params = new URLSearchParams();
      if (moduleFilter) params.set("module", moduleFilter);
      params.set("limit", limit);
      return fetch(`/api/admin/audit?${params}`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      });
    },
    refetchInterval: 15000,
  });

  const shown = logs.filter(
    (l) =>
      !search ||
      l.description?.toLowerCase().includes(search.toLowerCase()) ||
      l.user_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const moduleStats = MODULES.reduce((acc, m) => {
    acc[m] = logs.filter((l) => l.module === m).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck size={24} className="text-gray-400" /> Audit Log
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Rekam jejak seluruh aktivitas sistem — immutable & chronological
        </p>
      </div>

      {/* Module Activity Bars */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {MODULES.map((m) => {
          const colorClass = moduleColors[m] || moduleColors.Sistem;
          const count = moduleStats[m] || 0;
          return (
            <button
              key={m}
              onClick={() => setModuleFilter(moduleFilter === m ? "" : m)}
              className={twMerge(
                "bg-[#1C1E27] border rounded-xl p-4 text-center transition-all",
                moduleFilter === m
                  ? colorClass
                  : "border-white/5 hover:border-white/10",
              )}
            >
              <p className="text-xl font-bold text-white">{count}</p>
              <p className="text-[10px] text-gray-500 font-medium mt-1">{m}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48 flex items-center gap-2 bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2">
          <Search size={14} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari deskripsi aktivitas..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        >
          <option value="">Semua Modul</option>
          {MODULES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        >
          <option value={25}>25 entri</option>
          <option value={50}>50 entri</option>
          <option value={100}>100 entri</option>
        </select>
      </div>

      {/* Log Feed */}
      <div className="bg-[#1C1E27] rounded-xl border border-white/5 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {shown.length} entri ditemukan
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
            <Filter size={11} /> Diperbarui setiap 15 detik
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {isLoading ? (
            <div className="px-5 py-12 text-center text-gray-500 text-sm">
              Memuat log...
            </div>
          ) : shown.length === 0 ? (
            <div className="px-5 py-12 text-center text-gray-500 text-sm">
              Tidak ada log ditemukan
            </div>
          ) : (
            shown.map((log) => {
              const modColor = moduleColors[log.module] || moduleColors.Sistem;
              const actColor = actionColors[log.action] || "text-gray-400";
              return (
                <div
                  key={log.id}
                  className="px-5 py-3.5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Timestamp */}
                  <div className="shrink-0 w-28">
                    <p className="text-[10px] text-gray-500 font-mono leading-snug">
                      {new Date(log.created_at).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  {/* Module badge */}
                  <span
                    className={twMerge(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                      modColor,
                    )}
                  >
                    {log.module}
                  </span>

                  {/* Action */}
                  <span
                    className={twMerge(
                      "text-[10px] font-bold shrink-0 min-w-16",
                      actColor,
                    )}
                  >
                    {log.action}
                  </span>

                  {/* Description */}
                  <p className="text-xs text-gray-300 flex-1 leading-snug">
                    {log.description}
                  </p>

                  {/* User + IP */}
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] text-gray-500">{log.user_name}</p>
                    <p className="text-[10px] text-gray-700 font-mono">
                      {log.ip_address}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
