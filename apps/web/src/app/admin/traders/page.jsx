"use client";

import { useState } from "react";
import { useRole } from "@/app/useRole";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Plus,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Phone,
  Grid3X3,
  FileText,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const statusConfig = {
  active: {
    label: "Aktif",
    dot: "bg-green-500",
    text: "text-green-400",
    bg: "bg-green-500/10",
  },
  warning: {
    label: "Peringatan",
    dot: "bg-yellow-500",
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  inactive: {
    label: "Nonaktif",
    dot: "bg-gray-500",
    text: "text-gray-400",
    bg: "bg-gray-500/10",
  },
};

const permitStatusConfig = {
  active: { label: "Aktif", text: "text-green-400", bg: "bg-green-500/10" },
  expired: { label: "Kadaluarsa", text: "text-red-400", bg: "bg-red-500/10" },
  null: { label: "Belum Ada", text: "text-gray-400", bg: "bg-gray-500/10" },
};

function AddTraderModal({ stalls, onClose, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    name: "",
    nik: "",
    phone: "",
    trader_type: "tetap",
    stall_id: "",
  });
  const vacantStalls = stalls.filter((s) => s.status === "vacant");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1E27] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold text-white">
              Daftarkan Pedagang Baru
            </h3>
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
              placeholder: "Nama pedagang",
            },
            { key: "nik", label: "NIK", placeholder: "16 digit NIK" },
            {
              key: "phone",
              label: "Nomor WhatsApp",
              placeholder: "08xxxxxxxxxx",
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
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase">
              Tipe Pedagang
            </label>
            <div className="flex gap-2 mt-1">
              {["tetap", "musiman"].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm((f) => ({ ...f, trader_type: t }))}
                  className={twMerge(
                    "flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors capitalize",
                    form.trader_type === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white/5 text-gray-400 border-white/10",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase">
              Assign Lapak (Opsional)
            </label>
            <select
              value={form.stall_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, stall_id: e.target.value }))
              }
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="" className="bg-[#1C1E27] text-white">— Pilih Lapak —</option>
              {vacantStalls.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#1C1E27] text-white">
                  {s.stall_code} · {s.zone} · Rp{" "}
                  {Number(s.monthly_fee).toLocaleString("id-ID")}
                </option>
              ))}
            </select>
          </div>

          <p className="text-[10px] text-gray-500 bg-blue-500/5 border border-blue-500/20 rounded-lg px-3 py-2">
            💡 SIPTU akan diterbitkan secara otomatis setelah pedagang
            terdaftar.
          </p>

          <button
            onClick={() => onSubmit(form)}
            disabled={!form.name || !form.nik || isLoading}
            className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            {isLoading ? "Menyimpan..." : "Daftarkan Pedagang"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TradersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [role] = useRole();
  const queryClient = useQueryClient();

  const { data: traders = [], isLoading } = useQuery({
    queryKey: ["adminTraders", search, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      return fetch(`/api/admin/traders?${params}`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      });
    },
  });

  const { data: stalls = [] } = useQuery({
    queryKey: ["adminStalls"],
    queryFn: () => fetch("/api/admin/stalls").then((r) => r.json()),
  });

  const addMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/admin/traders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTraders"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setShowAdd(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/admin/traders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminTraders"] }),
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {showAdd && (
        <AddTraderModal
          stalls={stalls}
          onClose={() => setShowAdd(false)}
          onSubmit={addMutation.mutate}
          isLoading={addMutation.isPending}
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={24} className="text-violet-400" /> Data Pedagang
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {traders.length} pedagang ditemukan
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (!traders || traders.length === 0) return;
              const headers = ["ID", "Nama", "NIK", "No_HP", "Tipe", "Lapak", "Status"];
              const rows = traders.map(t => [
                t.id,
                `"${t.name}"`,
                `'${t.nik}'`,
                `'${t.phone}'`,
                t.trader_type,
                t.stall_code || "Belum Ada",
                t.status
              ]);
              const csvContent = "data:text/csv;charset=utf-8," 
                  + headers.join(",") + "\n" 
                  + rows.map(e => e.join(",")).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `Data_Pedagang_SMOS_${new Date().toISOString().slice(0,10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 bg-[#2C2D2F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#414243] transition-colors border border-white/10"
          >
            <FileText size={16} /> Export CSV
          </button>
          {role === "admin" && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> Daftarkan Baru
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48 flex items-center gap-2 bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2">
          <Search size={15} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIK, telepon..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="warning">Peringatan</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1C1E27] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              {["Pedagang", "Kontak", "Lapak", "SIPTU", "Status", ...(role === "admin" ? ["Aksi"] : [])].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-gray-500 text-sm"
                >
                  Memuat data...
                </td>
              </tr>
            ) : traders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-gray-500 text-sm"
                >
                  Tidak ada pedagang ditemukan
                </td>
              </tr>
            ) : (
              traders.map((t) => {
                const sc = statusConfig[t.status] || statusConfig.inactive;
                const pc =
                  permitStatusConfig[t.permit_status] ||
                  permitStatusConfig.null;
                return (
                  <tr
                    key={t.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm shrink-0">
                          {t.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {t.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {t.nik} · {t.trader_type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {t.phone ? (
                        <a 
                          href={`https://wa.me/62${t.phone.replace(/^0/, '')}?text=Halo%20Bapak/Ibu%20${encodeURIComponent(t.name)},%20ini%20dari%20Pengelola%20Pasar.`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 transition-colors"
                          title="Hubungi via WhatsApp"
                        >
                          <Phone size={12} /> {t.phone}
                        </a>
                      ) : (
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          <Phone size={12} /> —
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {t.stall_code ? (
                        <div>
                          <p className="text-sm font-mono text-white">
                            {t.stall_code}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {t.zone} · {t.category}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-600 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span
                            className={twMerge(
                              "text-[10px] font-semibold px-2 py-1 rounded-full",
                              pc.bg,
                              pc.text,
                            )}
                          >
                            {pc.label}
                          </span>
                          {t.permit_number && (
                            <p className="text-[10px] text-gray-600 mt-1 font-mono">
                              {t.permit_number}
                            </p>
                          )}
                        </div>
                        <button 
                          onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=SMOS-TRADER-${t.id}-${t.nik}`, '_blank')} 
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors" 
                          title="Lihat QR Code Pedagang"
                        >
                          <Grid3X3 size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={twMerge(
                          "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                          sc.bg,
                          sc.text,
                        )}
                      >
                        <span
                          className={twMerge(
                            "w-1.5 h-1.5 rounded-full",
                            sc.dot,
                          )}
                        />
                        {sc.label}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {t.status !== "warning" && (
                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  id: t.id,
                                  status: "warning",
                                })
                              }
                              className="p-1.5 hover:bg-yellow-500/10 text-yellow-500 rounded-lg transition-colors"
                              title="Beri Peringatan"
                            >
                              <AlertTriangle size={14} />
                            </button>
                          )}
                          {t.status === "warning" && (
                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  id: t.id,
                                  status: "active",
                                })
                              }
                              className="p-1.5 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"
                              title="Aktifkan"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              updateMutation.mutate({
                                id: t.id,
                                status: "inactive",
                              })
                            }
                            className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                            title="Nonaktifkan"
                          >
                            <UserX size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
