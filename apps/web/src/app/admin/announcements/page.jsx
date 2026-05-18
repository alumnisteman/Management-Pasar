"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRole } from "@/app/useRole";
import { 
  Megaphone, 
  Plus, 
  Clock, 
  AlertTriangle, 
  Archive, 
  RefreshCcw, 
  Trash2, 
  Edit2, 
  X,
  Info,
  Calendar
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function AnnouncementsPage() {
  const [role] = useRole();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all"); // all, active, scheduled, darurat, expired
  const [showModal, setShowModal] = useState(false);
  
  const todayDate = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    id: null,
    title: "",
    body: "",
    urgency: "INFO",
    target_zone: "all",
    start_date: todayDate,
    end_date: "",
    isEdit: false
  });

  const { data: rawAnnouncements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => fetch("/api/admin/announcements").then((r) => r.json())
  });

  // Calculate status for each announcement
  const announcements = rawAnnouncements.map(a => {
    const now = new Date();
    const start = new Date(a.start_date);
    const end = a.end_date ? new Date(a.end_date) : null;
    
    let status = "active";
    if (now < start) status = "scheduled";
    else if (end && now > end) status = "expired";

    return { ...a, status };
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setShowModal(false);
      // Reload page to trigger layout badge updates (simple approach)
      window.location.reload();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => fetch("/api/admin/announcements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setShowModal(false);
      window.location.reload();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      window.location.reload();
    }
  });

  // KPI Calculations
  const stats = {
    total: announcements.length,
    active: announcements.filter(a => a.status === "active").length,
    scheduled: announcements.filter(a => a.status === "scheduled").length,
    darurat: announcements.filter(a => a.status === "active" && a.urgency === "DARURAT").length
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (filter === "all") return true;
    if (filter === "darurat") return a.urgency === "DARURAT";
    return a.status === filter;
  });

  const urgencyStyles = {
    INFO: { border: "border-blue-500", text: "text-blue-400", bg: "bg-blue-500/10", icon: Info },
    PENTING: { border: "border-orange-500", text: "text-orange-400", bg: "bg-orange-500/10", icon: Clock },
    DARURAT: { border: "border-red-500", text: "text-red-400", bg: "bg-red-500/10", icon: AlertTriangle }
  };

  const handleArchive = (id) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    updateMutation.mutate({ id, end_date: yesterday.toISOString() });
  };

  const handleRestore = (id) => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    updateMutation.mutate({ id, end_date: nextMonth.toISOString() });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Megaphone size={24} className="text-blue-400" /> Pusat Pengumuman
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Sebarkan informasi, peringatan, dan instruksi darurat ke seluruh pedagang
          </p>
        </div>
        {role === "admin" && (
          <button
            onClick={() => {
              setForm({ id: null, title: "", body: "", urgency: "INFO", target_zone: "all", start_date: todayDate, end_date: "", isEdit: false });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Buat Pengumuman
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", val: stats.total, color: "text-white" },
          { label: "✅ Aktif", val: stats.active, color: "text-green-400" },
          { label: "🕐 Terjadwal", val: stats.scheduled, color: "text-blue-400" },
          { label: "🚨 Darurat Aktif", val: stats.darurat, color: "text-red-400" }
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-[#1C1E27] border border-white/5 rounded-xl p-4 text-center">
            <p className={twMerge("text-2xl font-bold", color)}>{val}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "Semua" },
          { key: "active", label: "✅ Aktif" },
          { key: "scheduled", label: "🕐 Terjadwal" },
          { key: "darurat", label: "🚨 Darurat" },
          { key: "expired", label: "📁 Berakhir" }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={twMerge(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
              filter === key ? "bg-white text-gray-900 border-transparent" : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center p-10"><p className="text-gray-500">Memuat...</p></div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="bg-[#1C1E27] border border-white/5 rounded-xl p-10 text-center">
          <p className="text-gray-500">Tidak ada pengumuman yang sesuai filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((a) => {
            const style = urgencyStyles[a.urgency] || urgencyStyles.INFO;
            const Icon = style.icon;
            return (
              <div key={a.id} className={twMerge("bg-[#1C1E27] rounded-xl border border-white/5 overflow-hidden flex", style.border, "border-l-4")}>
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={twMerge("text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1", style.bg, style.text)}>
                      <Icon size={10} /> {a.urgency}
                    </span>
                    <span className={twMerge(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      a.status === 'active' ? "bg-green-500/10 text-green-400" :
                      a.status === 'scheduled' ? "bg-blue-500/10 text-blue-400" : "bg-gray-500/10 text-gray-400"
                    )}>
                      {a.status === 'active' ? "✅ AKTIF" : a.status === 'scheduled' ? "🕐 TERJADWAL" : "📁 BERAKHIR"}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-gray-400 uppercase">
                      🎯 {a.target_zone === 'all' ? 'SEMUA ZONA' : `ZONA ${a.target_zone}`}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{a.title}</h3>
                    <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{a.body}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={14} />
                    {new Date(a.start_date).toLocaleDateString('id-ID')} 
                    {" → "} 
                    {a.end_date ? new Date(a.end_date).toLocaleDateString('id-ID') : '∞ (Selamanya)'}
                  </div>
                </div>

                {/* Actions */}
                {role === "admin" && (
                  <div className="w-48 bg-black/20 p-4 flex flex-col gap-2 justify-center border-l border-white/5">
                    <button
                      onClick={() => {
                        setForm({
                          id: a.id,
                          title: a.title,
                          body: a.body,
                          urgency: a.urgency,
                          target_zone: a.target_zone,
                          start_date: a.start_date.split('T')[0],
                          end_date: a.end_date ? a.end_date.split('T')[0] : "",
                          isEdit: true
                        });
                        setShowModal(true);
                      }}
                      className="w-full px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 size={12} /> EDIT
                    </button>

                    {a.status === 'active' || a.status === 'scheduled' ? (
                      <button
                        onClick={() => handleArchive(a.id)}
                        className="w-full px-3 py-1.5 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Archive size={12} /> ARSIP
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(a.id)}
                        className="w-full px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RefreshCcw size={12} /> AKTIFKAN
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm("Hapus pengumuman secara permanen?")) {
                          deleteMutation.mutate(a.id);
                        }
                      }}
                      className="w-full px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={12} /> HAPUS
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Compose Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1E27] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-white">
                {form.isEdit ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-white rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                  placeholder="Contoh: Jadwal Pembersihan Pasar"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Isi Pesan</label>
                <textarea
                  required
                  rows={4}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none resize-none"
                  placeholder="Tuliskan instruksi atau informasi secara jelas..."
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold uppercase block mb-2">Tingkat Urgensi</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: "INFO", icon: Info, bg: "bg-blue-500/10", border: "border-blue-500", text: "text-blue-400" },
                    { val: "PENTING", icon: Clock, bg: "bg-orange-500/10", border: "border-orange-500", text: "text-orange-400" },
                    { val: "DARURAT", icon: AlertTriangle, bg: "bg-red-500/10", border: "border-red-500", text: "text-red-400" }
                  ].map(({ val, icon: Icon, bg, border, text }) => (
                    <button
                      key={val}
                      onClick={() => setForm({ ...form, urgency: val })}
                      className={twMerge(
                        "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
                        form.urgency === val ? `${bg} ${border}` : "border-white/5 bg-white/5 hover:border-white/20 text-gray-400"
                      )}
                    >
                      <Icon size={20} className={form.urgency === val ? text : ""} />
                      <span className={twMerge("text-xs font-bold", form.urgency === val ? text : "")}>{val}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Tanggal Berakhir (Opsional)</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Target Penerima</label>
                <select
                  value={form.target_zone}
                  onChange={(e) => setForm({ ...form, target_zone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                >
                  <option value="all" className="bg-[#1C1E27]">Semua Zona</option>
                  <option value="gold" className="bg-[#1C1E27]">Hanya Zona Gold</option>
                  <option value="silver" className="bg-[#1C1E27]">Hanya Zona Silver</option>
                  <option value="bronze" className="bg-[#1C1E27]">Hanya Zona Bronze</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex justify-end gap-3 shrink-0 bg-black/20">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-400">
                Batal
              </button>
              <button
                onClick={() => {
                  const payload = {
                    ...form,
                    start_date: form.start_date ? new Date(form.start_date).toISOString() : new Date().toISOString(),
                    end_date: form.end_date ? new Date(form.end_date).toISOString() : null
                  };
                  if (form.isEdit) {
                    updateMutation.mutate(payload);
                  } else {
                    createMutation.mutate(payload);
                  }
                }}
                disabled={!form.title || !form.body || createMutation.isPending || updateMutation.isPending}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
              >
                {form.isEdit ? "Simpan Perubahan" : "Terbitkan Pengumuman"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
