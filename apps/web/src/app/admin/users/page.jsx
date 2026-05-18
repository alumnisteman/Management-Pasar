"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRole } from "@/app/useRole";
import { UserCog, Plus, X, Search, Shield, User, Loader2, CheckCircle2, AlertTriangle, Key } from "lucide-react";
import { twMerge } from "tailwind-merge";

function UserModal({ onClose, onSubmit, initialData, isLoading }) {
  const [form, setForm] = useState(
    initialData || { name: "", username: "", password: "", role: "petugas" }
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1E27] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold text-white">
              {initialData ? "Edit Akun" : "Tambah Akun Baru"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg text-gray-400"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase">Nama Lengkap</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nama Pengguna"
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
              />
            </div>

            {!initialData && (
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase">Username</label>
                <input
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value.toLowerCase().replace(/\s/g, '') }))}
                  placeholder="username_unik"
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase">
                {initialData ? "Password Baru (Kosongkan jika tidak diubah)" : "Password"}
              </label>
              <input
                type="password"
                value={form.password || ""}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder={initialData ? "••••••••" : "Masukkan password"}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase">Role Akses</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { role: "admin", label: "Admin", color: "bg-blue-600 border-blue-500" },
                  { role: "kepala_pasar", label: "Kepala Pasar", color: "bg-amber-600 border-amber-500" },
                  { role: "operator", label: "Operator", color: "bg-emerald-600 border-emerald-500" },
                  { role: "auditor", label: "Auditor", color: "bg-violet-600 border-violet-500" },
                  { role: "pemda", label: "Pemda", color: "bg-sky-600 border-sky-500" },
                  { role: "petugas", label: "Petugas", color: "bg-orange-600 border-orange-500" },
                ].map(({ role: r, label, color }) => (
                  <button
                    key={r}
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className={twMerge(
                      "py-2 px-2 flex items-center justify-center gap-1 rounded-lg text-[10px] font-semibold border transition-colors",
                      form.role === r ? `${color} text-white` : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                    )}
                  >
                    {form.role === r ? <Shield size={11} /> : <User size={11} />}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            {initialData && (
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase">Status Akun</label>
                <div className="flex gap-2 mt-1">
                  {["active", "inactive"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={twMerge(
                        "flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors capitalize",
                        form.status === s
                          ? (s === "active" ? "bg-green-600 text-white border-green-500" : "bg-gray-600 text-white border-gray-500")
                          : "bg-white/5 text-gray-400 border-white/10"
                      )}
                    >
                      {s === "active" ? "Aktif" : "Nonaktif"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onSubmit(form)}
            disabled={!form.name || (!initialData && (!form.username || !form.password)) || isLoading}
            className="w-full py-2.5 bg-pink-600 text-white text-sm font-semibold rounded-lg hover:bg-pink-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Simpan Perubahan" : "Buat Akun Baru"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [role] = useRole();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => fetch("/api/admin/users").then(r => r.json()),
  });

  const addMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error);
        return json;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setModalOpen(false);
      setErrorMsg("");
    },
    onError: (err) => {
      setErrorMsg(err.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error);
        return json;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setModalOpen(false);
      setEditingUser(null);
      setErrorMsg("");
    },
    onError: (err) => {
      setErrorMsg(err.message);
    }
  });

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Shield size={64} className="text-red-500/50 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Akses Ditolak</h2>
        <p className="text-gray-400">Hanya Administrator yang dapat mengakses halaman ini.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    !search || 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {modalOpen && (
        <UserModal
          initialData={editingUser}
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
            setErrorMsg("");
          }}
          onSubmit={editingUser ? updateMutation.mutate : addMutation.mutate}
          isLoading={addMutation.isPending || updateMutation.isPending}
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCog size={24} className="text-pink-500" /> Manajemen Akun
          </h1>
          <p className="text-sm text-gray-400 mt-1">Kelola akses pengguna ke dalam sistem</p>
        </div>
        <button
          onClick={() => { setEditingUser(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
        >
          <Plus size={16} /> Akun Baru
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-sm text-red-400">
          <AlertTriangle size={16} /> {errorMsg}
        </div>
      )}

      {/* Filter */}
      <div className="flex-1 min-w-48 flex items-center gap-2 bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2 max-w-md">
        <Search size={15} className="text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau username..."
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-[#1C1E27] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pengguna</th>
              <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-500 text-sm">Memuat data...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-500 text-sm">Tidak ada pengguna ditemukan</td></tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={twMerge(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                        u.role === "admin" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                      )}>
                        {u.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{u.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={twMerge(
                      "inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full capitalize",
                      u.role === "admin" ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"
                    )}>
                      {u.role === "admin" ? <Shield size={10} /> : <User size={10} />} {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={twMerge(
                      "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider",
                      u.status === "active" ? "text-green-500" : "text-gray-500"
                    )}>
                      <span className={twMerge("w-1.5 h-1.5 rounded-full", u.status === "active" ? "bg-green-500" : "bg-gray-500")} />
                      {u.status === "active" ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => { setEditingUser(u); setModalOpen(true); }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
