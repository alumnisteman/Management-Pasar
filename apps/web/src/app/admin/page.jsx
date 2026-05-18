"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Users,
  Grid3X3,
  FileText,
  CreditCard,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Activity,
  Zap,
  ShieldAlert,
  FileDown,
  Loader2,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { BrainCircuit } from "lucide-react";
import { motion } from "motion/react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => Number(n || 0).toLocaleString("id-ID");
const fmtRp = (n) => `Rp ${fmt(n)}`;

function StatCard({ icon: Icon, label, value, sub, trend, iconClass, accent }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={twMerge(
        "bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex items-start gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
        accent,
      )}
    >
      <div className={twMerge("p-2.5 rounded-xl", iconClass)}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div
          className={twMerge(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
            trend >= 0
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400",
          )}
        >
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </motion.div>
  );
}

function RevenueBar({ data }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map((d) => d.billed), 1);
  const months = [...data].reverse();

  return (
    <div className="flex items-end gap-2 h-32">
      {months.map((m) => {
        const collectedH = Math.round((m.collected / maxVal) * 100);
        const billedH = Math.round((m.billed / maxVal) * 100);
        const label = m.month ? m.month.slice(5) : "";
        return (
          <div
            key={m.month}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div
              className="w-full flex items-end gap-0.5"
              style={{ height: 112 }}
            >
              <div
                className="flex-1 bg-blue-500/30 rounded-t-sm transition-all duration-500"
                style={{ height: `${billedH}%` }}
              />
              <div
                className="flex-1 bg-blue-500 rounded-t-sm transition-all duration-500"
                style={{ height: `${collectedH}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function AlertBadge({ count, label, color }) {
  if (!count) return null;
  return (
    <div
      className={twMerge(
        "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium",
        color,
      )}
    >
      <AlertTriangle size={13} />
      <span>
        {count} {label}
      </span>
    </div>
  );
}

const moduleColors = {
  SIPTU: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Porter: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Billing: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Pedagang: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Grid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Sistem: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

function AISummaryWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["aiBrief"],
    queryFn: () => fetch("/api/ai/brief").then((r) => r.json()),
    refetchInterval: 60000,
  });

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/30 p-5 relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <div className="absolute top-0 right-0 p-8 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
      
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
          <BrainCircuit size={18} />
        </div>
        <h3 className="text-sm font-semibold text-white tracking-tight">AI System Intelligence</h3>
        {isLoading && <Loader2 size={14} className="text-blue-500 animate-spin ml-auto" />}
      </div>

      <div className="relative z-10">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-3 bg-white/5 rounded-full w-full animate-pulse" />
            <div className="h-3 bg-white/5 rounded-full w-3/4 animate-pulse" />
          </div>
        ) : (
          <p className="text-sm text-gray-300 leading-relaxed italic">
            "{data?.summary || "AI Analysis unavailable"}"
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] text-blue-400/60 font-medium uppercase tracking-widest relative z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        DeepSeek-V3 Live Analysis
      </div>
    </div>
  );
}

function ExportButton({ label, sub, type, month, iconColor }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, month }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      if (typeof window !== "undefined") {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `laporan-${type}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={twMerge(
        "flex items-center gap-3 p-4 bg-[#16181F] border rounded-xl text-left transition-all hover:border-white/20 group w-full disabled:opacity-60",
        done ? "border-green-500/40 bg-green-500/5" : "border-white/5",
      )}
    >
      {loading ? (
        <Loader2 size={18} className="text-gray-400 shrink-0 animate-spin" />
      ) : done ? (
        <CheckCircle2 size={18} className="text-green-400 shrink-0" />
      ) : (
        <FileDown
          size={18}
          className={twMerge(
            "shrink-0 group-hover:text-white transition-colors",
            iconColor,
          )}
        />
      )}
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">
          {done ? "✅ Berhasil diunduh!" : sub}
        </p>
      </div>
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () =>
      fetch("/api/admin/stats").then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Activity size={32} className="text-blue-500 animate-pulse" />
          <p className="text-gray-400 text-sm">Memuat data sistem...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <ShieldAlert size={32} className="text-red-500" />
          <p className="text-red-400 text-sm">
            Gagal memuat data: {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-blue-400 hover:underline"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const {
    traders,
    stalls,
    billing,
    porters,
    permits,
    revenue,
    recentActivity,
  } = data;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-7xl mx-auto pb-10"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Pulse</h1>
          <p className="text-sm text-gray-400 mt-1">
            Gambaran kesehatan pasar secara real-time · SVMS v6.0 Enterprise
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <AlertBadge
            count={billing?.unpaid}
            label="tagihan belum bayar"
            color="bg-rose-500/10 text-rose-400 border border-rose-500/20"
          />
          <AlertBadge
            count={permits?.expired}
            label="SIPTU kadaluarsa"
            color="bg-orange-500/10 text-orange-400 border border-orange-500/20"
          />
          <AlertBadge
            count={permits?.expiringSoon}
            label="SIPTU akan habis"
            color="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          />
        </div>
      </div>

      {/* AI Summary Section */}
      <AISummaryWidget />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Revenue Bulan Ini"
          value={fmtRp(billing?.totalCollected)}
          sub={`dari ${fmtRp(billing?.totalBilled)} ditagihkan`}
          trend={8}
          iconClass="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={Grid3X3}
          label="Tingkat Hunian"
          value={`${stalls?.occupancyRate}%`}
          sub={`${stalls?.occupied} / ${stalls?.total} lapak terisi`}
          trend={2}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          icon={CheckCircle2}
          label="Compliance Rate"
          value={`${billing?.complianceRate}%`}
          sub={`${billing?.paid} dari ${billing?.totalBills} tagihan lunas`}
          trend={billing?.complianceRate >= 70 ? 3 : -5}
          iconClass="bg-violet-500/10 text-violet-400"
        />
        <StatCard
          icon={Package}
          label="Kuli Aktif"
          value={`${porters?.total} Porter`}
          sub={`${porters?.available} tersedia · ${porters?.onDuty} bertugas`}
          iconClass="bg-cyan-500/10 text-cyan-400"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-xl border border-white/5 p-5">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
            Pedagang
          </p>
          <div className="space-y-2">
            {[
              { label: "Aktif", val: traders?.active, color: "bg-green-500" },
              {
                label: "Peringatan",
                val: traders?.warning,
                color: "bg-yellow-500",
              },
              {
                label: "Nonaktif",
                val: traders?.inactive,
                color: "bg-gray-500",
              },
            ].map(({ label, val, color }) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className={twMerge("w-2 h-2 rounded-full", color)} />
                  <span className="text-gray-400">{label}</span>
                </div>
                <span className="text-white font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-xl border border-white/5 p-5">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
            Grid Lapak
          </p>
          <div className="space-y-2">
            {[
              { label: "Zone Gold", val: stalls?.gold, color: "bg-yellow-500" },
              {
                label: "Zone Silver",
                val: stalls?.silver,
                color: "bg-gray-400",
              },
              {
                label: "Zone Bronze",
                val: stalls?.bronze,
                color: "bg-orange-700",
              },
            ].map(({ label, val, color }) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className={twMerge("w-2 h-2 rounded-full", color)} />
                  <span className="text-gray-400">{label}</span>
                </div>
                <span className="text-white font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-xl border border-white/5 p-5">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
            SIPTU Perizinan
          </p>
          <div className="space-y-2">
            {[
              { label: "Aktif", val: permits?.active, color: "bg-green-500" },
              {
                label: "Kadaluarsa",
                val: permits?.expired,
                color: "bg-red-500",
              },
              {
                label: "Akan Habis",
                val: permits?.expiringSoon,
                color: "bg-yellow-500",
              },
            ].map(({ label, val, color }) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className={twMerge("w-2 h-2 rounded-full", color)} />
                  <span className="text-gray-400">{label}</span>
                </div>
                <span className="text-white font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-xl border border-white/5 p-5">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
            Porter Rating
          </p>
          <div className="flex flex-col items-center justify-center h-20">
            <p className="text-4xl font-black text-white">
              {Number(porters?.avgRating || 5).toFixed(1)}
            </p>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={twMerge(
                    "text-sm",
                    s <= Math.round(porters?.avgRating || 5)
                      ? "text-yellow-400"
                      : "text-gray-600",
                  )}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Rata-rata {porters?.total} porter
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Chart + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-xl border border-white/5 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">
                Revenue 6 Bulan Terakhir
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Perbandingan tagihan vs. terkumpul
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500/30 rounded-sm" />{" "}
                Ditagihkan
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-sm" /> Terkumpul
              </span>
            </div>
          </div>
          <RevenueBar data={revenue} />
        </div>

        {/* Recent Activity */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-xl border border-white/5 p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" /> Aktivitas Terbaru
          </h3>
          <div className="space-y-3">
            {(recentActivity || []).map((log) => {
              const colorClass =
                moduleColors[log.module] || moduleColors.Sistem;
              return (
                <div key={log.id} className="flex gap-3 items-start">
                  <span
                    className={twMerge(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 mt-0.5",
                      colorClass,
                    )}
                  >
                    {log.module}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 leading-snug truncate">
                      {log.description}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      {new Date(log.created_at).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Kelola Pedagang",
            href: "/admin/traders",
            icon: Users,
            color: "hover:border-violet-500/50",
          },
          {
            label: "Grid Lapak",
            href: "/admin/grid",
            icon: Grid3X3,
            color: "hover:border-emerald-500/50",
          },
          {
            label: "SIPTU Perizinan",
            href: "/admin/siptu",
            icon: FileText,
            color: "hover:border-orange-500/50",
          },
          {
            label: "Kelola Tagihan",
            href: "/admin/billing",
            icon: CreditCard,
            color: "hover:border-rose-500/50",
          },
        ].map(({ label, href, icon: Icon, color }) => (
          <a
            key={href}
            href={href}
            className={twMerge(
              "bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/5 rounded-xl p-5 flex items-center gap-3 transition-all duration-150 group",
              color,
            )}
          >
            <Icon
              size={20}
              className="text-gray-400 group-hover:text-white transition-colors"
            />
            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
              {label}
            </span>
          </a>
        ))}
      </div>

      {/* Ekspor Laporan PDF */}
      <div className="bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-xl border border-white/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileDown size={18} className="text-blue-400" />
          <h3 className="text-base font-semibold text-white">
            Ekspor Laporan PDF
          </h3>
          <span className="ml-auto text-[10px] text-gray-500 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
            PDF Engine
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ExportButton
            label="Laporan Tagihan Bulanan"
            sub="Revenue, compliance rate, status bayar semua pedagang"
            type="billing"
            month={new Date().toISOString().slice(0, 7)}
            iconColor="text-rose-400"
          />
          <ExportButton
            label="Data Seluruh Pedagang"
            sub="NIK, lapak, SIPTU, tipe, dan status pedagang"
            type="traders"
            iconColor="text-violet-400"
          />
          <ExportButton
            label="Kuli Panggul & Insentif"
            sub="Rating, tier bonus, dan performa mingguan porter"
            type="porter"
            iconColor="text-cyan-400"
          />
        </div>
      </div>
    </motion.div>
  );
}
