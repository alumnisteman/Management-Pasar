"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Users, Grid3X3, FileText, CreditCard, Package,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  BarChart3, Activity, Zap, ShieldAlert, FileDown, Loader2,
  BrainCircuit, Crown, Briefcase, Eye, Building2, HardHat,
  ClipboardList, MapPin, QrCode, Megaphone, ShieldCheck,
  ArrowRight, Star, Clock, Target, Landmark, TriangleAlert,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import { useRole } from "@/app/useRole";

const fmt = (n) => Number(n || 0).toLocaleString("id-ID");
const fmtRp = (n) => `Rp ${fmt(n)}`;

// ── Shared Components ──────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, trend, iconClass, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -3 }}
      className={twMerge(
        "bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex items-start gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
        accent,
      )}
    >
      <div className={twMerge("p-2.5 rounded-xl shrink-0", iconClass)}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className={twMerge("flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full shrink-0", trend >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </motion.div>
  );
}

function SectionCard({ title, icon: Icon, iconClass, children, className }) {
  return (
    <div className={twMerge("bg-white/5 backdrop-blur-md rounded-xl border border-white/5 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className={twMerge("p-1.5 rounded-lg", iconClass || "bg-white/10")}><Icon size={15} /></div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function QuickLink({ href, label, icon: Icon, color }) {
  return (
    <a href={href} className={twMerge("bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-4 flex items-center gap-3 transition-all duration-150 group hover:bg-white/10", color)}>
      <Icon size={18} className="text-gray-400 group-hover:text-white transition-colors shrink-0" />
      <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{label}</span>
      <ArrowRight size={14} className="ml-auto text-gray-600 group-hover:text-gray-300 transition-colors" />
    </a>
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
        return (
          <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5" style={{ height: 112 }}>
              <div className="flex-1 bg-blue-500/30 rounded-t-sm transition-all duration-500" style={{ height: `${billedH}%` }} />
              <div className="flex-1 bg-blue-500 rounded-t-sm transition-all duration-500" style={{ height: `${collectedH}%` }} />
            </div>
            <span className="text-[10px] text-gray-500">{m.month ? m.month.slice(5) : ""}</span>
          </div>
        );
      })}
    </div>
  );
}

function AlertBadge({ count, label, color }) {
  if (!count) return null;
  return (
    <div className={twMerge("flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium", color)}>
      <AlertTriangle size={13} />
      <span>{count} {label}</span>
    </div>
  );
}

function AISummaryWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["aiBrief"],
    queryFn: () => fetch("/api/ai/brief").then((r) => r.json()),
    refetchInterval: 60000,
  });
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/30 p-5 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <div className="absolute top-0 right-0 p-8 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><BrainCircuit size={18} /></div>
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
          <p className="text-sm text-gray-300 leading-relaxed italic">"{data?.summary || "AI Analysis unavailable"}"</p>
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
        a.href = url; a.download = `laporan-${type}.pdf`; a.click();
        URL.revokeObjectURL(url);
      }
      setDone(true); setTimeout(() => setDone(false), 3000);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  return (
    <button onClick={handleExport} disabled={loading} className={twMerge("flex items-center gap-3 p-4 bg-[#16181F] border rounded-xl text-left transition-all hover:border-white/20 group w-full disabled:opacity-60", done ? "border-green-500/40 bg-green-500/5" : "border-white/5")}>
      {loading ? <Loader2 size={18} className="text-gray-400 shrink-0 animate-spin" /> : done ? <CheckCircle2 size={18} className="text-green-400 shrink-0" /> : <FileDown size={18} className={twMerge("shrink-0 group-hover:text-white transition-colors", iconColor)} />}
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">{done ? "✅ Berhasil diunduh!" : sub}</p>
      </div>
    </button>
  );
}

