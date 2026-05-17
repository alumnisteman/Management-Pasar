"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Grid3X3,
  X,
  Users,
  Zap,
  TrendingUp,
  TrendingDown,
  Loader2,
  Pencil,
  Check,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/utils/auth";

const zoneColors = {
  gold:   { bg: "bg-yellow-500", border: "border-yellow-400", ring: "ring-yellow-400", label: "Zone Gold" },
  silver: { bg: "bg-gray-400",   border: "border-gray-300",   ring: "ring-gray-300",   label: "Zone Silver" },
  bronze: { bg: "bg-orange-700", border: "border-orange-600", ring: "ring-orange-600", label: "Zone Bronze" },
};

const zonePricingInfo = {
  gold:   { accent: "border-yellow-500/30 bg-yellow-500/5",  text: "text-yellow-400", badge: "bg-yellow-500/10" },
  silver: { accent: "border-gray-500/30 bg-gray-500/5",      text: "text-gray-300",   badge: "bg-gray-500/10"   },
  bronze: { accent: "border-orange-500/30 bg-orange-500/5",  text: "text-orange-400", badge: "bg-orange-500/10" },
};

export default function GridPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [pricingResult, setPricingResult] = useState({});
  const [editingZone, setEditingZone] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const queryClient = useQueryClient();
  const { isAdmin, isPetugas } = useAuth();

  const { data: stalls = [], isLoading } = useQuery({
    queryKey: ["adminStalls"],
    queryFn: () => fetch("/api/admin/stalls").then((r) => r.json()),
  });

  const { data: zonePricing = [] } = useQuery({
    queryKey: ["zonePricing"],
    queryFn: () => fetch("/api/admin/zones").then((r) => r.json()),
  });

  const updateMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/admin/stalls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStalls"] });
      setSelected(null);
    },
  });

  const dynamicPriceMutation = useMutation({
    mutationFn: ({ zone, customPrice }) =>
      fetch("/api/admin/stalls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apply_dynamic_pricing: true, zone, custom_price: customPrice }),
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    onSuccess: (data, { zone }) => {
      queryClient.invalidateQueries({ queryKey: ["adminStalls"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setPricingResult((prev) => ({ ...prev, [zone]: data }));
    },
  });

  const updateZonePriceMutation = useMutation({
    mutationFn: ({ zone, suggested_price }) =>
      fetch("/api/admin/zones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone, suggested_price }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zonePricing"] });
      setEditingZone(null);
    },
  });

  const rows = {};
  stalls.forEach((s) => {
    if (!rows[s.row_x]) rows[s.row_x] = [];
    rows[s.row_x].push(s);
  });
  const sortedRows = Object.keys(rows).sort((a, b) => Number(a) - Number(b));

  const filtered =
    filter === "all"
      ? stalls
      : stalls.filter((s) => {
          if (filter === "vacant") return s.status === "vacant";
          if (filter === "occupied") return s.status === "occupied";
          return s.zone === filter;
        });

  const stats = {
    total: stalls.length,
    occupied: stalls.filter((s) => s.status === "occupied").length,
    vacant: stalls.filter((s) => s.status === "vacant").length,
    gold: stalls.filter((s) => s.zone === "gold").length,
    silver: stalls.filter((s) => s.zone === "silver").length,
    bronze: stalls.filter((s) => s.zone === "bronze").length,
  };

  const zoneData = ["gold", "silver", "bronze"].map((zone) => {
    const zoneStalls = stalls.filter((s) => s.zone === zone);
    const occupied = zoneStalls.filter((s) => s.status === "occupied").length;
    const occupancyRate = zoneStalls.length > 0 ? Math.round((occupied / zoneStalls.length) * 100) : 0;
    const currentFee = zoneStalls[0]?.monthly_fee || 0;
    // Use manually saved suggested price from zone_pricing if available, else auto-calculated
    const zpRecord = zonePricing.find((z) => z.zone === zone);
    const suggestedFee = zpRecord?.suggested_price || zoneStalls[0]?.suggested_price || currentFee;
    const priceDiff = suggestedFee - currentFee;
    return { zone, total: zoneStalls.length, occupied, occupancyRate, currentFee, suggestedFee, priceDiff };
  });

  function startEdit(zone, currentSuggested) {
    setEditingZone(zone);
    setEditPrice(String(currentSuggested));
  }

  function saveEdit(zone) {
    const val = Number(editPrice);
    if (!val || val < 100000) return;
    updateZonePriceMutation.mutate({ zone, suggested_price: val });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Grid3X3 size={24} className="text-emerald-400" /> GIS & Grid Lapak
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Visualisasi dan manajemen lapak pasar berbasis grid spasial
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: "Total",  val: stats.total,    color: "text-white" },
          { label: "Terisi", val: stats.occupied,  color: "text-green-400" },
          { label: "Kosong", val: stats.vacant,    color: "text-gray-400" },
          { label: "Gold",   val: stats.gold,      color: "text-yellow-400" },
          { label: "Silver", val: stats.silver,    color: "text-gray-300" },
          { label: "Bronze", val: stats.bronze,    color: "text-orange-500" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-[#1C1E27] border border-white/5 rounded-xl p-4 text-center">
            <p className={twMerge("text-xl font-bold", color)}>{val}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all",      label: "Semua" },
          { key: "occupied", label: "Terisi" },
          { key: "vacant",   label: "Kosong" },
          { key: "gold",     label: "Gold" },
          { key: "silver",   label: "Silver" },
          { key: "bronze",   label: "Bronze" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={twMerge(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
              filter === key
                ? "bg-white text-gray-900 border-transparent"
                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid Map */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-sm">Memuat grid...</p>
        </div>
      ) : (
        <div className="bg-[#1C1E27] rounded-xl border border-white/5 p-6 overflow-x-auto">
          <div className="flex gap-4 mb-4 text-[11px] text-gray-500 flex-wrap">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-500/80" /> Zone Gold (Baris 1-2)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-500/80" /> Zone Silver (Baris 3-4)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-700/80" /> Zone Bronze (Baris 5-6)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm border border-dashed border-gray-600" /> Kosong</span>
          </div>
          <div className="space-y-2 min-w-max">
            <div className="flex gap-2 pl-12">
              {stalls.filter((s) => s.row_x === 1).sort((a, b) => a.col_y - b.col_y).map((s) => (
                <div key={s.col_y} className="w-16 text-center text-[10px] text-gray-600">K{s.col_y}</div>
              ))}
            </div>
            {sortedRows.map((rowKey) => {
              const rowStalls = rows[rowKey].sort((a, b) => a.col_y - b.col_y);
              const zone = rowStalls[0]?.zone;
              const zc = zoneColors[zone] || zoneColors.bronze;
              return (
                <div key={rowKey} className="flex gap-2 items-center">
                  <span className={twMerge("w-10 text-[10px] font-bold text-center py-1 rounded", zc.bg, "text-gray-900")}>B{rowKey}</span>
                  {rowStalls.map((s) => {
                    const highlighted = filtered.find((f) => f.id === s.id);
                    const isVacant = s.status === "vacant";
                    const isSelected = selected?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelected(s)}
                        title={`${s.stall_code} · ${s.trader_name || "Kosong"}`}
                        className={twMerge(
                          "w-16 h-10 rounded border text-[10px] font-semibold transition-all duration-100",
                          !highlighted ? "opacity-20" : "",
                          isVacant
                            ? "bg-transparent border-dashed border-gray-600 text-gray-600 hover:border-gray-400"
                            : `${zc.bg} border-transparent text-gray-900 hover:opacity-90`,
                          isSelected ? `ring-2 ${zc.ring} scale-110` : "",
                        )}
                      >
                        {s.stall_code?.slice(-3)}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stall Detail Panel */}
      {selected && (
        <div className="bg-[#1C1E27] rounded-xl border border-white/10 p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-white text-base">Detail Lapak — {selected.stall_code}</h3>
            <button onClick={() => setSelected(null)} className="p-1 hover:bg-white/10 rounded-lg text-gray-400">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-5">
            {[
              { label: "Kode",       val: selected.stall_code },
              { label: "Zone",       val: zoneColors[selected.zone]?.label || selected.zone },
              { label: "Kategori",   val: selected.category },
              { label: "Status",     val: selected.status === "occupied" ? "Terisi" : "Kosong" },
              { label: "Koordinat",  val: `R${selected.row_x} / K${selected.col_y}` },
              { label: "Pedagang",   val: selected.trader_name || "—" },
              { label: "Telepon",    val: selected.trader_phone || "—" },
              { label: "Sewa/Bulan", val: `Rp ${Number(selected.monthly_fee).toLocaleString("id-ID")}` },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-white font-medium mt-0.5">{val}</p>
              </div>
            ))}
          </div>
          {isAdmin && (
            <div className="flex gap-3">
              {selected.status === "occupied" && (
                <button
                  onClick={() => updateMutation.mutate({ id: selected.id, status: "vacant", trader_id: null })}
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Kosongkan Lapak
                </button>
              )}
              <a
                href="/admin/traders"
                className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <Users size={13} /> Kelola Pedagang
              </a>
            </div>
          )}
          {isPetugas && (
            <p className="text-xs text-gray-600 italic">Lihat-saja. Hubungi Admin untuk perubahan lapak.</p>
          )}
        </div>
      )}

      {/* Dynamic Pricing Engine */}
      <div className="bg-[#1C1E27] rounded-xl border border-white/5 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" /> Dynamic Pricing Engine
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Harga lapak disesuaikan berdasarkan tingkat hunian zona.
              {isAdmin ? " Admin dapat mengubah harga yang disarankan." : " Hanya admin yang dapat mengubah harga."}
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
            <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">⚡ Engine Aktif</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zoneData.map(({ zone, total, occupied, occupancyRate, currentFee, suggestedFee, priceDiff }) => {
            const pi = zonePricingInfo[zone] || zonePricingInfo.silver;
            const zc = zoneColors[zone] || zoneColors.silver;
            const result = pricingResult[zone];
            const isPending = dynamicPriceMutation.isPending;
            const priceUp = priceDiff > 0;
            const priceDown = priceDiff < 0;
            const isEditingThis = editingZone === zone;
            return (
              <div key={zone} className={twMerge("rounded-xl border p-5 space-y-4", pi.accent)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={twMerge("w-3 h-3 rounded-full", zc.bg)} />
                    <span className={twMerge("text-sm font-bold", pi.text)}>{zc.label}</span>
                  </div>
                  <span className={twMerge("text-[10px] font-bold px-2 py-1 rounded-full", pi.badge, pi.text)}>
                    {occupancyRate}% Hunian
                  </span>
                </div>
                <div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={twMerge("h-full rounded-full transition-all", zc.bg)} style={{ width: `${occupancyRate}%`, opacity: 0.8 }} />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{occupied} / {total} lapak terisi</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Harga Saat Ini</span>
                    <span className="text-white font-medium">Rp {Number(currentFee).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center gap-2">
                    <span className="text-gray-500 shrink-0">Harga Disarankan</span>
                    {isAdmin && isEditingThis ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-28 bg-[#0F1117] border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500/50"
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && saveEdit(zone)}
                        />
                        <button onClick={() => saveEdit(zone)} className="p-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30">
                          <Check size={12} />
                        </button>
                        <button onClick={() => setEditingZone(null)} className="p-1 rounded bg-white/5 text-gray-400 hover:bg-white/10">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className={twMerge("font-bold", priceUp ? "text-green-400" : priceDown ? "text-red-400" : "text-gray-400")}>
                          Rp {Number(suggestedFee).toLocaleString("id-ID")}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => startEdit(zone, suggestedFee)}
                            className="p-1 rounded hover:bg-white/10 text-gray-600 hover:text-gray-300 transition-colors"
                            title="Edit harga disarankan"
                          >
                            <Pencil size={11} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {priceDiff !== 0 && (
                    <div className="flex items-center gap-1.5 text-[11px]">
                      {priceUp ? <TrendingUp size={12} className="text-green-400" /> : <TrendingDown size={12} className="text-red-400" />}
                      <span className={priceUp ? "text-green-400" : "text-red-400"}>
                        {priceUp ? "+" : ""}Rp {Math.abs(priceDiff).toLocaleString("id-ID")} ({priceUp ? "+" : ""}{Math.round((priceDiff / (currentFee || 1)) * 100)}%)
                      </span>
                    </div>
                  )}
                </div>
                {result && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-green-400 font-semibold">✅ Diterapkan!</p>
                    <p className="text-[10px] text-gray-400">
                      {result.updated} lapak · Rp {Number(result.new_price).toLocaleString("id-ID")} · Hunian {result.occupancy_rate}%
                    </p>
                  </div>
                )}
                {isAdmin ? (
                  <button
                    onClick={() => dynamicPriceMutation.mutate({ zone, customPrice: suggestedFee })}
                    disabled={isPending || priceDiff === 0}
                    className={twMerge(
                      "w-full py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5",
                      priceDiff !== 0
                        ? `${pi.badge} ${pi.text} border-current hover:opacity-80`
                        : "bg-white/5 text-gray-500 border-white/10 cursor-default",
                    )}
                  >
                    {isPending ? <><Loader2 size={13} className="animate-spin" /> Menerapkan...</> : priceDiff === 0 ? "✓ Sudah Optimal" : <><Zap size={13} /> Terapkan Harga Baru</>}
                  </button>
                ) : (
                  <div className="w-full py-2 text-xs text-center text-gray-600 bg-white/[0.02] border border-white/5 rounded-lg">
                    🔒 Hanya Admin
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3 text-xs text-gray-500 leading-relaxed">
          💡 <strong className="text-gray-400">Cara kerja:</strong> Harga proporsional terhadap hunian zona. Batas: Gold (Rp 600rb–1.2jt), Silver (Rp 400rb–850rb), Bronze (Rp 280rb–600rb). Admin dapat mengubah harga yang disarankan secara manual. Setiap perubahan dicatat ke Audit Log.
        </div>
      </div>
    </div>
  );
}
