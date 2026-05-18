"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Star, Award, Plus, X, Phone, User, Bell, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";

const tierConfig = {
  platinum: {
    label: "Platinum",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    icon: "💎",
  },
  gold: {
    label: "Gold",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    icon: "🥇",
  },
  silver: {
    label: "Silver",
    color: "text-gray-300",
    bg: "bg-gray-500/10",
    icon: "🥈",
  },
  bronze: {
    label: "Bronze",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    icon: "🥉",
  },
  none: { label: "—", color: "text-gray-600", bg: "bg-gray-600/10", icon: "—" },
};

function AddPorterModal({ onClose, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    id_number: "",
    daily_target: 100000,
  });
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1E27] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-white">Daftarkan Kuli Panggul</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg text-gray-400"
            >
              <X size={18} />
            </button>
          </div>
          {[
            {
              key: "name",
              label: "Nama Lengkap",
              placeholder: "Nama kuli panggul",
            },
            {
              key: "phone",
              label: "No. WhatsApp",
              placeholder: "08xxxxxxxxxx",
            },
            {
              key: "id_number",
              label: "No. KTP / ID",
              placeholder: "No. KTP resmi",
            },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-[10px] text-gray-500 font-bold uppercase">
                {label}
              </label>
              <input
                value={form[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
                placeholder={placeholder}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          ))}
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase">
              Target Harian (Rp)
            </label>
            <input
              type="number"
              value={form.daily_target}
              onChange={(e) =>
                setForm((f) => ({ ...f, daily_target: e.target.value }))
              }
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={() => onSubmit(form)}
            disabled={!form.name || !form.phone || !form.id_number || isLoading}
            className="w-full py-2.5 bg-cyan-600 text-white text-sm font-semibold rounded-lg hover:bg-cyan-700 disabled:opacity-40 transition-colors"
          >
            {isLoading ? "Mendaftarkan..." : "Daftarkan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPorterPage() {
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();

  const { data: porters = [], isLoading } = useQuery({
    queryKey: ["allPorters"],
    queryFn: () =>
      fetch("/api/porters").then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    refetchInterval: 15000,
  });

  const { data: allJobs = [] } = useQuery({
    queryKey: ["allJobs"],
    queryFn: () => fetch("/api/jobs").then((r) => r.json()),
  });

  const { data: porterRequests = [] } = useQuery({
    queryKey: ["porterRequests"],
    queryFn: () => fetch("/api/admin/porter-requests").then((r) => r.json()),
    refetchInterval: 10000,
  });

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqForm, setReqForm] = useState({ trader_name: "", location_from: "", location_to: "", weight_category: "ringan", notes: "" });

  const { data: incentiveAll = [] } = useQuery({
    queryKey: ["incentiveAll"],
    queryFn: () => fetch("/api/incentives").then((r) => r.json()),
  });

  const addMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/porters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPorters"] });
      setShowAdd(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) =>
      fetch("/api/porters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      }).then((r) => r.json()),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allPorters"] }),
  });

  const createRequestMutation = useMutation({
    mutationFn: (data) => fetch("/api/admin/porter-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["porterRequests"] }); setShowRequestForm(false); setReqForm({ trader_name: "", location_from: "", location_to: "", weight_category: "ringan", notes: "" }); },
  });

  const updateRequestMutation = useMutation({
    mutationFn: (data) => fetch("/api/admin/porter-requests", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["porterRequests"] }),
  });

  const stats = {
    total: porters.length,
    available: porters.filter((p) => p.status === "available").length,
    active: porters.filter((p) => p.status === "active").length,
    avgRating:
      porters.length > 0
        ? (
            porters.reduce((s, p) => s + Number(p.rating || 5), 0) /
            porters.length
          ).toFixed(2)
        : "5.00",
  };

  const jobsToday = allJobs.filter(
    (j) =>
      j.status === "completed" &&
      new Date(j.created_at).toDateString() === new Date().toDateString(),
  );

  const statusMap = {
    available: {
      dot: "bg-green-500",
      label: "Tersedia",
      text: "text-green-400",
    },
    active: { dot: "bg-blue-500", label: "Bertugas", text: "text-blue-400" },
    off: { dot: "bg-gray-500", label: "Off", text: "text-gray-400" },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {showAdd && (
        <AddPorterModal
          onClose={() => setShowAdd(false)}
          onSubmit={addMutation.mutate}
          isLoading={addMutation.isPending}
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package size={24} className="text-cyan-400" /> Manajemen Kuli
            Panggul
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Monitoring dan registrasi personel kuli panggul resmi
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/porter"
            target="_blank"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Buka Portal Publik ↗
          </a>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
          >
            <Plus size={16} /> Daftarkan Kuli
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Personel", val: stats.total, color: "text-white" },
          { label: "Tersedia", val: stats.available, color: "text-green-400" },
          {
            label: "Sedang Bertugas",
            val: stats.active,
            color: "text-blue-400",
          },
          {
            label: "Rating Rata-rata",
            val: stats.avgRating,
            color: "text-yellow-400",
          },
        ].map(({ label, val, color }) => (
          <div
            key={label}
            className="bg-[#1C1E27] border border-white/5 rounded-xl p-5 text-center"
          >
            <p className={twMerge("text-2xl font-bold", color)}>{val}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Porter Table */}
      <div className="bg-[#1C1E27] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              {[
                "Personel",
                "Kontak",
                "Status",
                "Rating",
                "Job Selesai (Hari Ini)",
                "Insentif Minggu Ini",
                "Aksi",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-gray-500 text-sm"
                >
                  Memuat data...
                </td>
              </tr>
            ) : (
              porters.map((p) => {
                const sm = statusMap[p.status] || statusMap.off;
                const todayJobs = jobsToday.filter(
                  (j) => j.porter_id === p.id,
                ).length;
                const inc = incentiveAll.find((i) => i.porter_id === p.id);
                const tc = tierConfig[inc?.tier] || tierConfig.none;
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {p.id_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Phone size={11} /> {p.phone}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={twMerge(
                          "inline-flex items-center gap-1.5 text-[10px] font-semibold",
                        )}
                      >
                        <span
                          className={twMerge("w-2 h-2 rounded-full", sm.dot)}
                        />
                        <span className={sm.text}>{sm.label}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Star
                          size={12}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-sm font-medium text-white">
                          {Number(p.rating).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-white">
                        {todayJobs}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">job</span>
                    </td>
                    <td className="px-5 py-4">
                      {inc ? (
                        <span
                          className={twMerge(
                            "text-[10px] font-bold px-2 py-1 rounded-full",
                            tc.bg,
                            tc.color,
                          )}
                        >
                          {tc.icon} {tc.label}
                          {inc.bonus_amount > 0 &&
                            ` · Rp ${Number(inc.bonus_amount).toLocaleString("id-ID")}`}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">Belum ada</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        {p.status !== "available" && (
                          <button
                            onClick={() =>
                              updateMutation.mutate({
                                id: p.id,
                                status: "available",
                              })
                            }
                            className="text-[10px] text-green-400 border border-green-500/30 px-2 py-1 rounded-lg hover:bg-green-500/10 transition-colors"
                          >
                            Set Tersedia
                          </button>
                        )}
                        {p.status !== "off" && (
                          <button
                            onClick={() =>
                              updateMutation.mutate({ id: p.id, status: "off" })
                            }
                            className="text-[10px] text-gray-400 border border-gray-500/30 px-2 py-1 rounded-lg hover:bg-gray-500/10 transition-colors"
                          >
                            Off
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Porter Queue Panel */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Bell size={16} className="text-cyan-400" /> Antrian Request Porter
            {porterRequests.filter(r => r.status === "pending").length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {porterRequests.filter(r => r.status === "pending").length} baru
              </span>
            )}
          </h3>
          <button onClick={() => setShowRequestForm((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-600/20 transition-colors">
            <Plus size={13} /> Buat Request
          </button>
        </div>

        {showRequestForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-5 overflow-hidden">
            <div className="bg-black/30 rounded-xl border border-white/10 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Nama Pedagang</label>
                  <input value={reqForm.trader_name} onChange={(e) => setReqForm(f => ({ ...f, trader_name: e.target.value }))} placeholder="Nama pedagang..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Berat Muatan</label>
                  <select value={reqForm.weight_category} onChange={(e) => setReqForm(f => ({ ...f, weight_category: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500">
                    <option value="ringan" className="bg-[#13151f]">Ringan (&lt;10kg)</option>
                    <option value="sedang" className="bg-[#13151f]">Sedang (10-30kg)</option>
                    <option value="berat" className="bg-[#13151f]">Berat (&gt;30kg)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Dari</label>
                  <input value={reqForm.location_from} onChange={(e) => setReqForm(f => ({ ...f, location_from: e.target.value }))} placeholder="Lokasi asal..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Ke</label>
                  <input value={reqForm.location_to} onChange={(e) => setReqForm(f => ({ ...f, location_to: e.target.value }))} placeholder="Lokasi tujuan..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
              <button onClick={() => createRequestMutation.mutate(reqForm)} disabled={!reqForm.trader_name || !reqForm.location_from || !reqForm.location_to || createRequestMutation.isPending}
                className="w-full py-2 bg-cyan-600 text-white text-sm font-semibold rounded-lg hover:bg-cyan-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                {createRequestMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                {createRequestMutation.isPending ? "Mengirim..." : "Kirim Request"}
              </button>
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          {porterRequests.length === 0 ? (
            <p className="text-center text-sm text-gray-600 py-8">Belum ada request porter</p>
          ) : porterRequests.slice(0, 10).map((req) => (
            <div key={req.id} className={twMerge(
              "flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
              req.status === "pending" ? "bg-cyan-500/5 border-cyan-500/20" : req.status === "in_progress" ? "bg-blue-500/5 border-blue-500/20" : "bg-white/[0.02] border-white/5"
            )}>
              <div className="flex items-center gap-3">
                <div className={twMerge("w-2 h-2 rounded-full", req.status === "pending" ? "bg-yellow-400" : req.status === "in_progress" ? "bg-blue-400" : "bg-green-400")} />
                <div>
                  <p className="text-sm font-medium text-white">{req.trader_name} · {req.location_from} → {req.location_to}</p>
                  <p className="text-[10px] text-gray-500">{req.weight_category} · {req.status === "pending" ? "Menunggu" : req.status === "in_progress" ? "Sedang berjalan" : "Selesai"}</p>
                </div>
              </div>
              {req.status === "pending" && (
                <div className="flex gap-2">
                  <select onChange={(e) => updateRequestMutation.mutate({ id: req.id, status: "in_progress", porter_id: Number(e.target.value) })}
                    className="bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 text-xs rounded-lg px-2 py-1 focus:outline-none">
                    <option value="">Tugaskan ke...</option>
                    {porters.filter(p => p.status === "available").map(p => (
                      <option key={p.id} value={p.id} className="bg-[#13151f]">{p.name}</option>
                    ))}
                  </select>
                  <button onClick={() => updateRequestMutation.mutate({ id: req.id, status: "completed", porter_id: req.porter_id })}
                    className="text-[10px] text-green-400 border border-green-500/30 px-2 py-1 rounded-lg hover:bg-green-500/10">
                    <CheckCircle2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Active Jobs */}
      <div className="bg-[#1C1E27] rounded-xl border border-white/5 p-6">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Award size={16} className="text-cyan-400" /> Job Aktif & Selesai Hari
          Ini
        </h3>
        <div className="space-y-2">
          {allJobs
            .filter(
              (j) =>
                new Date(j.created_at).toDateString() ===
                new Date().toDateString(),
            )
            .slice(0, 10)
            .map((j) => {
              const porter = porters.find((p) => p.id === j.porter_id);
              return (
                <div
                  key={j.id}
                  className="flex items-center justify-between py-2.5 px-3 bg-white/[0.02] rounded-lg border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={twMerge(
                        "w-2 h-2 rounded-full",
                        j.status === "completed"
                          ? "bg-green-500"
                          : j.status === "in_progress"
                            ? "bg-blue-500"
                            : "bg-gray-500",
                      )}
                    />
                    <div>
                      <p className="text-sm text-white font-medium">
                        {j.location_from} → {j.location_to}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {porter?.name || `Porter #${j.porter_id}`} ·{" "}
                        {j.weight_category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      Rp {Number(j.fee).toLocaleString("id-ID")}
                    </p>
                    <p
                      className={twMerge(
                        "text-[10px]",
                        j.status === "completed"
                          ? "text-green-400"
                          : "text-blue-400",
                      )}
                    >
                      {j.status === "completed"
                        ? "Selesai"
                        : j.status === "in_progress"
                          ? "Berjalan"
                          : "Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          {allJobs.filter(
            (j) =>
              new Date(j.created_at).toDateString() ===
              new Date().toDateString(),
          ).length === 0 && (
            <p className="text-center text-sm text-gray-600 py-8">
              Belum ada job hari ini
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
