"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, ReferenceLine,
} from "recharts";
import {
  TrendingUp, TrendingDown, Minus, Activity, ShieldAlert,
  DollarSign, AlertTriangle, Target, Sparkles, Star,
  ArrowUpRight, ArrowDownRight, BarChart3, Wallet, Clock,
  Download, Printer, FileSpreadsheet, CheckCircle2,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";

// ── Formatters ─────────────────────────────────────────────────────────────────
const fmtRp  = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
const fmtRpShort = (n) => {
  const v = Number(n || 0);
  if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `Rp ${(v / 1_000).toFixed(0)}K`;
  return `Rp ${v}`;
};
const fmtDate = () => new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

// ── CSV Export ─────────────────────────────────────────────────────────────────
function buildCSV(data) {
  const { cashflowChart, aging, zonePerformance, topDebtors, kpis } = data;
  const rows = [];
  const sep = "\t"; // tab-separated = Excel-friendly

  rows.push(["LAPORAN KEUANGAN SVMS ENTERPRISE"]);
  rows.push([`Tanggal Ekspor: ${fmtDate()}`]);
  rows.push([]);

  rows.push(["=== RINGKASAN KPI ==="]);
  rows.push(["Indikator", "Nilai"]);
  rows.push(["Total Ditagihkan", kpis.totalBilled]);
  rows.push(["Total Terkumpul", kpis.totalCollected]);
  rows.push(["Total Piutang", kpis.totalUnpaid]);
  rows.push(["Collection Rate (%)", kpis.collectionRate]);
  rows.push(["Rata-rata/Bulan", kpis.monthlyAvg]);
  rows.push(["Prediksi Bulan Depan", kpis.nextMonthPrediction]);
  rows.push(["Tren", kpis.trendDirection]);
  rows.push([]);

  rows.push(["=== CASHFLOW 6 BULAN + PREDIKSI ==="]);
  rows.push(["Bulan", "Ditagihkan (Rp)", "Terkumpul (Rp)", "Piutang (Rp)", "Prediksi (Rp)", "Status"]);
  cashflowChart.forEach(m => {
    rows.push([m.label, m.billed || 0, m.collected || 0, m.gap || 0, m.predicted || 0, m.isPrediction ? "PREDIKSI" : "AKTUAL"]);
  });
  rows.push([]);

  rows.push(["=== AGING TUNGGAKAN ==="]);
  rows.push(["Periode", "Rentang", "Jumlah Tagihan", "Total (Rp)"]);
  aging.forEach(b => rows.push([b.label, b.range, b.count, b.amount]));
  rows.push([]);

  rows.push(["=== PERFORMA PER ZONA ==="]);
  rows.push(["Zona", "Total Lapak", "Terisi", "Ditagihkan (Rp)", "Terkumpul (Rp)", "Piutang (Rp)", "Compliance (%)"]);
  zonePerformance.forEach(z => {
    rows.push([`Zona ${z.label}`, z.totalStalls, z.occupiedStalls, z.billed, z.collected, z.unpaid, z.complianceRate]);
  });
  rows.push([]);

  rows.push(["=== TOP PEDAGANG TUNGGAKAN ==="]);
  rows.push(["Nama", "Lapak", "Zona", "Total Tunggakan (Rp)", "Jumlah Tagihan"]);
  topDebtors.forEach(t => {
    rows.push([t.name, t.stall, t.zone, t.debt, t.bills]);
  });

  return rows.map(r => r.join(sep)).join("\n");
}

function downloadCSV(data) {
  const csv = buildCSV(data);
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel
  const blob = new Blob([BOM + csv], { type: "text/tab-separated-values;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `laporan-keuangan-svms-${new Date().toISOString().slice(0, 10)}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1C1E27]/95 backdrop-blur border border-white/10 rounded-xl p-3 shadow-2xl min-w-[160px]">
      <p className="text-white text-xs font-bold mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-400">{p.name}</span>
          </span>
          <span className="font-semibold text-white">{fmtRpShort(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, trend, iconClass, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex items-start gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
    >
      <div className={twMerge("p-2.5 rounded-xl shrink-0", iconClass)}><Icon size={20} /></div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-white mt-1 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className={twMerge("flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 mt-1",
          trend > 0 ? "bg-green-500/10 text-green-400" : trend < 0 ? "bg-red-500/10 text-red-400" : "bg-gray-500/10 text-gray-400"
        )}>
          {trend > 0 ? <ArrowUpRight size={12} /> : trend < 0 ? <ArrowDownRight size={12} /> : <Minus size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </motion.div>
  );
}

// ── Section Card ───────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, iconClass, badge, children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={twMerge("bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)]", className)}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className={twMerge("p-1.5 rounded-lg", iconClass || "bg-white/10")}><Icon size={16} /></div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {badge && <span className="ml-auto text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">{badge}</span>}
      </div>
      {children}
    </motion.div>
  );
}

// ── Zone Card ──────────────────────────────────────────────────────────────────
const ZONE_META = {
  gold:   { label: "Gold",   color: "#eab308", bg: "bg-yellow-500/10",  border: "border-yellow-500/20",  text: "text-yellow-400" },
  silver: { label: "Silver", color: "#9ca3af", bg: "bg-gray-400/10",    border: "border-gray-400/20",    text: "text-gray-400"   },
  bronze: { label: "Bronze", color: "#b45309", bg: "bg-orange-700/10",  border: "border-orange-700/20",  text: "text-orange-600" },
};

function ZoneCard({ data, delay }) {
  const meta = ZONE_META[data.zone] || ZONE_META.bronze;
  const occupancy = data.totalStalls > 0 ? Math.round((data.occupiedStalls / data.totalStalls) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={twMerge("relative overflow-hidden rounded-2xl border p-5", meta.bg, meta.border)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: meta.color }} />
          <p className={twMerge("text-sm font-bold", meta.text)}>Zona {meta.label}</p>
        </div>
        <span className={twMerge("text-xs font-bold px-2 py-0.5 rounded-full border", meta.bg, meta.border, meta.text)}>
          {data.complianceRate}% lunas
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div><p className="text-[10px] text-gray-500">Terkumpul</p><p className="text-base font-bold text-white">{fmtRpShort(data.collected)}</p></div>
        <div><p className="text-[10px] text-gray-500">Piutang</p><p className="text-base font-bold text-red-400">{fmtRpShort(data.unpaid)}</p></div>
        <div><p className="text-[10px] text-gray-500">Lapak Terisi</p><p className="text-base font-bold text-white">{data.occupiedStalls}/{data.totalStalls}</p></div>
        <div><p className="text-[10px] text-gray-500">Tarif/Bulan</p><p className="text-base font-bold text-white">{fmtRpShort(data.monthlyFee)}</p></div>
      </div>
      <div>
        <div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>Hunian</span><span>{occupancy}%</span></div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${occupancy}%` }}
            transition={{ duration: 0.8, delay }}
            className="h-full rounded-full"
            style={{ background: meta.color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ── Print Layout (hidden on screen, visible when printing) ────────────────────
function PrintLayout({ data }) {
  const { cashflowChart, aging, zonePerformance, topDebtors, kpis } = data;
  return (
    <div id="print-area" className="hidden print:block text-black bg-white p-8 font-sans text-sm">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">LAPORAN INTELIJEN KEUANGAN</h1>
        <p className="text-gray-600 text-sm mt-1">SVMS Enterprise — Sistem Manajemen Pasar Terpadu</p>
        <p className="text-gray-500 text-xs mt-0.5">Dicetak: {fmtDate()}</p>
      </div>

      {/* KPI Summary */}
      <h2 className="font-bold text-gray-800 mb-3 text-base">Ringkasan KPI</h2>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Terkumpul", value: fmtRp(kpis.totalCollected) },
          { label: "Collection Rate", value: `${kpis.collectionRate}%` },
          { label: "Total Piutang", value: fmtRp(kpis.totalUnpaid) },
          { label: "Prediksi Bulan Depan", value: fmtRp(kpis.nextMonthPrediction) },
        ].map((k, i) => (
          <div key={i} className="border border-gray-200 rounded p-3">
            <p className="text-xs text-gray-500">{k.label}</p>
            <p className="font-bold text-gray-900 text-sm mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Cashflow Table */}
      <h2 className="font-bold text-gray-800 mb-3 text-base">Cashflow & Prediksi</h2>
      <table className="w-full border-collapse mb-6 text-xs">
        <thead>
          <tr className="bg-gray-100">
            {["Bulan", "Ditagihkan (Rp)", "Terkumpul (Rp)", "Piutang (Rp)", "Prediksi (Rp)", "Status"].map(h => (
              <th key={h} className="border border-gray-300 px-2 py-1.5 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cashflowChart.map((m, i) => (
            <tr key={i} className={m.isPrediction ? "bg-violet-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-300 px-2 py-1">{m.label}</td>
              <td className="border border-gray-300 px-2 py-1">{m.billed ? fmtRp(m.billed) : "-"}</td>
              <td className="border border-gray-300 px-2 py-1">{m.collected ? fmtRp(m.collected) : "-"}</td>
              <td className="border border-gray-300 px-2 py-1">{m.gap ? fmtRp(m.gap) : "-"}</td>
              <td className="border border-gray-300 px-2 py-1">{m.predicted ? fmtRp(m.predicted) : "-"}</td>
              <td className="border border-gray-300 px-2 py-1 font-semibold">{m.isPrediction ? "Prediksi" : "Aktual"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Aging Table */}
      <h2 className="font-bold text-gray-800 mb-3 text-base">Aging Tunggakan</h2>
      <table className="w-full border-collapse mb-6 text-xs">
        <thead>
          <tr className="bg-gray-100">
            {["Periode", "Rentang", "Jumlah Tagihan", "Total Piutang (Rp)"].map(h => (
              <th key={h} className="border border-gray-300 px-2 py-1.5 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {aging.map((b, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-300 px-2 py-1 font-semibold">{b.label}</td>
              <td className="border border-gray-300 px-2 py-1">{b.range}</td>
              <td className="border border-gray-300 px-2 py-1">{b.count}</td>
              <td className="border border-gray-300 px-2 py-1">{fmtRp(b.amount)}</td>
            </tr>
          ))}
          <tr className="bg-red-50 font-bold">
            <td colSpan={2} className="border border-gray-300 px-2 py-1">Total</td>
            <td className="border border-gray-300 px-2 py-1">{aging.reduce((s,b) => s+b.count, 0)}</td>
            <td className="border border-gray-300 px-2 py-1">{fmtRp(kpis.totalUnpaid)}</td>
          </tr>
        </tbody>
      </table>

      {/* Zone Table */}
      <h2 className="font-bold text-gray-800 mb-3 text-base">Performa per Zona</h2>
      <table className="w-full border-collapse mb-6 text-xs">
        <thead>
          <tr className="bg-gray-100">
            {["Zona", "Lapak", "Terisi", "Ditagihkan (Rp)", "Terkumpul (Rp)", "Piutang (Rp)", "Compliance"].map(h => (
              <th key={h} className="border border-gray-300 px-2 py-1.5 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {zonePerformance.map((z, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-300 px-2 py-1 font-semibold">Zona {z.label}</td>
              <td className="border border-gray-300 px-2 py-1">{z.totalStalls}</td>
              <td className="border border-gray-300 px-2 py-1">{z.occupiedStalls}</td>
              <td className="border border-gray-300 px-2 py-1">{fmtRp(z.billed)}</td>
              <td className="border border-gray-300 px-2 py-1">{fmtRp(z.collected)}</td>
              <td className="border border-gray-300 px-2 py-1">{fmtRp(z.unpaid)}</td>
              <td className="border border-gray-300 px-2 py-1 font-semibold">{z.complianceRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Debtors Table */}
      {topDebtors.length > 0 && (
        <>
          <h2 className="font-bold text-gray-800 mb-3 text-base">Pedagang Tunggakan Terbesar</h2>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100">
                {["#", "Nama Pedagang", "Lapak", "Zona", "Total Tunggakan (Rp)", "Jumlah Tagihan"].map(h => (
                  <th key={h} className="border border-gray-300 px-2 py-1.5 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topDebtors.map((t, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-2 py-1 font-bold">{i + 1}</td>
                  <td className="border border-gray-300 px-2 py-1">{t.name}</td>
                  <td className="border border-gray-300 px-2 py-1">{t.stall}</td>
                  <td className="border border-gray-300 px-2 py-1 capitalize">{t.zone}</td>
                  <td className="border border-gray-300 px-2 py-1 font-semibold text-red-700">{fmtRp(t.debt)}</td>
                  <td className="border border-gray-300 px-2 py-1">{t.bills}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-400 flex justify-between">
        <span>SVMS Enterprise — Dinas Pengelolaan Pasar</span>
        <span>Dokumen ini dicetak otomatis oleh sistem</span>
      </div>
    </div>
  );
}

// ── Export Button ──────────────────────────────────────────────────────────────
function ExportButton({ icon: Icon, label, onClick, color, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={twMerge(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 print:hidden",
        color
      )}
    >
      {loading ? <Activity size={14} className="animate-spin" /> : <Icon size={14} />}
      {label}
    </button>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function FinancialPage() {
  const [exporting, setExporting] = useState(null);
  const [exported, setExported] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["financial"],
    queryFn: () => fetch("/api/admin/financial").then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),
    refetchInterval: 60000,
  });

  const handleCSV = useCallback(() => {
    if (!data) return;
    setExporting("csv");
    setTimeout(() => {
      downloadCSV(data);
      setExporting(null);
      setExported("csv");
      setTimeout(() => setExported(null), 3000);
    }, 400);
  }, [data]);

  const handlePrint = useCallback(() => {
    setExporting("print");
    setTimeout(() => {
      window.print();
      setExporting(null);
    }, 200);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Activity size={32} className="text-emerald-400 animate-pulse" />
          <p className="text-gray-400 text-sm">Menganalisis data keuangan...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-red-400">
          <ShieldAlert size={32} />
          <p className="text-sm">Gagal memuat: {error?.message}</p>
        </div>
      </div>
    );
  }

  const { cashflowChart, aging, zonePerformance, topDebtors, kpis } = data;

  return (
    <>
      {/* Print-only layout */}
      <PrintLayout data={data} />

      <div className="space-y-6 max-w-7xl mx-auto pb-10 print:hidden">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg"><Sparkles size={15} className="text-emerald-400" /></div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Financial Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Analisis Keuangan Mendalam</h1>
            <p className="text-sm text-gray-400 mt-1">Prediksi pendapatan, aging tunggakan, cashflow, dan performa per zona</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Trend badge */}
            <div className={twMerge(
              "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold",
              kpis.trendDirection === 'up'   ? "bg-green-500/10 border-green-500/30 text-green-400" :
              kpis.trendDirection === 'down' ? "bg-red-500/10 border-red-500/30 text-red-400" :
              "bg-gray-500/10 border-gray-500/20 text-gray-400"
            )}>
              {kpis.trendDirection === 'up' ? <TrendingUp size={15} /> : kpis.trendDirection === 'down' ? <TrendingDown size={15} /> : <Minus size={15} />}
              Tren {kpis.trendDirection === 'up' ? 'Naik' : kpis.trendDirection === 'down' ? 'Turun' : 'Stabil'} {kpis.trendPercent}%
            </div>
            {/* Export Excel/CSV */}
            <ExportButton
              icon={exported === "csv" ? CheckCircle2 : FileSpreadsheet}
              label={exported === "csv" ? "Tersimpan!" : "Export Excel"}
              onClick={handleCSV}
              loading={exporting === "csv"}
              color={exported === "csv"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"}
            />
            {/* Print PDF */}
            <ExportButton
              icon={Printer}
              label="Cetak PDF"
              onClick={handlePrint}
              loading={exporting === "print"}
              color="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
            />
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={DollarSign} label="Total Terkumpul" value={fmtRpShort(kpis.totalCollected)} sub={`dari ${fmtRpShort(kpis.totalBilled)} ditagihkan`} trend={kpis.collectionRate >= 75 ? 5 : -3} iconClass="bg-emerald-500/10 text-emerald-400" delay={0} />
          <KpiCard icon={Target} label="Collection Rate" value={`${kpis.collectionRate}%`} sub={`Rata-rata bulan: ${fmtRpShort(kpis.monthlyAvg)}`} trend={kpis.collectionRate >= 75 ? 3 : -5} iconClass="bg-blue-500/10 text-blue-400" delay={0.05} />
          <KpiCard icon={AlertTriangle} label="Total Piutang" value={fmtRpShort(kpis.totalUnpaid)} sub="tagihan belum terbayar" trend={-1} iconClass="bg-rose-500/10 text-rose-400" delay={0.1} />
          <KpiCard icon={Sparkles} label="Prediksi Bulan Depan" value={fmtRpShort(kpis.nextMonthPrediction)} sub={`Terbaik: ${kpis.bestMonth?.label} (${fmtRpShort(kpis.bestMonth?.amount)})`} trend={kpis.trendDirection === 'up' ? kpis.trendPercent : kpis.trendDirection === 'down' ? -kpis.trendPercent : 0} iconClass="bg-violet-500/10 text-violet-400" delay={0.15} />
        </div>

        {/* Cashflow + Prediction Chart */}
        <SectionCard title="Cashflow & Prediksi Pendapatan" icon={BarChart3} iconClass="bg-blue-500/10 text-blue-400" badge="AI Projection">
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4 -mt-1">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500/40" /> Ditagihkan</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500" /> Terkumpul</span>
            <span className="flex items-center gap-1.5"><span className="w-6 h-px border-t-2 border-dashed border-violet-400" /> Prediksi</span>
            <span className="flex items-center gap-1.5 ml-auto"><Clock size={11} /> 6 bulan aktual + 3 bulan prediksi</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cashflowChart} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="label" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmtRpShort} width={70} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine x={cashflowChart?.find(m => m.isPrediction)?.label} stroke="#6b7280" strokeDasharray="4 4" label={{ value: 'Proyeksi →', fill: '#6b7280', fontSize: 10 }} />
                <Bar dataKey="billed" name="Ditagihkan" fill="#3b82f6" fillOpacity={0.35} radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Terkumpul" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Line dataKey="predicted" name="Prediksi" stroke="#a78bfa" strokeWidth={2.5} strokeDasharray="6 3" dot={{ fill: '#a78bfa', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Aging + Top Debtors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Aging Tunggakan */}
          <SectionCard title="Aging Tunggakan" icon={Clock} iconClass="bg-rose-500/10 text-rose-400">
            <div className="space-y-4">
              {aging.map((bucket, i) => {
                const maxAmount = Math.max(...aging.map(b => b.amount), 1);
                const pct = Math.round((bucket.amount / maxAmount) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: bucket.color }} />
                        <div>
                          <span className="text-xs font-semibold text-white">{bucket.label}</span>
                          <span className="text-[10px] text-gray-500 ml-2">({bucket.range})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white">{fmtRpShort(bucket.amount)}</span>
                        <span className="text-[10px] text-gray-500 ml-1.5">{bucket.count} tagihan</span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: bucket.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Piutang</p>
                <p className="text-base font-bold text-red-400">{fmtRp(kpis.totalUnpaid)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Tagihan Menunggak</p>
                <p className="text-base font-bold text-white">{aging.reduce((s, b) => s + b.count, 0)} tagihan</p>
              </div>
            </div>
          </SectionCard>

          {/* Top Debtors */}
          <SectionCard title="Pedagang Tunggakan Terbesar" icon={AlertTriangle} iconClass="bg-orange-500/10 text-orange-400">
            {topDebtors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <Star size={28} className="text-green-400 mb-2" />
                <p className="text-sm font-semibold text-green-400">Semua tagihan lunas!</p>
                <p className="text-xs mt-1">Tidak ada tunggakan saat ini</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topDebtors.map((trader, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className={twMerge("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      i === 0 ? "bg-red-500/20 text-red-400" : i === 1 ? "bg-orange-500/20 text-orange-400" : "bg-gray-500/20 text-gray-400"
                    )}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{trader.name}</p>
                      <p className="text-[10px] text-gray-500">{trader.stall} · Zona {trader.zone?.charAt(0).toUpperCase() + trader.zone?.slice(1)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-red-400">{fmtRpShort(trader.debt)}</p>
                      <p className="text-[10px] text-gray-500">{trader.bills} tagihan</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Zone Performance */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={16} className="text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Performa Keuangan per Zona</h3>
            <span className="text-[10px] text-gray-500 ml-1">Revenue & compliance per zona lapak</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zonePerformance.map((zone, i) => (
              <ZoneCard key={zone.zone} data={zone} delay={i * 0.08} />
            ))}
          </div>
        </div>

        {/* Zone Revenue Bar Chart */}
        <SectionCard title="Perbandingan Revenue Antar Zona" icon={BarChart3} iconClass="bg-yellow-500/10 text-yellow-400">
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4 -mt-1">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500/40" /> Total Ditagihkan</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500" /> Terkumpul</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500/60" /> Piutang</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={zonePerformance.map(z => ({
                  name: `Zona ${z.label}`,
                  Ditagihkan: z.billed,
                  Terkumpul: z.collected,
                  Piutang: z.unpaid,
                }))}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmtRpShort} width={70} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="Ditagihkan" fill="#3b82f6" fillOpacity={0.35} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Terkumpul" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Piutang" fill="#ef4444" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

      </div>
    </>
  );
}
