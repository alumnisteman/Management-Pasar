"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  KeyRound,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Check,
  ShieldCheck,
  UserCircle,
  AlertTriangle,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/utils/auth";

const ROLE_CFG = {
  admin:   { label: "Admin",   bg: "bg-blue-500/15",    text: "text-blue-400",    dot: "bg-blue-500",    border: "border-blue-500/30" },
  petugas: { label: "Petugas", bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-500", border: "border-emerald-500/30" },
};

function PasswordModal({ user, onClose, onSave, isSaving }) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const mismatch = confirm && pw !== confirm;
  const valid = pw.length >= 6 && pw === confirm;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1E27] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <KeyRound size={16} className="text-indigo-400" /> Reset Password
              </h3>
              <p className="text-xs text-gray-500 mt-1">{user.name} — {user.email}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-400">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password Baru</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white pr-9 focus:outline-none focus:border-indigo-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Konfirmasi Password</label>
              <input
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ulangi password"
                className={twMerge(
                  "w-full bg-[#0F1117] border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none",
                  mismatch ? "border-red-500/50 focus:border-red-500/50" : "border-white/10 focus:border-indigo-500/50",
                )}
              />
              {mismatch && <p className="text-[11px] text-red-400 mt-1">Password tidak sama</p>}
            </div>
          </div>

          {pw.length > 0 && pw.length < 6 && (
            <p className="text-[11px] text-yellow-400">Password minimal 6 karakter</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => valid && onSave(pw)}
              disabled={!valid || isSaving}
              className="flex-1 py-2 bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onSave, isSaving }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "petugas" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const valid = form.name && form.email && form.password.length >= 6 && form.role;

  async function handleSave() {
    setError("");
    const res = await onSave(form);
    if (res?.error) setError(res.error);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1E27] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Plus size={16} className="text-indigo-400" /> Tambah Pengguna
              </h3>
              <p className="text-xs text-gray-500 mt-1">Buat akun baru untuk Admin atau Petugas</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-400">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { key: "name",  label: "Nama Lengkap", type: "text",  placeholder: "cth. Budi Santoso" },
              { key: "email", label: "Email",         type: "email", placeholder: "email@svms.id" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 karakter"
                  className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white pr-9 focus:outline-none focus:border-indigo-500/50"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="petugas">Petugas</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors">
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!valid || isSaving}
              className="flex-1 py-2 bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
            >
              {isSaving ? "Menyimpan..." : "Buat Akun"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [resetTarget, setResetTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const queryClient = useQueryClient();
  const { user: me, loading, isAdmin } = useAuth();

  if (loading) return null;
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <KeyRound size={28} className="text-indigo-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg">Akses Dibatasi</p>
          <p className="text-gray-500 text-sm mt-1">Halaman ini hanya dapat diakses oleh Admin.</p>
        </div>
        <a href="/admin" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:bg-white/10 transition-colors">
          Kembali ke Dashboard
        </a>
      </div>
    );
  }

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => fetch("/api/admin/users").then((r) => r.json()),
  });

  const resetMutation = useMutation({
    mutationFn: ({ id, password }) =>
      fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setResetTarget(null);
    },
  });

  const addMutation = useMutation({
    mutationFn: (data) =>
      fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
        setShowAdd(false);
      }
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }).then((r) => r.json()),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
        setDeleteConfirm(null);
      }
    },
  });

  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {resetTarget && (
        <PasswordModal
          user={resetTarget}
          onClose={() => setResetTarget(null)}
          onSave={(pw) => resetMutation.mutate({ id: resetTarget.id, password: pw })}
          isSaving={resetMutation.isPending}
        />
      )}
      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onSave={(data) => addMutation.mutateAsync(data)}
          isSaving={addMutation.isPending}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <KeyRound size={24} className="text-indigo-400" /> Kelola Pengguna
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manajemen akun Admin dan Petugas sistem SVMS
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors"
        >
          <Plus size={16} /> Tambah Pengguna
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1C1E27] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center">
              <ShieldCheck size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{adminCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Akun Admin</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1C1E27] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <UserCircle size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.filter((u) => u.role === "petugas").length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Akun Petugas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1C1E27] rounded-xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Memuat data...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                {["Pengguna", "Email", "Role", "Aksi"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => {
                const rc = ROLE_CFG[u.role] || ROLE_CFG.petugas;
                const isMe = u.id === me?.id;
                const isLastAdmin = u.role === "admin" && adminCount <= 1;
                return (
                  <tr key={u.id} className={twMerge("transition-colors", isMe ? "bg-indigo-500/[0.04]" : "hover:bg-white/[0.02]")}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={twMerge(
                            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                            u.role === "admin" ? "bg-blue-600" : "bg-emerald-600",
                          )}
                        >
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white flex items-center gap-1.5">
                            {u.name}
                            {isMe && (
                              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-full font-semibold">
                                Saya
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">ID #{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-300 font-mono">{u.email}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={twMerge(
                          "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border",
                          rc.bg, rc.text, rc.border,
                        )}
                      >
                        <span className={twMerge("w-1.5 h-1.5 rounded-full", rc.dot)} />
                        {rc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setResetTarget(u)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound size={12} /> Reset Password
                        </button>
                        {!isLastAdmin && !isMe && (
                          <>
                            {deleteConfirm === u.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => deleteMutation.mutate(u.id)}
                                  disabled={deleteMutation.isPending}
                                  className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                  title="Konfirmasi hapus"
                                >
                                  <Check size={13} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(u.id)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-colors"
                                title="Hapus pengguna"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </>
                        )}
                        {isLastAdmin && (
                          <span className="text-[10px] text-gray-600 italic">Tidak dapat dihapus</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Info box */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs text-gray-500 leading-relaxed space-y-1">
        <p>🔐 <strong className="text-gray-400">Keamanan:</strong> Password tersimpan di database lokal (svms_db.json). Jangan bagikan akses ke pihak yang tidak berwenang.</p>
        <p>⚠️ Akun Admin terakhir tidak dapat dihapus. Anda tidak dapat menghapus akun yang sedang Anda gunakan.</p>
      </div>
    </div>
  );
}
