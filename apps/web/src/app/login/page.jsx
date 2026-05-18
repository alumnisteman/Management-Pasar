"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useRole } from "@/app/useRole";
import { Shield, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, , login] = useRole();

  const redirectTo = searchParams.get("redirect") || "/admin";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal login");
      }

      login(data.token, data.user);
      navigate(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#16181F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Shield className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SVMS Enterprise</h1>
            <p className="text-sm text-gray-400 mt-1">Sistem Manajemen Pasar Terpadu</p>
          </div>

          {redirectTo !== "/admin" && (
            <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2">
              <ArrowRight size={14} className="text-blue-400 flex-shrink-0" />
              <p className="text-xs text-blue-300">
                Setelah login, Anda akan diarahkan ke <span className="font-semibold text-blue-200">{redirectTo.replace("/admin/", "").replace("/", "")}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Masukkan username Anda"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-center text-gray-500">
              SVMS Version 6.0 &copy; 2026<br/>Dinas Pengelolaan Pasar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
