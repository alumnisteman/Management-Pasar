"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Activity,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Info
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1E27] border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-white font-bold mb-1">{label}</p>
        <p className="text-sm font-medium text-emerald-400 mb-1">
          Proyeksi: Rp {payload[0].value.toLocaleString("id-ID")}
        </p>
        <p className="text-[10px] text-gray-400">
          Confidence Score: {payload[0].payload.confidence_score}%
        </p>
      </div>
    );
  }
  return null;
};

export default function AIInsightsPage() {
  const { data: predictive, isLoading: isPredLoading, error: predError } = useQuery({
    queryKey: ["aiPredictive"],
    queryFn: () => fetch("/api/admin/analytics/predictive").then((r) => r.json()),
    refetchInterval: 60000,
  });

  const { data: traffic, isLoading: isTrafficLoading } = useQuery({
    queryKey: ["aiTraffic"],
    queryFn: () => fetch("/api/admin/analytics/foot-traffic").then((r) => r.json()),
    refetchInterval: 15000,
  });

  if (isPredLoading || isTrafficLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <BrainCircuit size={32} className="text-purple-500 animate-pulse" />
          <p className="text-gray-400 text-sm">Sedang mengambil wawasan AI...</p>
        </div>
      </div>
    );
  }

  if (predError || !predictive) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-red-400">
          <ShieldAlert size={32} />
          <p className="text-sm">Gagal memuat analitik AI</p>
        </div>
      </div>
    );
  }

  const forecastData = predictive.forecast || [];
  const riskScores = predictive.risk_scores || [];
  const pricing = predictive.price_optimization || {};
  const trafficStats = traffic?.traffic_stats || [];
  const alerts = traffic?.evacuation_alerts || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
              <BrainCircuit size={24} />
            </div>
            AI Insights & Prediksi
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Wawasan prediktif dan rekomendasi cerdas yang dihasilkan oleh DeepSeek-V3
          </p>
        </div>
      </div>

      {/* ALERTS SECTION */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start gap-3"
            >
              <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-red-400 uppercase tracking-wide">
                  Peringatan Evakuasi: Zona {alert.zone_name}
                </p>
                <p className="text-xs text-gray-300 mt-1">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FINANCIAL FORECAST CHART */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp size={20} />
              <h3 className="text-lg font-bold text-white">Proyeksi Pendapatan (6 Bulan)</h3>
            </div>
            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full uppercase tracking-widest border border-white/10">
              AI Forecast
            </span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="projected_revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorProjected)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PRICE OPTIMIZATION WIDGET */}
        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-600/10 rounded-2xl border border-purple-500/20 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-purple-400">
              <Activity size={20} />
              <h3 className="text-base font-bold text-white">Optimalisasi Tarif Sewa</h3>
            </div>
            <div className="text-center py-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                Okupansi Saat Ini
              </p>
              <div className="text-4xl font-black text-white">{pricing.occupancy}%</div>
              
              <div className="mt-8">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                  Rekomendasi Tarif Baru
                </p>
                <div className="flex justify-center items-end gap-2">
                  <span className="text-3xl font-black text-purple-400">
                    Rp {pricing.suggested_rent?.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1">
                  {pricing.percentage_change > 0 ? (
                    <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <TrendingUp size={12} className="mr-1" /> +{pricing.percentage_change}% Naik
                    </span>
                  ) : pricing.percentage_change < 0 ? (
                    <span className="flex items-center text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      <TrendingDown size={12} className="mr-1" /> {pricing.percentage_change}% Turun
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-bold text-gray-400 bg-gray-500/10 px-2 py-0.5 rounded border border-gray-500/20">
                      Harga Stabil
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-start gap-2 mt-4">
            <Info size={14} className="text-purple-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-300 leading-relaxed italic">
              {pricing.recommendation}
            </p>
          </div>
        </div>

        {/* TOP RISK SCORES TABLE */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle size={20} />
              <h3 className="text-lg font-bold text-white">Prediksi Risiko Gagal Bayar</h3>
            </div>
            <span className="text-xs text-gray-500">Top 10 Pedagang</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Pedagang</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Tunggakan (Rp)</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Bulan Terlambat</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Probabilitas Gagal</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Tingkat Risiko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {riskScores.map((t) => (
                  <tr key={t.trader_id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-sm font-medium text-white">{t.name}</td>
                    <td className="py-3 text-sm text-gray-300 text-right">{t.arrears?.toLocaleString("id-ID") || 0}</td>
                    <td className="py-3 text-sm text-gray-300 text-center">{t.unpaid_bills}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-bold text-white w-8">{t.probability}%</span>
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={twMerge(
                              "h-full rounded-full",
                              t.probability > 70 ? "bg-red-500" : t.probability > 40 ? "bg-yellow-500" : "bg-green-500"
                            )} 
                            style={{ width: `${t.probability}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className={twMerge(
                        "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                        t.risk_level === "Tinggi" ? "bg-red-500/20 text-red-400" : 
                        t.risk_level === "Sedang" ? "bg-yellow-500/20 text-yellow-400" : 
                        "bg-green-500/20 text-green-400"
                      )}>
                        {t.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
                {riskScores.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-sm text-gray-500">
                      Tidak ada data risiko untuk ditampilkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LIVE FOOT TRAFFIC */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-sky-400">
            <MapPin size={20} />
            <h3 className="text-lg font-bold text-white">Live Foot Traffic</h3>
          </div>
          
          <div className="space-y-4">
            {trafficStats.map((zone) => {
              const overload = zone.current_traffic > 450;
              return (
                <div key={zone.zone_id} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-white">Zona {zone.zone_name}</p>
                    <span className={twMerge(
                      "text-[10px] font-bold px-2 py-0.5 rounded",
                      overload ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-emerald-500/20 text-emerald-400"
                    )}>
                      {zone.current_traffic} orang
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Rata-rata: {zone.average_traffic}</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={twMerge(
                          "h-full rounded-full transition-all duration-700",
                          overload ? "bg-red-500" : "bg-sky-500"
                        )}
                        style={{ width: `${Math.min((zone.current_traffic / 500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
