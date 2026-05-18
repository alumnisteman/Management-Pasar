"use client";

import { useState } from "react";
import { useRole } from "@/app/useRole";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Grid3X3,
  Info,
  X,
  Users,
  Zap,
  TrendingUp,
  TrendingDown,
  Loader2,
  Plus,
  Trash2,
  Edit2
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";

const zoneColors = {
  gold: {
    bg: "bg-yellow-500",
    border: "border-yellow-400",
    ring: "ring-yellow-400",
    label: "Zone Gold",
    fee: "Rp 750.000",
  },
  silver: {
    bg: "bg-gray-400",
    border: "border-gray-300",
    ring: "ring-gray-300",
    label: "Zone Silver",
    fee: "Rp 500.000",
  },
  bronze: {
    bg: "bg-orange-700",
    border: "border-orange-600",
    ring: "ring-orange-600",
    label: "Zone Bronze",
    fee: "Rp 350.000",
  },
};

const zonePricingInfo = {
  gold: {
    accent: "border-yellow-500/30 bg-yellow-500/5",
    text: "text-yellow-400",
    badge: "bg-yellow-500/10",
  },
  silver: {
    accent: "border-gray-500/30 bg-gray-500/5",
    text: "text-gray-300",
    badge: "bg-gray-500/10",
  },
  bronze: {
    accent: "border-orange-500/30 bg-orange-500/5",
    text: "text-orange-400",
    badge: "bg-orange-500/10",
  },
};

