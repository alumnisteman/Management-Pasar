"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  User,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle2,
  Package,
  ArrowRight,
  Plus,
  Phone,
  LayoutDashboard,
  Users,
  Star,
  Award,
  Gift,
  ChevronRight,
  X,
  Zap,
  Target,
  ThumbsUp,
  MessageSquare,
  Calendar,
  Wallet,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const tierConfig = {
  platinum: {
    label: "Platinum",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    dot: "bg-purple-500",
    icon: "💎",
  },
  gold: {
    label: "Gold",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    dot: "bg-yellow-500",
    icon: "🥇",
  },
  silver: {
    label: "Silver",
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    dot: "bg-gray-400",
    icon: "🥈",
  },
  bronze: {
    label: "Bronze",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-orange-500",
    icon: "🥉",
  },
  none: {
    label: "Belum",
    color: "text-gray-400",
    bg: "bg-gray-50",
    border: "border-gray-100",
    dot: "bg-gray-300",
    icon: "—",
  },
};

function StarRow({ value, max = 5, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < value
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

function InteractiveStars({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="focus:outline-none"
        >
          <Star
            size={28}
            className={
              (hover || value) >= s
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200 fill-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
}

// ─── UI Primitives ────────────────────────────────────────────────────────────

const Pill = ({ children, variant = "outline", dotColor, className }) => {
  const base =
    "rounded-full px-3 py-1 text-xs font-medium inline-flex items-center gap-1.5";
  const variants = {
    outline: "bg-white border border-gray-200 text-gray-700",
    soft: "bg-blue-50 text-blue-600",
    status: "bg-white border border-gray-200 text-gray-700",
  };
  return (
    <div className={twMerge(base, variants[variant], className)}>
      {dotColor && (
        <span className={twMerge("w-1.5 h-1.5 rounded-full", dotColor)} />
      )}
      {children}
    </div>
  );
};

const DataRing = ({ percentage }) => {
  const radius = 24;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percentage / 100) * circ;
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-100"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="text-orange-600 transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[10px] font-semibold text-gray-900">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

const ProgressBar = ({ value, max, colorClass = "bg-blue-600", label }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      {label && (
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>{label}</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={twMerge(
            "h-full rounded-full transition-all duration-500",
            colorClass,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const Card = ({ children, className, title, description, actions }) => (
  <div
    className={twMerge(
      "bg-white rounded-xl border border-gray-200 p-6 transition-colors duration-150",
      className,
    )}
  >
    {(title || actions) && (
      <div className="flex justify-between items-start mb-4">
        <div>
          {title && (
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions}
      </div>
    )}
    {children}
  </div>
);

// ─── Rating Modal ─────────────────────────────────────────────────────────────

function RatingModal({ job, onClose, onSubmit, isLoading }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ job_id: job.id, rating, feedback });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Beri Rating Pekerjaan
              </h3>
              <p className="text-sm text-gray-500">
                {job.customer_name || "Pelanggan"} → {job.location_to}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-col items-center py-4 gap-3">
            <InteractiveStars value={rating} onChange={setRating} />
            <p className="text-xs text-gray-400">
              {rating === 0
                ? "Klik bintang untuk memberi nilai"
                : rating === 1
                  ? "Sangat Buruk"
                  : rating === 2
                    ? "Kurang Memuaskan"
                    : rating === 3
                      ? "Cukup Baik"
                      : rating === 4
                        ? "Baik"
                        : "Sangat Memuaskan!"}
            </p>
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tulis komentar (opsional)..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 mt-2"
          />

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isLoading}
            className="w-full mt-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Menyimpan..." : "Kirim Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Assign Job Modal ─────────────────────────────────────────────────────────

function AssignJobModal({ porters, onClose, onSubmit, isLoading }) {
  const available = porters.filter((p) => p.status === "available");
  const [form, setForm] = useState({
    porter_id: available[0]?.id || "",
    customer_name: "",
    location_from: "Pintu Masuk Pasar",
    location_to: "",
    weight_category: "Medium",
    fee: "",
  });

  const feeMap = {
    Light: 10000,
    Medium: 15000,
    Heavy: 25000,
    "Extra Heavy": 40000,
  };

  const handleWtChange = (wt) =>
    setForm((f) => ({ ...f, weight_category: wt, fee: feeMap[wt] }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold text-gray-900">
              Input Order Baru
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              Pilih Kuli
            </label>
            <select
              value={form.porter_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, porter_id: e.target.value }))
              }
              className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {available.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              Nama Pelanggan
            </label>
            <input
              value={form.customer_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, customer_name: e.target.value }))
              }
              placeholder="Opsional"
              className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Dari
              </label>
              <input
                value={form.location_from}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location_from: e.target.value }))
                }
                className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Ke
              </label>
              <input
                value={form.location_to}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location_to: e.target.value }))
                }
                placeholder="Toko / Blok"
                className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              Kategori Berat
            </label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {["Light", "Medium", "Heavy", "Extra Heavy"].map((wt) => (
                <button
                  key={wt}
                  onClick={() => handleWtChange(wt)}
                  className={twMerge(
                    "py-2 text-[10px] font-semibold rounded-lg border transition-colors",
                    form.weight_category === wt
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
                  )}
                >
                  {wt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              Ongkos (Rp)
            </label>
            <input
              type="number"
              value={form.fee}
              onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))}
              className="w-full mt-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            onClick={() => onSubmit(form)}
            disabled={
              !form.porter_id || !form.location_to || !form.fee || isLoading
            }
            className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            {isLoading ? "Menyimpan..." : "Kirim Penugasan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PorterModulePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPorterId, setSelectedPorterId] = useState(1);
  const [ratingJob, setRatingJob] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const queryClient = useQueryClient();

  // ── Queries ──
  const { data: porter, isLoading: isLoadingPorter } = useQuery({
    queryKey: ["porter", selectedPorterId],
    queryFn: () =>
      fetch(`/api/porters?id=${selectedPorterId}`).then((r) => r.json()),
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs", selectedPorterId],
    queryFn: () =>
      fetch(`/api/jobs?porterId=${selectedPorterId}`).then((r) => r.json()),
    refetchInterval: 15000,
  });

  const { data: allPorters = [] } = useQuery({
    queryKey: ["allPorters"],
    queryFn: () => fetch("/api/porters").then((r) => r.json()),
    refetchInterval: 15000,
  });

  const { data: allJobs = [] } = useQuery({
    queryKey: ["allJobs"],
    queryFn: () => fetch("/api/jobs").then((r) => r.json()),
    enabled: activeTab === "management" || activeTab === "incentive",
  });

  const { data: incentiveData } = useQuery({
    queryKey: ["incentive", selectedPorterId],
    queryFn: () =>
      fetch(
        `/api/incentives?porterId=${selectedPorterId}&recalculate=true`,
      ).then((r) => r.json()),
    refetchInterval: 30000,
  });

  const { data: incentiveHistory = [] } = useQuery({
    queryKey: ["incentiveHistory", selectedPorterId],
    queryFn: () =>
      fetch(`/api/incentives?porterId=${selectedPorterId}`).then((r) =>
        r.json(),
      ),
  });

  const { data: myRatings = [] } = useQuery({
    queryKey: ["ratings", selectedPorterId],
    queryFn: () =>
      fetch(`/api/ratings?porterId=${selectedPorterId}`).then((r) => r.json()),
  });

  // ── Mutations ──
  const updateStatusMutation = useMutation({
    mutationFn: (status) =>
      fetch("/api/porters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedPorterId, status }),
      }).then((r) => r.json()),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["porter", selectedPorterId] }),
  });

  const completeJobMutation = useMutation({
    mutationFn: (jobId) =>
      fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId, status: "completed" }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", selectedPorterId] });
      queryClient.invalidateQueries({ queryKey: ["porter", selectedPorterId] });
      queryClient.invalidateQueries({ queryKey: ["allPorters"] });
      queryClient.invalidateQueries({
        queryKey: ["incentive", selectedPorterId],
      });
    },
  });

  const submitRatingMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ratings", selectedPorterId],
      });
      queryClient.invalidateQueries({ queryKey: ["porter", selectedPorterId] });
      queryClient.invalidateQueries({
        queryKey: ["incentive", selectedPorterId],
      });
      queryClient.invalidateQueries({ queryKey: ["jobs", selectedPorterId] });
      setRatingJob(null);
    },
  });

  const assignJobMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPorters"] });
      queryClient.invalidateQueries({ queryKey: ["allJobs"] });
      setShowAssignModal(false);
    },
  });

  const approveIncentiveMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/incentives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incentiveHistory", selectedPorterId],
      });
    },
  });

  // ── Computed ──
  const activeJob = useMemo(
    () =>
      jobs.find((j) => j.status === "in_progress" || j.status === "pending"),
    [jobs],
  );
  const completedToday = useMemo(
    () =>
      jobs.filter(
        (j) =>
          j.status === "completed" &&
          new Date(j.created_at).toDateString() === new Date().toDateString(),
      ),
    [jobs],
  );
  const rateableJobs = useMemo(
    () => jobs.filter((j) => j.status === "completed" && !j.rating),
    [jobs],
  );

  const dailyEarnings = porter?.daily_earnings || 0;
  const dailyTarget = porter?.daily_target || 100000;
  const earningsPct = Math.min(
    Math.round((dailyEarnings / dailyTarget) * 100),
    100,
  );

  const tier = incentiveData?.tier || "none";
  const tierInfo = tierConfig[tier];

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard Saya",
      icon: <LayoutDashboard size={15} />,
    },
    { id: "incentive", label: "Rating & Insentif", icon: <Award size={15} /> },
    { id: "management", label: "Manajemen Pasar", icon: <Users size={15} /> },
  ];

  if (isLoadingPorter)
    return <div className="p-8 text-gray-500 text-sm">Memuat modul...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Rating Modal */}
      {ratingJob && (
        <RatingModal
          job={ratingJob}
          onClose={() => setRatingJob(null)}
          onSubmit={submitRatingMutation.mutate}
          isLoading={submitRatingMutation.isPending}
        />
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <AssignJobModal
          porters={allPorters}
          onClose={() => setShowAssignModal(false)}
          onSubmit={assignJobMutation.mutate}
          isLoading={assignJobMutation.isPending}
        />
      )}

      {/* Header */}
      <div className="px-6 pt-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                Modul Kuli Panggul
              </h1>
              <p className="text-xs text-gray-500">
                Pasar Modern Management System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tier !== "none" && (
              <div
                className={twMerge(
                  "px-3 py-1 rounded-full text-xs font-semibold border",
                  tierInfo.bg,
                  tierInfo.color,
                  tierInfo.border,
                )}
              >
                {tierInfo.icon} {tierInfo.label}
              </div>
            )}
            <Pill
              variant="soft"
              className="cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <Phone size={12} /> Bantuan
            </Pill>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={twMerge(
                "pb-3 text-sm whitespace-nowrap transition-all duration-150 flex items-center gap-2",
                activeTab === t.id
                  ? "text-gray-900 font-semibold border-b-2 border-blue-600 -mb-[1px]"
                  : "text-gray-500 font-normal border-b-2 border-transparent hover:text-gray-700",
              )}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-[#F9FAFB] min-h-[calc(100vh-130px)]">
        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Top Row */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile & Status */}
              <Card
                className="flex-1"
                title={porter?.name}
                description={`ID: ${porter?.id_number} · ${porter?.phone}`}
              >
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { s: "available", dot: "bg-green-500", label: "Tersedia" },
                    { s: "off", dot: "bg-gray-400", label: "Istirahat" },
                  ].map(({ s, dot, label }) => (
                    <button
                      key={s}
                      onClick={() => updateStatusMutation.mutate(s)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <Pill
                        variant="status"
                        dotColor={dot}
                        className={twMerge(
                          "cursor-pointer hover:border-gray-400",
                          porter?.status === s &&
                            "border-blue-600 bg-blue-50 text-blue-700",
                        )}
                      >
                        {label}
                      </Pill>
                    </button>
                  ))}
                  {porter?.status === "active" && (
                    <Pill
                      variant="status"
                      dotColor="bg-blue-500"
                      className="border-blue-200"
                    >
                      Sedang Bertugas
                    </Pill>
                  )}
                </div>
              </Card>

              {/* Daily Earning Ring */}
              <Card className="w-full md:w-72">
                <div className="flex items-center gap-4">
                  <DataRing percentage={earningsPct} />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      Target Hari Ini
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      Rp {Number(dailyEarnings).toLocaleString("id-ID")}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      dari Rp {Number(dailyTarget).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Rating Card */}
              <Card className="w-full md:w-64">
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-2">
                  Rating Saya
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {Number(porter?.rating || 5).toFixed(1)}
                  </span>
                  <div>
                    <StarRow value={Math.round(porter?.rating || 5)} />
                    <p className="text-[10px] text-gray-400 mt-1">
                      {myRatings.length} ulasan
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Incentive Banner */}
            {incentiveData && (
              <div
                className={twMerge(
                  "rounded-xl border p-5 flex flex-col md:flex-row items-start md:items-center gap-5",
                  tierInfo.bg,
                  tierInfo.border,
                )}
              >
                <div className="text-4xl">{tierInfo.icon}</div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p
                      className={twMerge(
                        "text-sm font-semibold",
                        tierInfo.color,
                      )}
                    >
                      Insentif Minggu Ini · Tier {tierInfo.label}
                      {incentiveData.bonus > 0 && (
                        <span className="ml-2 text-green-600 font-bold">
                          +Rp{" "}
                          {Number(incentiveData.bonus).toLocaleString("id-ID")}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Performa {incentiveData.weekStart} s/d{" "}
                      {incentiveData.weekEnd}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <ProgressBar
                      label="Job Selesai"
                      value={incentiveData.progress?.jobs || 0}
                      max={50}
                      colorClass="bg-blue-500"
                    />
                    <ProgressBar
                      label="Rating Avg"
                      value={Number(
                        (incentiveData.avgRating || 0) * 20,
                      ).toFixed(0)}
                      max={100}
                      colorClass="bg-yellow-400"
                    />
                    <ProgressBar
                      label="Hari Hit Target"
                      value={incentiveData.progress?.daysHit || 0}
                      max={6}
                      colorClass="bg-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("incentive")}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
                >
                  Detail <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* Active Job + History */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Active Job */}
                <Card
                  title="Tugas Aktif"
                  description="Pekerjaan yang harus diselesaikan sekarang"
                >
                  {activeJob ? (
                    <div className="mt-4 border border-gray-100 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <Package size={20} className="text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {activeJob.customer_name || "Pelanggan Umum"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activeJob.weight_category} Weight
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold">
                          Rp {Number(activeJob.fee).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5 flex-1">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="truncate">
                            {activeJob.location_from}
                          </span>
                        </div>
                        <ArrowRight size={14} className="text-gray-300" />
                        <div className="flex items-center gap-1.5 flex-1">
                          <MapPin size={14} className="text-blue-500" />
                          <span className="truncate">
                            {activeJob.location_to}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => completeJobMutation.mutate(activeJob.id)}
                        disabled={completeJobMutation.isPending}
                        className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Selesaikan Pekerjaan
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 rounded-lg">
                      <Clock size={32} className="text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">
                        Belum ada tugas aktif
                      </p>
                      <p className="text-xs text-gray-400">
                        Silakan tunggu atau ambil tugas dari manajemen
                      </p>
                    </div>
                  )}
                </Card>

                {/* Rateable Jobs */}
                {rateableJobs.length > 0 && (
                  <Card
                    title="Menunggu Rating Pelanggan"
                    description="Job selesai yang belum mendapat penilaian"
                  >
                    <div className="mt-4 space-y-2">
                      {rateableJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between py-2.5 px-3 bg-yellow-50 border border-yellow-100 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {job.location_to}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              Rp {Number(job.fee).toLocaleString("id-ID")}
                            </p>
                          </div>
                          <button
                            onClick={() => setRatingJob(job)}
                            className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-1"
                          >
                            <Star size={12} /> Beri Rating
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Today's History */}
                <Card title="Riwayat Pekerjaan (Hari Ini)">
                  <div className="mt-4 divide-y divide-gray-100">
                    {completedToday.length > 0 ? (
                      completedToday.map((job) => (
                        <div
                          key={job.id}
                          className="py-3 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2
                              size={14}
                              className="text-green-500"
                            />
                            <div>
                              <p className="text-sm text-gray-700">
                                {job.location_to}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {new Date(job.created_at).toLocaleTimeString(
                                  "id-ID",
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {job.rating ? (
                              <StarRow value={job.rating} size={11} />
                            ) : (
                              <span className="text-[10px] text-gray-400">
                                Belum dirating
                              </span>
                            )}
                            <p className="text-sm font-medium">
                              Rp {Number(job.fee).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-8 text-center text-sm text-gray-400">
                        Belum ada riwayat hari ini
                      </p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <Card title="Statistik">
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Job Selesai Hari Ini
                      </span>
                      <span className="text-sm font-semibold">
                        {completedToday.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Rating Rata-rata
                      </span>
                      <Pill variant="outline" className="px-2 py-0.5">
                        <TrendingUp size={10} className="text-green-500" />{" "}
                        {Number(porter?.rating || 5).toFixed(2)}
                      </Pill>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Insentif Minggu Ini
                      </span>
                      <span
                        className={twMerge(
                          "text-xs font-semibold",
                          tierInfo.color,
                        )}
                      >
                        {tierInfo.icon}{" "}
                        {incentiveData?.bonus > 0
                          ? `Rp ${Number(incentiveData.bonus).toLocaleString("id-ID")}`
                          : "Belum"}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Tips Hari Ini
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed italic">
                        "Pastikan selalu tersenyum kepada pelanggan dan jaga
                        kebersihan seragam untuk rating maksimal."
                      </p>
                    </div>
                  </div>
                </Card>

                {/* QR Profile */}
                <div className="bg-blue-600 rounded-xl p-6 text-white overflow-hidden relative">
                  <div className="relative z-10">
                    <h4 className="font-semibold text-base mb-1">
                      QR Profil Saya
                    </h4>
                    <p className="text-blue-100 text-[10px] mb-4">
                      Tunjukkan QR ini ke pelanggan untuk logging pekerjaan
                      instan.
                    </p>
                    <div className="w-32 h-32 bg-white rounded-lg p-2 mx-auto">
                      <div className="w-full h-full bg-gray-900 grid grid-cols-4 grid-rows-4 gap-1 p-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className={twMerge(
                              "bg-white",
                              i % 3 === 0 || i % 7 === 0
                                ? "opacity-100"
                                : "opacity-20",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-20" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RATING & INCENTIVE TAB ── */}
        {activeTab === "incentive" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Porter Switcher */}
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-xs text-gray-500 font-medium">
                Lihat data personel:
              </p>
              {allPorters.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPorterId(p.id)}
                  className={twMerge(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
                    selectedPorterId === p.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Incentive Summary Card */}
            {incentiveData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        Insentif Minggu Ini
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {incentiveData.bonus > 0
                          ? `Rp ${Number(incentiveData.bonus).toLocaleString("id-ID")}`
                          : "Belum Memenuhi"}
                      </p>
                      <div
                        className={twMerge(
                          "inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold border",
                          tierInfo.bg,
                          tierInfo.color,
                          tierInfo.border,
                        )}
                      >
                        {tierInfo.icon} Tier {tierInfo.label}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <Gift size={22} className="text-purple-600" />
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Zap size={14} className="text-blue-500" /> Job Selesai
                      </span>
                      <span className="font-semibold">
                        {incentiveData.jobsCompleted} job
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Star size={14} className="text-yellow-500" /> Rating
                        Rata-rata
                      </span>
                      <span className="font-semibold">
                        {Number(incentiveData.avgRating || 0).toFixed(2)} / 5.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Target size={14} className="text-green-500" /> Hari Hit
                        Target
                      </span>
                      <span className="font-semibold">
                        {incentiveData.daysHitTarget} hari
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Wallet size={14} className="text-orange-500" /> Total
                        Pendapatan
                      </span>
                      <span className="font-semibold">
                        Rp{" "}
                        {Number(incentiveData.totalEarnings).toLocaleString(
                          "id-ID",
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      approveIncentiveMutation.mutate({
                        porter_id: selectedPorterId,
                        week_start: incentiveData.weekStart,
                        week_end: incentiveData.weekEnd,
                        jobs_completed: incentiveData.jobsCompleted,
                        avg_rating: incentiveData.avgRating,
                        total_earnings: incentiveData.totalEarnings,
                        days_hit_target: incentiveData.daysHitTarget,
                        tier: incentiveData.tier,
                        bonus_amount: incentiveData.bonus,
                      })
                    }
                    disabled={approveIncentiveMutation.isPending}
                    className="w-full mt-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} /> Setujui & Catat Insentif
                  </button>
                </Card>

                {/* Tier Guide */}
                <Card
                  title="Panduan Tier Insentif"
                  description="Kriteria penilaian performa mingguan"
                >
                  <div className="mt-4 space-y-3">
                    {[
                      {
                        tier: "platinum",
                        req: "50+ job · Rating ≥4.8 · 6+ hari hit target",
                        bonus: "Rp 150.000",
                      },
                      {
                        tier: "gold",
                        req: "30+ job · Rating ≥4.5 · 4+ hari hit target",
                        bonus: "Rp 100.000",
                      },
                      {
                        tier: "silver",
                        req: "15+ job · Rating ≥4.0 · 2+ hari hit target",
                        bonus: "Rp 60.000",
                      },
                      {
                        tier: "bronze",
                        req: "Minimal 2 kriteria terpenuhi sebagian",
                        bonus: "Rp 30.000",
                      },
                    ].map(({ tier: t, req, bonus }) => {
                      const tc = tierConfig[t];
                      return (
                        <div
                          key={t}
                          className={twMerge(
                            "flex items-start gap-3 p-3 rounded-lg border",
                            tc.bg,
                            tc.border,
                          )}
                        >
                          <span className="text-xl">{tc.icon}</span>
                          <div className="flex-1">
                            <p
                              className={twMerge("text-xs font-bold", tc.color)}
                            >
                              {tc.label} — {bonus}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {req}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}

            {/* Progress Detail */}
            {incentiveData?.progress && (
              <Card title="Progres Menuju Tier Berikutnya">
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5">
                        <Zap size={14} className="text-blue-500" />
                        Job Selesai
                      </span>
                      <span className="font-semibold text-gray-900">
                        {incentiveData.progress.jobs} /{" "}
                        {incentiveData.progress.jobsNextTier}
                      </span>
                    </div>
                    <ProgressBar
                      value={incentiveData.progress.jobs}
                      max={incentiveData.progress.jobsNextTier}
                      colorClass="bg-blue-500"
                    />
                    <p className="text-[10px] text-gray-400">
                      Target berikutnya: {incentiveData.progress.jobsNextTier}{" "}
                      job
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5">
                        <Star size={14} className="text-yellow-500" />
                        Rating Rata-rata
                      </span>
                      <span className="font-semibold text-gray-900">
                        {Number(incentiveData.progress.rating || 0).toFixed(2)}
                      </span>
                    </div>
                    <ProgressBar
                      value={Number((incentiveData.progress.rating || 0) * 20)}
                      max={Number(incentiveData.progress.ratingNextTier * 20)}
                      colorClass="bg-yellow-400"
                    />
                    <p className="text-[10px] text-gray-400">
                      Target berikutnya: {incentiveData.progress.ratingNextTier}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5">
                        <Target size={14} className="text-green-500" />
                        Hari Hit Target
                      </span>
                      <span className="font-semibold text-gray-900">
                        {incentiveData.progress.daysHit} /{" "}
                        {incentiveData.progress.daysNextTier}
                      </span>
                    </div>
                    <ProgressBar
                      value={incentiveData.progress.daysHit}
                      max={incentiveData.progress.daysNextTier}
                      colorClass="bg-green-500"
                    />
                    <p className="text-[10px] text-gray-400">
                      Target berikutnya: {incentiveData.progress.daysNextTier}{" "}
                      hari
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Rating Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                title="Ulasan Terbaru dari Pelanggan"
                description="20 rating terakhir yang diterima"
              >
                <div className="mt-4 space-y-3">
                  {myRatings.length > 0 ? (
                    myRatings.map((r) => (
                      <div
                        key={r.id}
                        className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="p-2 bg-white rounded-lg border border-gray-100 shrink-0">
                          <ThumbsUp size={16} className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {r.customer_name || "Pelanggan"}
                            </p>
                            <StarRow value={r.rating} size={11} />
                          </div>
                          {r.feedback && (
                            <p className="text-xs text-gray-500 mt-1 italic">
                              "{r.feedback}"
                            </p>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1">
                            {r.location_to} · Rp{" "}
                            {Number(r.fee).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center py-10">
                      <MessageSquare size={32} className="text-gray-200 mb-2" />
                      <p className="text-sm text-gray-400">Belum ada ulasan</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Incentive History */}
              <Card
                title="Riwayat Insentif"
                description="Rekap insentif minggu-minggu sebelumnya"
              >
                <div className="mt-4 space-y-3">
                  {incentiveHistory.length > 0 ? (
                    incentiveHistory.map((inc) => {
                      const tc = tierConfig[inc.tier] || tierConfig.none;
                      return (
                        <div
                          key={inc.id}
                          className={twMerge(
                            "flex items-center justify-between p-3 rounded-lg border",
                            tc.bg,
                            tc.border,
                          )}
                        >
                          <div>
                            <p
                              className={twMerge(
                                "text-xs font-bold flex items-center gap-1",
                                tc.color,
                              )}
                            >
                              {tc.icon} {tc.label}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {inc.week_start} s/d {inc.week_end}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {inc.jobs_completed} job · ⭐{" "}
                              {Number(inc.avg_rating).toFixed(1)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              Rp{" "}
                              {Number(inc.bonus_amount).toLocaleString("id-ID")}
                            </p>
                            <span
                              className={twMerge(
                                "text-[10px] px-2 py-0.5 rounded-full font-medium",
                                inc.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700",
                              )}
                            >
                              {inc.status === "paid"
                                ? "Sudah Dibayar"
                                : "Menunggu"}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center py-10">
                      <Calendar size={32} className="text-gray-200 mb-2" />
                      <p className="text-sm text-gray-400">
                        Belum ada riwayat insentif
                      </p>
                      <p className="text-xs text-gray-400">
                        Setujui insentif minggu ini untuk mulai mencatat
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── MANAGEMENT TAB ── */}
        {activeTab === "management" && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Monitoring Kuli Panggul
                </h2>
                <p className="text-sm text-gray-500">
                  Total {allPorters.length} personel terdaftar
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus size={16} /> Input Order
                </button>
              </div>
            </div>

            {/* Porter Table */}
            <Card className="p-0 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {[
                      "Nama / ID",
                      "Status",
                      "Rating",
                      "Pendapatan Hari Ini",
                      "Insentif Minggu Ini",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allPorters.map((p) => {
                    const statusMap = {
                      available: { dot: "bg-green-500", label: "Tersedia" },
                      active: { dot: "bg-blue-500", label: "Bertugas" },
                      off: { dot: "bg-gray-400", label: "Off" },
                    };
                    const sm = statusMap[p.status] || statusMap.off;
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User size={16} className="text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {p.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {p.id_number}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Pill variant="status" dotColor={sm.dot}>
                            {sm.label}
                          </Pill>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Star
                              size={12}
                              className="text-yellow-400 fill-yellow-400"
                            />
                            <span className="text-sm font-medium">
                              {Number(p.rating).toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            —
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-400">
                            Cek di Tab Insentif
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedPorterId(p.id);
                              setActiveTab("incentive");
                            }}
                            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                          >
                            Insentif <ChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Job Rating Queue */}
              <Card
                title="Antrian Rating Job"
                description="Job selesai yang perlu dinilai pelanggan"
                className="md:col-span-2"
              >
                <div className="mt-4 space-y-2">
                  {allJobs
                    .filter((j) => j.status === "completed" && !j.rating)
                    .slice(0, 8)
                    .map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-gray-100 rounded-md">
                            <Package size={14} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {job.customer_name || "Pelanggan"} →{" "}
                              {job.location_to}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              Kuli #{job.porter_id} · Rp{" "}
                              {Number(job.fee).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setRatingJob(job)}
                          className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex items-center gap-1"
                        >
                          <Star size={11} /> Nilai
                        </button>
                      </div>
                    ))}
                  {allJobs.filter((j) => j.status === "completed" && !j.rating)
                    .length === 0 && (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-sm text-gray-400">
                        Semua job sudah dirating ✓
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Info Panel */}
              <div className="space-y-6">
                <Card title="Logistik Pasar" description="Status sarana kuli">
                  <div className="mt-4 space-y-2">
                    {[
                      ["Troli Tersedia", "12 / 20"],
                      ["Seragam Bersih", "45 Unit"],
                      ["Lokasi Istirahat", "Buka"],
                    ].map(([label, val]) => (
                      <div
                        key={label}
                        className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0"
                      >
                        <span className="text-gray-600">{label}</span>
                        <span
                          className={twMerge(
                            "font-semibold",
                            val === "Buka" ? "text-green-500" : "text-gray-900",
                          )}
                        >
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card
                  title="Pengumuman"
                  className="bg-orange-50 border-orange-100"
                >
                  <div className="mt-4 space-y-3">
                    {[
                      "Waspada cuaca ekstrem hari ini. Gunakan sepatu anti-selip di area outdoor.",
                      "Pembagian insentif minggu ini akan dilakukan besok jam 10.00 di kantor manajemen.",
                    ].map((msg, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 shrink-0" />
                        <p className="text-xs text-orange-800 leading-relaxed">
                          {msg}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
