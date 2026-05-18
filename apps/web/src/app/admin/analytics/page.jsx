"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  LineChart, Line, 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Activity, ShieldAlert, LineChart as LineChartIcon, Map, DollarSign, Users } from "lucide-react";
import { twMerge } from "tailwind-merge";

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];
const ZONE_COLORS = {
  'Zone Gold': '#eab308',
  'Zone Silver': '#9ca3af',
  'Zone Bronze': '#b45309'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1E27] border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.name !== 'Terisi' && entry.name !== 'Kosong' && entry.name !== 'count' && entry.name !== 'Total' ? 
              (entry.name === 'Ditagihkan' || entry.name === 'Terkumpul' ? `Rp ${entry.value.toLocaleString('id-ID')}` : entry.value) 
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => fetch("/api/admin/analytics").then((r) => {
      if (!r.ok) throw new Error("Gagal mengambil data");
      return r.json();
    }),
    refetchInterval: 30000
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Activity size={32} className="text-yellow-500 animate-pulse" />
          <p className="text-gray-400 text-sm">Menghitung analitik kompleks...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-red-400">
          <ShieldAlert size={32} />
          <p className="text-sm">Gagal memuat analitik: {error?.message}</p>
        </div>
      </div>
    );
  }

  const { revenueTrend, occupancyData, billingStats, porterRatings } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LineChartIcon size={24} className="text-yellow-400" /> Analitik & Statistik Real-time
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Visualisasi data mendalam untuk pengambilan keputusan strategis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend LineChart */}
        <div className="bg-[#1C1E27] rounded-xl border border-white/5 p-6 lg:col-span-2 shadow-lg">
          <div className="flex items-center gap-2 mb-6 text-blue-400">
            <DollarSign size={20} />
            <h3 className="text-lg font-bold text-white">Tren Pendapatan Tagihan (6 Bulan)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `Rp ${(val/1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Ditagihkan" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Terkumpul" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy PieChart */}
        <div className="bg-[#1C1E27] rounded-xl border border-white/5 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6 text-emerald-400">
            <Map size={20} />
            <h3 className="text-lg font-bold text-white">Distribusi Hunian per Zona</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Terisi" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Kosong" stackId="a" fill="#374151" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Billing Stats BarChart */}
        <div className="bg-[#1C1E27] rounded-xl border border-white/5 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6 text-rose-400">
            <DollarSign size={20} />
            <h3 className="text-lg font-bold text-white">Status Pembayaran Keseluruhan</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={billingStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {billingStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1E27', borderColor: '#ffffff10', borderRadius: '12px', color: 'white' }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Porter Performance */}
        <div className="bg-[#1C1E27] rounded-xl border border-white/5 p-6 lg:col-span-2 shadow-lg">
          <div className="flex items-center gap-2 mb-6 text-cyan-400">
            <Users size={20} />
            <h3 className="text-lg font-bold text-white">Distribusi Rating Kuli Panggul</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porterRatings} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="rating" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Jumlah Petugas" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                  {porterRatings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#06b6d4' : index === 1 ? '#3b82f6' : index === 2 ? '#eab308' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
