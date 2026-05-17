"use client";
import { useState } from "react";
import { setSession } from "@/utils/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }
      setSession(data);
      window.location.href = "/admin";
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl mb-3">
            S
          </div>
          <h1 className="text-xl font-bold text-white">SVMS v6.0</h1>
          <p className="text-xs text-gray-500 mt-1">Smart Market Operating System · Enterprise</p>
        </div>

        {/* Card */}
        <div className="bg-[#16181F] border border-white/5 rounded-2xl p-8">
          <h2 className="text-base font-semibold text-white mb-1">Masuk ke Sistem</h2>
          <p className="text-xs text-gray-500 mb-6">Gunakan akun yang telah diberikan admin</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@svms.id"
                required
                className="w-full bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        {/* Demo hint */}
        <div className="mt-4 bg-[#16181F] border border-white/5 rounded-xl px-4 py-3">
          <p className="text-[11px] text-gray-500 font-medium mb-2 uppercase tracking-wider">Akun Demo</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Admin</span>
              <span className="text-gray-500 font-mono">admin@svms.id · admin123</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Petugas</span>
              <span className="text-gray-500 font-mono">petugas@svms.id · petugas123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