const moduleColors = {
  SIPTU: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Porter: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Billing: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Pedagang: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Grid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Sistem: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  Laporan: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

// ── ROLE DASHBOARDS ────────────────────────────────────────────────────────────

function AdminDashboard({ data }) {
  const { traders, stalls, billing, porters, permits, revenue, recentActivity } = data;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Pulse</h1>
          <p className="text-sm text-gray-400 mt-1">Gambaran kesehatan pasar secara real-time · SVMS v6.0 Enterprise</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <AlertBadge count={billing?.unpaid} label="tagihan belum bayar" color="bg-rose-500/10 text-rose-400 border border-rose-500/20" />
          <AlertBadge count={permits?.expired} label="SIPTU kadaluarsa" color="bg-orange-500/10 text-orange-400 border border-orange-500/20" />
          <AlertBadge count={permits?.expiringSoon} label="SIPTU akan habis" color="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" />
        </div>
      </div>
      <AISummaryWidget />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Revenue Bulan Ini" value={fmtRp(billing?.totalCollected)} sub={`dari ${fmtRp(billing?.totalBilled)} ditagihkan`} trend={8} iconClass="bg-blue-500/10 text-blue-400" delay={0} />
        <StatCard icon={Grid3X3} label="Tingkat Hunian" value={`${stalls?.occupancyRate}%`} sub={`${stalls?.occupied} / ${stalls?.total} lapak terisi`} trend={2} iconClass="bg-emerald-500/10 text-emerald-400" delay={0.05} />
        <StatCard icon={CheckCircle2} label="Compliance Rate" value={`${billing?.complianceRate}%`} sub={`${billing?.paid} dari ${billing?.totalBills} tagihan lunas`} trend={billing?.complianceRate >= 70 ? 3 : -5} iconClass="bg-violet-500/10 text-violet-400" delay={0.1} />
        <StatCard icon={Package} label="Kuli Aktif" value={`${porters?.total} Porter`} sub={`${porters?.available} tersedia · ${porters?.onDuty} bertugas`} iconClass="bg-cyan-500/10 text-cyan-400" delay={0.15} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Pedagang", items: [{ label: "Aktif", val: traders?.active, color: "bg-green-500" }, { label: "Peringatan", val: traders?.warning, color: "bg-yellow-500" }, { label: "Nonaktif", val: traders?.inactive, color: "bg-gray-500" }] },
          { title: "Grid Lapak", items: [{ label: "Zone Gold", val: stalls?.gold, color: "bg-yellow-500" }, { label: "Zone Silver", val: stalls?.silver, color: "bg-gray-400" }, { label: "Zone Bronze", val: stalls?.bronze, color: "bg-orange-700" }] },
          { title: "SIPTU Perizinan", items: [{ label: "Aktif", val: permits?.active, color: "bg-green-500" }, { label: "Kadaluarsa", val: permits?.expired, color: "bg-red-500" }, { label: "Akan Habis", val: permits?.expiringSoon, color: "bg-yellow-500" }] },
        ].map(({ title, items }) => (
          <div key={title} className="bg-white/5 backdrop-blur-md rounded-xl border border-white/5 p-5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">{title}</p>
            <div className="space-y-2">
              {items.map(({ label, val, color }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><span className={twMerge("w-2 h-2 rounded-full", color)} /><span className="text-gray-400">{label}</span></div>
                  <span className="text-white font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/5 p-5">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Porter Rating</p>
          <div className="flex flex-col items-center justify-center h-20">
            <p className="text-4xl font-black text-white">{Number(porters?.avgRating || 5).toFixed(1)}</p>
            <div className="flex gap-0.5 mt-1">{[1,2,3,4,5].map((s) => <span key={s} className={twMerge("text-sm", s <= Math.round(porters?.avgRating || 5) ? "text-yellow-400" : "text-gray-600")}>★</span>)}</div>
            <p className="text-[10px] text-gray-500 mt-1">Rata-rata {porters?.total} porter</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/5 p-6">
          <div className="flex items-start justify-between mb-6">
            <div><h3 className="text-base font-semibold text-white">Revenue 6 Bulan Terakhir</h3><p className="text-xs text-gray-500 mt-1">Perbandingan tagihan vs. terkumpul</p></div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500/30 rounded-sm" /> Ditagihkan</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-sm" /> Terkumpul</span>
            </div>
          </div>
          <RevenueBar data={revenue} />
        </div>
        <div className="md:col-span-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/5 p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2"><Zap size={16} className="text-yellow-400" /> Aktivitas Terbaru</h3>
          <div className="space-y-3">
            {(recentActivity || []).map((log) => (
              <div key={log.id} className="flex gap-3 items-start">
                <span className={twMerge("text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 mt-0.5", moduleColors[log.module] || moduleColors.Sistem)}>{log.module}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 leading-snug truncate">{log.description}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{new Date(log.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Kelola Pedagang", href: "/admin/traders", icon: Users, color: "hover:border-violet-500/50" },
          { label: "Grid Lapak", href: "/admin/grid", icon: Grid3X3, color: "hover:border-emerald-500/50" },
          { label: "SIPTU Perizinan", href: "/admin/siptu", icon: FileText, color: "hover:border-orange-500/50" },
          { label: "Kelola Tagihan", href: "/admin/billing", icon: CreditCard, color: "hover:border-rose-500/50" },
        ].map(({ label, href, icon: Icon, color }) => (
          <a key={href} href={href} className={twMerge("bg-white/5 border border-white/5 rounded-xl p-5 flex items-center gap-3 transition-all duration-150 group", color)}>
            <Icon size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{label}</span>
          </a>
        ))}
      </div>
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileDown size={18} className="text-blue-400" />
          <h3 className="text-base font-semibold text-white">Ekspor Laporan PDF</h3>
          <span className="ml-auto text-[10px] text-gray-500 bg-white/5 border border-white/10 px-2 py-1 rounded-full">PDF Engine</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ExportButton label="Laporan Tagihan Bulanan" sub="Revenue, compliance rate, status bayar semua pedagang" type="billing" month={new Date().toISOString().slice(0, 7)} iconColor="text-rose-400" />
          <ExportButton label="Data Seluruh Pedagang" sub="NIK, lapak, SIPTU, tipe, dan status pedagang" type="traders" iconColor="text-violet-400" />
          <ExportButton label="Kuli Panggul & Insentif" sub="Rating, tier bonus, dan performa mingguan porter" type="porter" iconColor="text-cyan-400" />
        </div>
      </div>
    </motion.div>
  );
}

function KepalaPassarDashboard({ data }) {
  const { traders, stalls, billing, porters, permits, revenue } = data;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-amber-500/20 rounded-lg"><Crown size={16} className="text-amber-400" /></div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Kepala Pasar</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Ringkasan Eksekutif</h1>
          <p className="text-sm text-gray-400 mt-1">Gambaran strategis kondisi pasar hari ini</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <AlertBadge count={billing?.unpaid} label="tagihan tertunggak" color="bg-rose-500/10 text-rose-400 border border-rose-500/20" />
          <AlertBadge count={permits?.expired} label="izin kadaluarsa" color="bg-orange-500/10 text-orange-400 border border-orange-500/20" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Pendapatan Bulan Ini" value={fmtRp(billing?.totalCollected)} sub={`Target: ${fmtRp(billing?.totalBilled)}`} trend={billing?.complianceRate >= 75 ? 5 : -3} iconClass="bg-amber-500/10 text-amber-400" delay={0} />
        <StatCard icon={Target} label="Tingkat Hunian" value={`${stalls?.occupancyRate}%`} sub={`${stalls?.occupied} dari ${stalls?.total} lapak aktif`} trend={2} iconClass="bg-emerald-500/10 text-emerald-400" delay={0.05} />
        <StatCard icon={CheckCircle2} label="Compliance Bayar" value={`${billing?.complianceRate}%`} sub={`${billing?.paid}/${billing?.totalBills} pedagang lunas`} trend={billing?.complianceRate >= 70 ? 3 : -5} iconClass="bg-violet-500/10 text-violet-400" delay={0.1} />
        <StatCard icon={Users} label="Total Pedagang" value={traders?.total} sub={`${traders?.active} aktif · ${traders?.warning} perlu perhatian`} iconClass="bg-blue-500/10 text-blue-400" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SectionCard title="Performa Zona Lapak" icon={Grid3X3} iconClass="bg-emerald-500/10 text-emerald-400" className="md:col-span-1">
          <div className="space-y-3">
            {[
              { zone: "Gold", count: stalls?.gold, color: "bg-yellow-500", bar: "bg-yellow-500/70" },
              { zone: "Silver", count: stalls?.silver, color: "bg-gray-400", bar: "bg-gray-400/70" },
              { zone: "Bronze", count: stalls?.bronze, color: "bg-orange-700", bar: "bg-orange-700/70" },
            ].map(({ zone, count, color, bar }) => (
              <div key={zone}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2"><span className={twMerge("w-2 h-2 rounded-full", color)} /><span className="text-gray-300 font-medium">Zona {zone}</span></div>
                  <span className="text-white font-bold">{count} lapak</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={twMerge("h-full rounded-full transition-all duration-700", bar)} style={{ width: `${Math.round((count / (stalls?.total || 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Total Lapak Tersedia</span>
              <span className="text-white font-bold">{stalls?.vacant} kosong</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Tren Pendapatan 6 Bulan" icon={BarChart3} iconClass="bg-blue-500/10 text-blue-400" className="md:col-span-2">
          <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500/30 rounded-sm" /> Ditagihkan</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-sm" /> Terkumpul</span>
          </div>
          <RevenueBar data={revenue} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="Status Izin (SIPTU)" icon={FileText} iconClass="bg-orange-500/10 text-orange-400">
          <div className="grid grid-cols-3 gap-3 mt-1">
            {[
              { label: "Aktif", val: permits?.active, bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
              { label: "Kadaluarsa", val: permits?.expired, bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
              { label: "Akan Habis", val: permits?.expiringSoon, bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
            ].map(({ label, val, bg, text, border }) => (
              <div key={label} className={twMerge("rounded-xl p-3 border text-center", bg, border)}>
                <p className={twMerge("text-2xl font-black", text)}>{val}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Kondisi Tim Kuli Panggul" icon={Package} iconClass="bg-cyan-500/10 text-cyan-400">
          <div className="grid grid-cols-3 gap-3 mt-1">
            {[
              { label: "Total", val: porters?.total, bg: "bg-white/5", text: "text-white", border: "border-white/5" },
              { label: "Tersedia", val: porters?.available, bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
              { label: "Bertugas", val: porters?.onDuty, bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
            ].map(({ label, val, bg, text, border }) => (
              <div key={label} className={twMerge("rounded-xl p-3 border text-center", bg, border)}>
                <p className={twMerge("text-2xl font-black", text)}>{val}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-0.5">{[1,2,3,4,5].map((s) => <span key={s} className={s <= Math.round(porters?.avgRating || 5) ? "text-yellow-400 text-sm" : "text-gray-600 text-sm"}>★</span>)}</div>
            <span className="text-xs text-gray-400">Rata-rata rating: <strong className="text-white">{Number(porters?.avgRating || 5).toFixed(1)}</strong></span>
          </div>
        </SectionCard>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Akses Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickLink href="/admin/traders" label="Data Pedagang" icon={Users} color="hover:border-violet-500/50" />
          <QuickLink href="/admin/billing" label="Tagihan & Bayar" icon={CreditCard} color="hover:border-rose-500/50" />
          <QuickLink href="/admin/contracts" label="Kontrak Digital" icon={FileText} color="hover:border-blue-500/50" />
          <QuickLink href="/admin/reports" label="Laporan Harian" icon={FileDown} color="hover:border-emerald-500/50" />
        </div>
      </div>
    </motion.div>
  );
}

function OperatorDashboard({ data }) {
  const { traders, stalls, billing, porters, permits, recentActivity } = data;
  const urgentTasks = (billing?.unpaid || 0) + (permits?.expired || 0) + (permits?.expiringSoon || 0);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg"><Briefcase size={16} className="text-emerald-400" /></div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Operator Harian</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Pusat Operasional</h1>
          <p className="text-sm text-gray-400 mt-1">Tugas harian, status lapak, dan aktivitas pasar</p>
        </div>
        {urgentTasks > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <TriangleAlert size={16} className="text-amber-400 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-amber-400">{urgentTasks} tugas perlu perhatian</p>
              <p className="text-[10px] text-gray-400">Segera ditindaklanjuti</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={CreditCard} label="Tagihan Belum Bayar" value={billing?.unpaid || 0} sub="perlu ditagihkan hari ini" trend={billing?.unpaid > 2 ? -1 : 0} iconClass="bg-rose-500/10 text-rose-400" delay={0} />
        <StatCard icon={FileText} label="Izin Kadaluarsa" value={permits?.expired || 0} sub={`+ ${permits?.expiringSoon || 0} akan habis segera`} iconClass="bg-orange-500/10 text-orange-400" delay={0.05} />
        <StatCard icon={Grid3X3} label="Lapak Kosong" value={stalls?.vacant || 0} sub={`dari ${stalls?.total} total lapak`} iconClass="bg-emerald-500/10 text-emerald-400" delay={0.1} />
        <StatCard icon={Package} label="Porter Tersedia" value={porters?.available || 0} sub={`${porters?.onDuty || 0} sedang bertugas`} iconClass="bg-cyan-500/10 text-cyan-400" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="Ringkasan Status Pedagang" icon={Users} iconClass="bg-violet-500/10 text-violet-400">
          <div className="space-y-2 mt-1">
            {[
              { label: "Pedagang Aktif", val: traders?.active, color: "bg-green-500", pct: Math.round((traders?.active / traders?.total) * 100) || 0, barColor: "bg-green-500" },
              { label: "Perlu Perhatian", val: traders?.warning, color: "bg-yellow-500", pct: Math.round((traders?.warning / traders?.total) * 100) || 0, barColor: "bg-yellow-500" },
              { label: "Tidak Aktif", val: traders?.inactive, color: "bg-gray-500", pct: Math.round((traders?.inactive / traders?.total) * 100) || 0, barColor: "bg-gray-600" },
            ].map(({ label, val, color, pct, barColor }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2"><span className={twMerge("w-2 h-2 rounded-full", color)} /><span className="text-gray-300">{label}</span></div>
                  <span className="text-white font-bold">{val} <span className="text-gray-500 font-normal">({pct}%)</span></span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={twMerge("h-full rounded-full transition-all duration-700", barColor)} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <a href="/admin/traders" className="mt-4 flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
            <span className="text-xs font-medium text-gray-400 group-hover:text-white">Lihat Semua Pedagang</span>
            <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-300" />
          </a>
        </SectionCard>

        <SectionCard title="Aktivitas Terbaru" icon={Zap} iconClass="bg-yellow-500/10 text-yellow-400">
          <div className="space-y-3">
            {(recentActivity || []).slice(0, 5).map((log) => (
              <div key={log.id} className="flex gap-3 items-start">
                <span className={twMerge("text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 mt-0.5", moduleColors[log.module] || moduleColors.Sistem)}>{log.module}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 leading-snug truncate">{log.description}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{new Date(log.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Aksi Cepat Operator</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <QuickLink href="/admin/billing" label="Kelola Tagihan" icon={CreditCard} color="hover:border-rose-500/50" />
          <QuickLink href="/admin/traders" label="Data Pedagang" icon={Users} color="hover:border-violet-500/50" />
          <QuickLink href="/admin/siptu" label="Perbarui SIPTU" icon={FileText} color="hover:border-orange-500/50" />
          <QuickLink href="/admin/porter" label="Manajemen Porter" icon={Package} color="hover:border-cyan-500/50" />
          <QuickLink href="/admin/grid" label="Grid Lapak" icon={Grid3X3} color="hover:border-emerald-500/50" />
          <QuickLink href="/admin/announcements" label="Pengumuman" icon={Megaphone} color="hover:border-blue-500/50" />
        </div>
      </div>
    </motion.div>
  );
}

function AuditorDashboard({ data }) {
  const { traders, billing, permits, revenue, recentActivity } = data;
  const complianceScore = billing?.complianceRate || 0;
  const complianceColor = complianceScore >= 80 ? "text-green-400" : complianceScore >= 60 ? "text-yellow-400" : "text-red-400";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-violet-500/20 rounded-lg"><Eye size={16} className="text-violet-400" /></div>
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Auditor Keuangan</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Audit & Kepatuhan</h1>
        <p className="text-sm text-gray-400 mt-1">Monitoring kepatuhan pembayaran, perizinan, dan integritas sistem</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Target} label="Compliance Rate" value={`${complianceScore}%`} sub={`${billing?.paid} dari ${billing?.totalBills} tagihan lunas`} trend={complianceScore >= 70 ? 3 : -5} iconClass="bg-violet-500/10 text-violet-400" delay={0} />
        <StatCard icon={TrendingUp} label="Total Terkumpul" value={fmtRp(billing?.totalCollected)} sub={`Sisa piutang: ${fmtRp((billing?.totalBilled || 0) - (billing?.totalCollected || 0))}`} iconClass="bg-emerald-500/10 text-emerald-400" delay={0.05} />
        <StatCard icon={AlertTriangle} label="Tagihan Belum Bayar" value={billing?.unpaid || 0} sub="perlu tindak lanjut segera" trend={-1} iconClass="bg-rose-500/10 text-rose-400" delay={0.1} />
        <StatCard icon={FileText} label="Izin Bermasalah" value={(permits?.expired || 0) + (permits?.expiringSoon || 0)} sub={`${permits?.expired} kadaluarsa · ${permits?.expiringSoon} akan habis`} iconClass="bg-orange-500/10 text-orange-400" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/5 p-5">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">Skor Kepatuhan Keseluruhan</p>
          <div className="flex flex-col items-center py-4">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={complianceScore >= 80 ? "#22c55e" : complianceScore >= 60 ? "#eab308" : "#ef4444"} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - complianceScore / 100)}`} style={{ transition: "stroke-dashoffset 1s ease" }} />
              </svg>
              <div className="text-center">
                <p className={twMerge("text-3xl font-black", complianceColor)}>{complianceScore}%</p>
                <p className="text-[9px] text-gray-500 mt-0.5">Compliance</p>
              </div>
            </div>
            <p className={twMerge("text-sm font-semibold mt-3", complianceColor)}>
              {complianceScore >= 80 ? "Sangat Baik" : complianceScore >= 60 ? "Perlu Perbaikan" : "Kritis - Perlu Tindakan"}
            </p>
          </div>
        </div>

        <SectionCard title="Laporan Keuangan 6 Bulan" icon={BarChart3} iconClass="bg-blue-500/10 text-blue-400" className="md:col-span-2">
          <div className="mb-3 flex gap-4 text-xs text-gray-400">
            <div><span className="text-white font-bold">{fmtRp(billing?.totalBilled)}</span> <span className="text-gray-500">total ditagihkan</span></div>
            <div><span className="text-white font-bold">{fmtRp(billing?.totalCollected)}</span> <span className="text-gray-500">terkumpul</span></div>
          </div>
          <RevenueBar data={revenue} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="Log Audit Sistem" icon={ShieldCheck} iconClass="bg-gray-500/10 text-gray-400">
          <div className="space-y-3">
            {(recentActivity || []).slice(0, 6).map((log) => (
              <div key={log.id} className="flex gap-3 items-start">
                <span className={twMerge("text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 mt-0.5", moduleColors[log.module] || moduleColors.Sistem)}>{log.action || log.module}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 leading-snug truncate">{log.description}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{new Date(log.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="/admin/audit" className="mt-4 flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
            <span className="text-xs font-medium text-gray-400 group-hover:text-white">Lihat Audit Log Lengkap</span>
            <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-300" />
          </a>
        </SectionCard>

        <SectionCard title="Status Pedagang Bermasalah" icon={AlertTriangle} iconClass="bg-rose-500/10 text-rose-400">
          <div className="space-y-3 mt-1">
            <div className="flex items-center justify-between p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-white">Tagihan Tertunggak</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Pedagang belum melunasi pembayaran</p>
              </div>
              <span className="text-2xl font-black text-rose-400">{billing?.unpaid || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-white">Izin SIPTU Kadaluarsa</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Perlu pembaruan segera</p>
              </div>
              <span className="text-2xl font-black text-orange-400">{permits?.expired || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-white">Pedagang Status Warning</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Perlu monitoring aktif</p>
              </div>
              <span className="text-2xl font-black text-yellow-400">{traders?.warning || 0}</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Akses Cepat Auditor</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickLink href="/admin/audit" label="Audit Log Lengkap" icon={ShieldCheck} color="hover:border-violet-500/50" />
          <QuickLink href="/admin/billing" label="Tagihan & Keuangan" icon={CreditCard} color="hover:border-rose-500/50" />
          <QuickLink href="/admin/analytics" label="Analitik Real-time" icon={BarChart3} color="hover:border-yellow-500/50" />
          <QuickLink href="/admin/reports" label="Ekspor Laporan" icon={FileDown} color="hover:border-emerald-500/50" />
        </div>
      </div>
    </motion.div>
  );
}

function PemdaDashboard({ data }) {
  const { traders, stalls, billing, porters, permits, revenue } = data;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-sky-500/20 rounded-lg"><Building2 size={16} className="text-sky-400" /></div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Dinas Pengelolaan Pasar</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Laporan Kinerja Pasar</h1>
        <p className="text-sm text-gray-400 mt-1">Ringkasan data untuk kebutuhan pelaporan daerah</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/5 border border-sky-500/20 rounded-2xl p-6">
          <p className="text-xs text-sky-400 font-bold uppercase tracking-widest mb-2">Pendapatan Retribusi Bulan Ini</p>
          <p className="text-4xl font-black text-white">{fmtRp(billing?.totalCollected)}</p>
          <p className="text-sm text-gray-400 mt-1">dari target {fmtRp(billing?.totalBilled)}</p>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${billing?.complianceRate || 0}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">Tingkat realisasi: <span className="text-sky-400 font-bold">{billing?.complianceRate}%</span></p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border border-emerald-500/20 rounded-2xl p-6">
          <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-2">Tingkat Hunian Lapak</p>
          <p className="text-4xl font-black text-white">{stalls?.occupancyRate}%</p>
          <p className="text-sm text-gray-400 mt-1">{stalls?.occupied} terisi dari {stalls?.total} lapak</p>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${stalls?.occupancyRate || 0}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2"><span className="text-emerald-400 font-bold">{stalls?.vacant}</span> lapak masih tersedia untuk alokasi</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Pedagang Terdaftar" value={traders?.total} sub={`${traders?.active} aktif berdagang`} iconClass="bg-violet-500/10 text-violet-400" delay={0} />
        <StatCard icon={FileText} label="Izin SIPTU Aktif" value={permits?.active} sub={`${permits?.expired} kadaluarsa perlu perbarui`} iconClass="bg-orange-500/10 text-orange-400" delay={0.05} />
        <StatCard icon={Package} label="Tenaga Kuli Terdaftar" value={porters?.total} sub={`Rata-rata rating: ${Number(porters?.avgRating || 5).toFixed(1)} ★`} iconClass="bg-cyan-500/10 text-cyan-400" delay={0.1} />
        <StatCard icon={Landmark} label="Piutang Belum Lunas" value={fmtRp((billing?.totalBilled || 0) - (billing?.totalCollected || 0))} sub={`${billing?.unpaid} tagihan tertunda`} iconClass="bg-rose-500/10 text-rose-400" delay={0.15} />
      </div>

      <SectionCard title="Tren Pendapatan Retribusi 6 Bulan Terakhir" icon={BarChart3} iconClass="bg-sky-500/10 text-sky-400">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500/30 rounded-sm" /> Total Ditagihkan</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-sm" /> Terkumpul</span>
        </div>
        <RevenueBar data={revenue} />
      </SectionCard>

      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Laporan & Dokumen</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <QuickLink href="/admin/analytics" label="Analitik Real-time" icon={BarChart3} color="hover:border-sky-500/50" />
          <QuickLink href="/admin/reports" label="Unduh Laporan PDF" icon={FileDown} color="hover:border-emerald-500/50" />
          <QuickLink href="/admin/announcements" label="Pengumuman Pasar" icon={Megaphone} color="hover:border-blue-500/50" />
        </div>
      </div>
    </motion.div>
  );
}

function PetugasDashboard({ data }) {
  const { stalls, porters, recentActivity } = data;
  const [announcements, setAnnouncements] = useState([]);
  const { data: annData } = useQuery({
    queryKey: ["petugasAnn"],
    queryFn: () => fetch("/api/admin/announcements").then(r => r.json()),
    refetchInterval: 30000,
  });
  const activeAnn = (annData || []).filter(a => {
    const now = new Date();
    const start = new Date(a.start_date);
    const end = a.end_date ? new Date(a.end_date) : null;
    return now >= start && (!end || now <= end);
  });
  const urgencyBg = { DARURAT: "bg-red-500/10 border-red-500/30 text-red-400", PENTING: "bg-amber-500/10 border-amber-500/30 text-amber-400", INFO: "bg-blue-500/10 border-blue-500/20 text-blue-400" };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto pb-10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-orange-500/20 rounded-lg"><HardHat size={16} className="text-orange-400" /></div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Petugas Lapangan</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Operasional Lapangan</h1>
        <p className="text-sm text-gray-400 mt-1">Tugas harian, monitoring lapak, dan info pasar</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={Grid3X3} label="Lapak Kosong" value={stalls?.vacant || 0} sub={`${stalls?.occupied || 0} terisi · ${stalls?.total || 0} total`} iconClass="bg-emerald-500/10 text-emerald-400" delay={0} />
        <StatCard icon={Package} label="Porter Tersedia" value={porters?.available || 0} sub={`${porters?.onDuty || 0} sedang bertugas`} iconClass="bg-cyan-500/10 text-cyan-400" delay={0.05} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a href="/admin/grid" className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-emerald-500/20 transition-colors group">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <MapPin size={24} className="text-emerald-400" />
          </div>
          <span className="text-sm font-semibold text-white text-center">Lihat Peta Lapak</span>
          <span className="text-[10px] text-gray-400 text-center">Grid & status kios</span>
        </a>
        <a href="/admin/porter" className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-cyan-500/20 transition-colors group">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ClipboardList size={24} className="text-cyan-400" />
          </div>
          <span className="text-sm font-semibold text-white text-center">Daftar Porter</span>
          <span className="text-[10px] text-gray-400 text-center">Kelola penugasan kuli</span>
        </a>
      </div>

      <SectionCard title="Pengumuman Aktif" icon={Megaphone} iconClass="bg-blue-500/10 text-blue-400">
        {activeAnn.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">Tidak ada pengumuman aktif saat ini</p>
        ) : (
          <div className="space-y-3">
            {activeAnn.map(a => (
              <div key={a.id} className={twMerge("p-3 rounded-lg border", urgencyBg[a.urgency] || urgencyBg.INFO)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-current/10">{a.urgency}</span>
                  <p className="text-xs font-bold text-white">{a.title}</p>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        )}
        <a href="/admin/announcements" className="mt-3 flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
          <span className="text-xs font-medium text-gray-400 group-hover:text-white">Lihat Semua Pengumuman</span>
          <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-300" />
        </a>
      </SectionCard>

      <SectionCard title="Aktivitas Sistem Terbaru" icon={Activity} iconClass="bg-gray-500/10 text-gray-400">
        <div className="space-y-3">
          {(recentActivity || []).slice(0, 5).map((log) => (
            <div key={log.id} className="flex gap-3 items-start">
              <span className={twMerge("text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 mt-0.5", moduleColors[log.module] || moduleColors.Sistem)}>{log.module}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300 leading-snug truncate">{log.description}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">{new Date(log.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </motion.div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [role] = useRole();
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => fetch("/api/admin/stats").then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
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
          <p className="text-red-400 text-sm">Gagal memuat data: {error.message}</p>
          <button onClick={() => window.location.reload()} className="text-xs text-blue-400 hover:underline">Coba Lagi</button>
        </div>
      </div>
    );
  }

  if (role === "kepala_pasar") return <KepalaPassarDashboard data={data} />;
  if (role === "operator") return <OperatorDashboard data={data} />;
  if (role === "auditor") return <AuditorDashboard data={data} />;
  if (role === "pemda") return <PemdaDashboard data={data} />;
  if (role === "petugas") return <PetugasDashboard data={data} />;
  return <AdminDashboard data={data} />;
}