export default function GridPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [role] = useRole();
  const [pricingResult, setPricingResult] = useState({});
  const [customPrices, setCustomPrices] = useState({ gold: "", silver: "", bronze: "" });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: null, stall_code: "", zone: "bronze", category: "sembako", monthly_fee: 350000, row_x: 0, col_y: 0, isEdit: false });
  const [hoveredStall, setHoveredStall] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const queryClient = useQueryClient();

  const { data: stalls = [], isLoading } = useQuery({
    queryKey: ["adminStalls"],
    queryFn: () =>
      fetch("/api/admin/stalls").then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
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
      setShowModal(false);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/admin/stalls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStalls"] });
      setShowModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetch(`/api/admin/stalls?id=${id}`, {
        method: "DELETE",
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminStalls"] });
      setSelected(null);
    },
  });

  const dynamicPriceMutation = useMutation({
    mutationFn: ({ zone, custom_price }) =>
      fetch("/api/admin/stalls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apply_dynamic_pricing: true, zone, custom_price }),
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

  // Build grid structure
  const maxRow = stalls.length > 0 ? Math.max(...stalls.map(s => s.row_x)) : 1;
  const maxCol = stalls.length > 0 ? Math.max(...stalls.map(s => s.col_y)) : 1;

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
    const occupancyRate =
      zoneStalls.length > 0
        ? Math.round((occupied / zoneStalls.length) * 100)
        : 0;
    const currentFee = zoneStalls[0]?.monthly_fee || 0;
    const suggestedFee = zoneStalls[0]?.suggested_price || currentFee;
    
    // Fallback to automatically calculated suggested price if not explicitly customized
    const activePrice = customPrices[zone] ? parseInt(customPrices[zone]) : suggestedFee;
    const priceDiff = activePrice - currentFee;

    return {
      zone,
      total: zoneStalls.length,
      occupied,
      occupancyRate,
      currentFee,
      suggestedFee,
      activePrice,
      priceDiff,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Grid3X3 size={24} className="text-emerald-400" /> GIS & Grid Lapak
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Visualisasi dan manajemen lapak pasar berbasis grid spasial
          </p>
        </div>
        {role === "admin" && (
          <button
            onClick={() => {
              setForm({ id: null, stall_code: "", zone: "bronze", category: "sembako", monthly_fee: 350000, row_x: 0, col_y: 0, isEdit: false });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Tambah Lapak
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: "Total", val: stats.total, color: "text-white" },
          { label: "Terisi", val: stats.occupied, color: "text-green-400" },
          { label: "Kosong", val: stats.vacant, color: "text-gray-400" },
          { label: "Gold", val: stats.gold, color: "text-yellow-400" },
          { label: "Silver", val: stats.silver, color: "text-gray-300" },
          { label: "Bronze", val: stats.bronze, color: "text-orange-500" },
        ].map(({ label, val, color }) => (
          <div
            key={label}
            className="bg-[#1C1E27] border border-white/5 rounded-xl p-4 text-center"
          >
            <p className={twMerge("text-xl font-bold", color)}>{val}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "Semua" },
          { key: "occupied", label: "Terisi" },
          { key: "vacant", label: "Kosong" },
          { key: "gold", label: "Gold" },
          { key: "silver", label: "Silver" },
          { key: "bronze", label: "Bronze" },
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
        <div 
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-x-auto relative"
          onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        >
          <div className="flex gap-4 mb-6 text-[11px] text-gray-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-yellow-500/80" /> Zone Gold
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gray-500/80" /> Zone Silver
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-orange-700/80" /> Zone Bronze
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm border border-dashed border-gray-600 bg-black/20" /> Kosong
            </span>
          </div>

          <div className="min-w-max p-4 relative z-10 bg-black/20 rounded-xl border border-white/5 inline-block">
            {/* Grid Container */}
            <div 
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${maxCol}, minmax(80px, 80px))`,
                gridTemplateRows: `repeat(${maxRow}, minmax(80px, 80px))`
              }}
            >
              {stalls.map(s => {
                const isVacant = s.status === "vacant";
                const isSelected = selected?.id === s.id;
                const highlighted = filter === "all" || (filter === "vacant" && isVacant) || (filter === "occupied" && !isVacant) || (filter === s.zone);
                const zc = zoneColors[s.zone] || zoneColors.bronze;

                return (
                  <motion.button
                    key={s.id}
                    onMouseEnter={() => setHoveredStall(s)}
                    onMouseLeave={() => setHoveredStall(null)}
                    onClick={() => setSelected(s)}
                    whileHover={{ scale: 1.08, zIndex: 20 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{ gridRow: s.row_x, gridColumn: s.col_y }}
                    className={twMerge(
                      "relative rounded-xl border flex flex-col items-center justify-center transition-all duration-300",
                      !highlighted && "opacity-10 grayscale",
                      isVacant 
                        ? "bg-black/40 border-dashed border-gray-600 text-gray-500 hover:border-gray-400"
                        : `${zc.bg} border-transparent text-gray-900 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-lg`,
                      isSelected && `ring-4 ${zc.ring} scale-105 z-10`
                    )}
                  >
                    <span className="text-sm font-black tracking-tight">{s.stall_code?.slice(-3)}</span>
                    {!isVacant && (
                      <span className="text-[9px] font-bold mt-1 max-w-[90%] truncate opacity-80">
                        {s.trader_name?.split(' ')[0] || "Terisi"}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
          
          {/* Smart Tooltip Hover */}
          <AnimatePresence>
            {hoveredStall && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.15 }}
                className="fixed z-50 pointer-events-none bg-black/70 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl w-56"
                style={{ 
                  left: mousePos.x + 20, 
                  top: mousePos.y + 20,
                  transform: 'translate(0, 0)' // avoid cursor blocking
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white text-base">{hoveredStall.stall_code}</span>
                  <span className={twMerge("text-[10px] px-2 py-0.5 rounded font-bold uppercase", zoneColors[hoveredStall.zone]?.bg, "text-gray-900")}>
                    {hoveredStall.zone}
                  </span>
                </div>
                {hoveredStall.status === "occupied" ? (
                  <div className="space-y-1">
                    <p className="text-xs text-green-400 font-semibold flex items-center gap-1"><Users size={12}/> {hoveredStall.trader_name}</p>
                    <p className="text-[10px] text-gray-400 border-t border-white/10 pt-1 mt-1">Kat: {hoveredStall.category}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 italic">Lapak Kosong</p>
                    <p className="text-[10px] text-gray-500 border-t border-white/10 pt-1 mt-1">Sewa: Rp {Number(hoveredStall.monthly_fee).toLocaleString("id-ID")}/bln</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Legend / Detail Panel */}
      {selected && (
        <div className="bg-[#1C1E27] rounded-xl border border-white/10 p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-white text-base">
              Detail Lapak — {selected.stall_code}
            </h3>
            <button
              onClick={() => setSelected(null)}
              className="p-1 hover:bg-white/10 rounded-lg text-gray-400"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-5">
            {[
              { label: "Kode", val: selected.stall_code },
              {
                label: "Zone",
                val: zoneColors[selected.zone]?.label || selected.zone,
              },
              { label: "Kategori", val: selected.category },
              {
                label: "Status",
                val: selected.status === "occupied" ? "Terisi" : "Kosong",
              },
              {
                label: "Koordinat",
                val: `R${selected.row_x} / K${selected.col_y}`,
              },
              { label: "Pedagang", val: selected.trader_name || "—" },
              { label: "Telepon", val: selected.trader_phone || "—" },
              {
                label: "Sewa/Bulan",
                val: `Rp ${Number(selected.monthly_fee).toLocaleString("id-ID")}`,
              },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-white font-medium mt-0.5">{val}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            {selected.status === "occupied" && role === "admin" && (
              <button
                onClick={() =>
                  updateMutation.mutate({
                    id: selected.id,
                    status: "vacant",
                    trader_id: null,
                  })
                }
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Kosongkan Lapak
              </button>
            )}
            
            {role === "admin" && (
              <>
                <button
                  onClick={() => {
                    setForm({
                      id: selected.id,
                      stall_code: selected.stall_code,
                      zone: selected.zone,
                      category: selected.category,
                      monthly_fee: selected.monthly_fee,
                      row_x: selected.row_x,
                      col_y: selected.col_y,
                      isEdit: true
                    });
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-500/20 transition-colors flex items-center gap-1.5"
                >
                  <Edit2 size={13} /> Edit
                </button>

                {selected.status === "vacant" && (
                  <button
                    onClick={() => {
                      if (confirm("Apakah Anda yakin ingin menghapus lapak ini?")) {
                        deleteMutation.mutate(selected.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 size={13} /> {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                  </button>
                )}
              </>
            )}

            <a
              href="/admin/traders"
              className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Users size={13} /> Kelola Pedagang
            </a>
          </div>
        </div>
      )}

      {/* ── Dynamic Pricing Engine ──────────────────────────────────────── */}
      <div className="bg-[#1C1E27] rounded-xl border border-white/5 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" /> Dynamic Pricing
              Engine
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Harga lapak disesuaikan otomatis berdasarkan tingkat hunian zona.
              Makin tinggi hunian → makin tinggi harga.
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
            <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
              ⚡ Engine Aktif
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zoneData.map(
            ({
              zone,
              total,
              occupied,
              occupancyRate,
              currentFee,
              suggestedFee,
              priceDiff,
            }) => {
              const pi = zonePricingInfo[zone] || zonePricingInfo.silver;
              const zc = zoneColors[zone] || zoneColors.silver;
              const result = pricingResult[zone];
              const isPending = dynamicPriceMutation.isPending;
              const priceUp = priceDiff > 0;
              const priceDown = priceDiff < 0;
              return (
                <div
                  key={zone}
                  className={twMerge(
                    "rounded-xl border p-5 space-y-4",
                    pi.accent,
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={twMerge("w-3 h-3 rounded-full", zc.bg)} />
                      <span className={twMerge("text-sm font-bold", pi.text)}>
                        {zc.label}
                      </span>
                    </div>
                    <span
                      className={twMerge(
                        "text-[10px] font-bold px-2 py-1 rounded-full",
                        pi.badge,
                        pi.text,
                      )}
                    >
                      {occupancyRate}% Hunian
                    </span>
                  </div>
                  <div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={twMerge(
                          "h-full rounded-full transition-all",
                          zc.bg,
                        )}
                        style={{ width: `${occupancyRate}%`, opacity: 0.8 }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {occupied} / {total} lapak terisi
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Harga Saat Ini</span>
                      <span className="text-white font-medium">
                        Rp {Number(currentFee).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Harga Disarankan</span>
                      {role === "admin" ? (
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded px-2 py-0.5">
                          <span className="text-[10px] text-gray-500 font-bold">Rp</span>
                          <input
                            type="text"
                            value={customPrices[zone] !== undefined && customPrices[zone] !== "" ? customPrices[zone] : suggestedFee}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setCustomPrices(prev => ({ ...prev, [zone]: val }));
                            }}
                            placeholder={suggestedFee.toString()}
                            className="bg-transparent text-white font-bold text-xs w-20 outline-none text-right placeholder-gray-500"
                          />
                        </div>
                      ) : (
                        <span
                          className={twMerge(
                            "font-bold",
                            priceUp
                              ? "text-green-400"
                              : priceDown
                                ? "text-red-400"
                                : "text-gray-400",
                          )}
                        >
                          Rp {Number(suggestedFee).toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>
                    {priceDiff !== 0 && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        {priceUp ? (
                          <TrendingUp size={12} className="text-green-400" />
                        ) : (
                          <TrendingDown size={12} className="text-red-400" />
                        )}
                        <span
                          className={
                            priceUp ? "text-green-400" : "text-red-400"
                          }
                        >
                          {priceUp ? "+" : ""}Rp{" "}
                          {Math.abs(priceDiff).toLocaleString("id-ID")} (
                          {priceUp ? "+" : ""}
                          {Math.round((priceDiff / (currentFee || 1)) * 100)}%)
                        </span>
                      </div>
                    )}
                  </div>
                  {result && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-green-400 font-semibold">
                        ✅ Diterapkan!
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {result.updated} lapak · Rp{" "}
                        {Number(result.new_price).toLocaleString("id-ID")} ·
                        Hunian {result.occupancy_rate}%
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (role === "petugas") return;
                      dynamicPriceMutation.mutate({ zone, custom_price: activePrice });
                    }}
                    disabled={isPending || role === "petugas"}
                    className={twMerge(
                      "w-full py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5",
                      role === "petugas"
                        ? "bg-white/5 text-gray-500 border-white/10 cursor-not-allowed"
                        : priceDiff !== 0
                          ? `${pi.badge} ${pi.text} border-current hover:opacity-80`
                          : "bg-white/5 text-gray-500 border-white/10 cursor-default",
                    )}
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={13} /> Menerapkan...
                      </>
                    ) : role === "petugas" ? (
                      "Hanya Admin"
                    ) : priceDiff === 0 ? (
                      "✓ Sudah Optimal"
                    ) : (
                      <>
                        <Zap size={13} /> Terapkan Harga Baru
                      </>
                    )}
                  </button>
                </div>
              );
            },
          )}
        </div>
        <div className="mt-4 bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3 text-xs text-gray-500 leading-relaxed">
          💡 <strong className="text-gray-400">Cara kerja:</strong> Harga
          proporsional terhadap hunian zona. Batas: Gold (Rp 600rb–1.2jt),
          Silver (Rp 400rb–850rb), Bronze (Rp 280rb–600rb). Setiap perubahan
          dicatat ke Audit Log.
        </div>
      </div>

      {/* ── Modal Add / Edit Lapak ──────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1E27] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {form.isEdit ? "Edit Lapak" : "Tambah Lapak Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Kode Lapak</label>
                  <input
                    type="text"
                    value={form.stall_code}
                    onChange={(e) => setForm({ ...form, stall_code: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                    placeholder="Contoh: A-05"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Zona</label>
                  <select
                    value={form.zone}
                    onChange={(e) => {
                      const zone = e.target.value;
                      const defaultFee = zone === 'gold' ? 750000 : zone === 'silver' ? 500000 : 350000;
                      setForm({ ...form, zone, monthly_fee: defaultFee });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    <option value="gold" className="bg-[#1C1E27]">Gold</option>
                    <option value="silver" className="bg-[#1C1E27]">Silver</option>
                    <option value="bronze" className="bg-[#1C1E27]">Bronze</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    <option value="sembako" className="bg-[#1C1E27]">Sembako</option>
                    <option value="sayuran" className="bg-[#1C1E27]">Sayuran</option>
                    <option value="daging" className="bg-[#1C1E27]">Daging/Ikan</option>
                    <option value="pakaian" className="bg-[#1C1E27]">Pakaian</option>
                    <option value="bumbu" className="bg-[#1C1E27]">Bumbu Dapur</option>
                    <option value="jasa" className="bg-[#1C1E27]">Jasa / Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Sewa Bulanan (Rp)</label>
                  <input
                    type="number"
                    value={form.monthly_fee}
                    onChange={(e) => setForm({ ...form, monthly_fee: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Posisi Baris (Row X)</label>
                  <input
                    type="number"
                    value={form.row_x}
                    onChange={(e) => setForm({ ...form, row_x: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Posisi Kolom (Col Y)</label>
                  <input
                    type="number"
                    value={form.col_y}
                    onChange={(e) => setForm({ ...form, col_y: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                    min="0"
                  />
                </div>
              </div>

              <p className="text-[10px] text-gray-500 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                💡 <strong className="text-gray-400">Panduan Grid:</strong> Row 0-2 biasanya area Gold, Row 3-4 Silver, Row 5-6 Bronze. Pastikan kombinasi Row & Col tidak bertumpuk dengan lapak lain.
              </p>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (form.isEdit) {
                    updateMutation.mutate({
                      id: form.id,
                      stall_code: form.stall_code,
                      zone: form.zone,
                      category: form.category,
                      monthly_fee: form.monthly_fee,
                      row_x: form.row_x,
                      col_y: form.col_y,
                    });
                  } else {
                    createMutation.mutate(form);
                  }
                }}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={16} className="animate-spin" />}
                {form.isEdit ? "Simpan Perubahan" : "Buat Lapak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
