"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  QrCode,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const statusConfig = {
  active: {
    label: "Aktif",
    text: "text-green-400",
    bg: "bg-green-500/10",
    icon: CheckCircle2,
  },
  expired: {
    label: "Kadaluarsa",
    text: "text-red-400",
    bg: "bg-red-500/10",
    icon: AlertTriangle,
  },
  expiring: {
    label: "Hampir Habis",
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
    icon: Clock,
  },
};

function IssuePermitModal({ traders, onClose, onSubmit, isLoading }) {
  const defaultExpiry = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1),
  )
    .toISOString()
    .split("T")[0];
  const [form, setForm] = useState({
    trader_id: traders[0]?.id || "",
    expiry_date: defaultExpiry,
  });
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1E27] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-white">Terbitkan SIPTU Baru</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg text-gray-400"
            >
              <X size={18} />
            </button>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase">
              Pedagang
            </label>
            <select
              value={form.trader_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, trader_id: e.target.value }))
              }
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              {traders.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase">
              Tanggal Kedaluwarsa
            </label>
            <input
              type="date"
              value={form.expiry_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, expiry_date: e.target.value }))
              }
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <p className="text-[10px] text-gray-500 bg-orange-500/5 border border-orange-500/20 rounded-lg px-3 py-2">
            📄 Nomor SIPTU akan dibuat otomatis. QR Code verifikasi juga akan
            digenerate.
          </p>
          <button
            onClick={() => onSubmit(form)}
            disabled={!form.trader_id || isLoading}
            className="w-full py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-40 transition-colors"
          >
            {isLoading ? "Menerbitkan..." : "Terbitkan SIPTU"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QRVerifyPanel() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const check = async () => {
    if (!token) return;
    setChecking(true);
    const res = await fetch(
      `/api/admin/permits?token=${encodeURIComponent(token)}`,
    ).then((r) => r.json());
    setResult(res);
    setChecking(false);
  };

  return (
    <div className="bg-[#1C1E27] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
        <QrCode size={16} className="text-orange-400" /> Verifikasi QR SIPTU
      </h3>
      <div className="flex gap-2">
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Masukkan token QR..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={check}
          disabled={!token || checking}
          className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-40"
        >
          Cek
        </button>
      </div>
      {result && (
        <div
          className={twMerge(
            "rounded-lg p-4 border text-sm",
            result.valid
              ? "bg-green-500/10 border-green-500/30"
              : "bg-red-500/10 border-red-500/30",
          )}
        >
          {result.valid ? (
            <div className="space-y-1.5">
              <p className="font-semibold text-green-400 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> SIPTU Valid
              </p>
              <p className="text-gray-300">
                {result.permit?.trader_name} · {result.permit?.permit_number}
              </p>
              <p className="text-gray-400 text-xs">
                Lapak: {result.permit?.stall_code} · Berlaku s/d{" "}
                {result.permit?.expiry_date}
              </p>
            </div>
          ) : (
            <p className="text-red-400 font-semibold flex items-center gap-1.5">
              <AlertTriangle size={14} /> Token tidak valid atau tidak ditemukan
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function SiptuPage() {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showIssue, setShowIssue] = useState(false);
  const queryClient = useQueryClient();

  const { data: permits = [], isLoading } = useQuery({
    queryKey: ["adminPermits", filter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filter) params.set("status", filter);
      return fetch(`/api/admin/permits?${params}`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      });
    },
  });

  const { data: traders = [] } = useQuery({
    queryKey: ["adminTraders"],
    queryFn: () => fetch("/api/admin/traders").then((r) => r.json()),
  });

  const issueMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/admin/permits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPermits"] });
      setShowIssue(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/admin/permits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminPermits"] }),
  });

  const shown = permits.filter((p) => {
    if (!search) return true;
    return (
      p.trader_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.permit_number?.includes(search)
    );
  });

  const getPermitStatus = (p) => {
    if (p.status === "expired") return "expired";
    const daysLeft =
      (new Date(p.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysLeft <= 30) return "expiring";
    return "active";
  };

  const stats = { total: permits.length, active: 0, expired: 0, expiring: 0 };
  permits.forEach((p) => {
    stats[getPermitStatus(p)]++;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {showIssue && (
        <IssuePermitModal
          traders={traders}
          onClose={() => setShowIssue(false)}
          onSubmit={issueMutation.mutate}
          isLoading={issueMutation.isPending}
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText size={24} className="text-orange-400" /> Manajemen SIPTU
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Surat Izin Penggunaan Tempat Usaha Digital
          </p>
        </div>
        <button
          onClick={() => setShowIssue(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          <Plus size={16} /> Terbitkan SIPTU
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total SIPTU", val: stats.total, color: "text-white" },
          { label: "Aktif", val: stats.active, color: "text-green-400" },
          { label: "Kadaluarsa", val: stats.expired, color: "text-red-400" },
          {
            label: "Hampir Habis",
            val: stats.expiring,
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-40 flex items-center gap-2 bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama / nomor SIPTU..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="expired">Kadaluarsa</option>
            </select>
          </div>

          <div className="bg-[#1C1E27] rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "Pedagang",
                    "Nomor SIPTU",
                    "Masa Berlaku",
                    "Status",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider"
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
                      colSpan={5}
                      className="px-4 py-12 text-center text-gray-500 text-sm"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : (
                  shown.map((p) => {
                    const pStatus = getPermitStatus(p);
                    const sc = statusConfig[pStatus] || statusConfig.active;
                    const StatusIcon = sc.icon;
                    const daysLeft = Math.floor(
                      (new Date(p.expiry_date) - new Date()) /
                        (1000 * 60 * 60 * 24),
                    );
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-medium text-white">
                            {p.trader_name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {p.stall_code} · {p.zone}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-mono text-gray-300">
                            {p.permit_number}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-gray-300">
                            {p.expiry_date}
                          </p>
                          <p
                            className={twMerge(
                              "text-[10px] mt-0.5",
                              daysLeft < 0
                                ? "text-red-400"
                                : daysLeft <= 30
                                  ? "text-yellow-400"
                                  : "text-gray-500",
                            )}
                          >
                            {daysLeft < 0
                              ? `${Math.abs(daysLeft)}h lalu`
                              : daysLeft <= 30
                                ? `${daysLeft}h lagi`
                                : `${daysLeft}h lagi`}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={twMerge(
                              "inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full",
                              sc.bg,
                              sc.text,
                            )}
                          >
                            <StatusIcon size={11} /> {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {(pStatus === "expired" ||
                            pStatus === "expiring") && (
                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  id: p.id,
                                  status: "active",
                                  expiry_date: new Date(
                                    new Date().setFullYear(
                                      new Date().getFullYear() + 1,
                                    ),
                                  )
                                    .toISOString()
                                    .split("T")[0],
                                })
                              }
                              className="text-[10px] text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-lg hover:bg-orange-500/10 transition-colors font-semibold"
                            >
                              Perpanjang
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QR Verify */}
        <div>
          <QRVerifyPanel />
        </div>
      </div>
    </div>
  );
}
