"use client";

import { useState, useCallback } from "react";
import { useRole } from "@/app/useRole";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Zap,
  FileDown,
  MessageCircle,
  Send,
  X,
  Loader2,
  Sheet,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const fmtRp = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

const MONTHS = (() => {
  const list = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    list.push(d.toISOString().slice(0, 7));
  }
  return list;
})();

// ── PDF Export hook ──────────────────────────────────────────────────────────
function useExportPDF() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportPDF = useCallback(async (type, month) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, month }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-${type}-${month || "export"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError("Gagal mengunduh PDF: " + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { exportPDF, loading, error };
}

// ── WA Blast Modal ───────────────────────────────────────────────────────────
function WABlastModal({ unpaidBills, month, onClose }) {
  const [selected, setSelected] = useState(unpaidBills.map((b) => b.id));
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const toggleAll = () =>
    setSelected(
      selected.length === unpaidBills.length
        ? []
        : unpaidBills.map((b) => b.id),
    );
  const toggle = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const send = async () => {
    setSending(true);
    const targets = unpaidBills
      .filter((b) => selected.includes(b.id))
      .map((b) => ({
        phone: b.phone,
        trader_name: b.trader_name,
        stall_code: b.stall_code,
        bill_month: b.bill_month,
        amount: b.amount,
      }));
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk_reminders", payload: { bills: targets } }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1C1E27] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <MessageCircle size={18} className="text-green-400" /> Blast
                Notifikasi WhatsApp
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {unpaidBills.length} tagihan belum bayar · Bulan {month}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg text-gray-400"
            >
              <X size={18} />
            </button>
          </div>

          {result ? (
            <div
              className={twMerge(
                "rounded-xl p-4 border text-sm",
                result.error
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-green-500/10 border-green-500/30",
              )}
            >
              {result.error ? (
                <p className="text-red-400">❌ {result.error}</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-green-400 font-semibold">
                    ✅ Pengiriman selesai
                  </p>
                  <p className="text-gray-300">
                    {result.message || "Pesan telah dijadwalkan untuk dikirim"}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Catatan: Pastikan WA_API_KEY sudah dikonfigurasi untuk
                    pengiriman nyata.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-xs text-gray-400 leading-relaxed">
                <p className="font-semibold text-green-400 mb-1">
                  Preview Pesan:
                </p>
                <p>
                  Yth. <strong>[Nama Pedagang]</strong>, tagihan sewa lapak
                  bulan <strong>{month}</strong> belum terbayar. Mohon segera
                  melakukan pembayaran. 🙏
                </p>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto">
                <div className="flex items-center justify-between text-xs text-gray-500 pb-1 border-b border-white/5">
                  <span>Pilih penerima</span>
                  <button
                    onClick={toggleAll}
                    className="text-blue-400 hover:underline"
                  >
                    {selected.length === unpaidBills.length
                      ? "Batal Semua"
                      : "Pilih Semua"}
                  </button>
                </div>
                {unpaidBills.map((b) => (
                  <label
                    key={b.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-white/5 px-2 py-1.5 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(b.id)}
                      onChange={() => toggle(b.id)}
                      className="accent-blue-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">
                        {b.trader_name}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {b.phone} · {b.stall_code} · {fmtRp(b.amount)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={send}
                disabled={!selected.length || sending}
                className="w-full py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Mengirim...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Kirim ke {selected.length} Pedagang
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [month, setMonth] = useState(MONTHS[0]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showWABlast, setShowWABlast] = useState(false);
  const [role] = useRole();
  const queryClient = useQueryClient();
  const { exportPDF, loading: pdfLoading } = useExportPDF();

  const { data: bills = [], isLoading } = useQuery({
    queryKey: ["adminBills", month, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (month) params.set("month", month);
      if (statusFilter) params.set("status", statusFilter);
      return fetch(`/api/admin/bills?${params}`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      });
    },
  });

  const payMutation = useMutation({
    mutationFn: ({ id, trader_name }) =>
      fetch("/api/admin/bills", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, trader_name }),
      }).then((r) => r.json()),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminBills"] }),
  });

  const generateMutation = useMutation({
    mutationFn: () =>
      fetch("/api/admin/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bill_month: month }),
      }).then((r) => r.json()),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminBills"] }),
  });

  const shown = bills.filter(
    (b) =>
      !search ||
      b.trader_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.stall_code?.includes(search),
  );
  const unpaidBills = bills.filter((b) => b.status === "unpaid" && b.phone);
  const totalCollected = bills
    .filter((b) => b.status === "paid")
    .reduce((s, b) => s + Number(b.amount), 0);
  const totalBilled = bills.reduce((s, b) => s + Number(b.amount), 0);
  const paidCount = bills.filter((b) => b.status === "paid").length;
  const unpaidCount = bills.filter((b) => b.status === "unpaid").length;
  const complianceRate =
    bills.length > 0 ? Math.round((paidCount / bills.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {showWABlast && (
        <WABlastModal
          unpaidBills={unpaidBills}
          month={month}
          onClose={() => setShowWABlast(false)}
        />
      )}

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard size={24} className="text-rose-400" /> Tagihan &
            Pembayaran
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Kelola tagihan sewa lapak bulanan pedagang
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => exportPDF("billing", month)}
            disabled={pdfLoading}
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {pdfLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileDown size={16} />
            )}{" "}
            Export PDF
          </button>
          <button
            onClick={() => { window.location.href = `/api/admin/export?type=billing&month=${month}`; }}
            className="flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600/20 transition-colors"
          >
            <FileDown size={16} /> Export Excel
          </button>
          {role === "admin" && (
            <>
              <button
                onClick={() => setShowWABlast(true)}
                disabled={!unpaidBills.length}
                className="flex items-center gap-2 bg-green-600/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600/20 transition-colors disabled:opacity-40"
              >
                <MessageCircle size={16} /> WA Blast ({unpaidBills.length})
              </button>
              <button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-60"
              >
                <Zap size={16} />{" "}
                {generateMutation.isPending ? "Generating..." : "Generate Tagihan"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Terkumpul",
            val: fmtRp(totalCollected),
            color: "text-green-400",
          },
          {
            label: "Total Ditagihkan",
            val: fmtRp(totalBilled),
            color: "text-white",
          },
          {
            label: "Compliance Rate",
            val: `${complianceRate}%`,
            color:
              complianceRate >= 80
                ? "text-green-400"
                : complianceRate >= 50
                  ? "text-yellow-400"
                  : "text-red-400",
          },
          {
            label: "Belum Bayar",
            val: `${unpaidCount} tagihan`,
            color: unpaidCount > 0 ? "text-red-400" : "text-green-400",
          },
        ].map(({ label, val, color }) => (
          <div
            key={label}
            className="bg-[#1C1E27] border border-white/5 rounded-xl p-5"
          >
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
              {label}
            </p>
            <p className={twMerge("text-xl font-bold mt-1", color)}>{val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        >
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="paid">Lunas</option>
          <option value="unpaid">Belum Bayar</option>
        </select>
        <div className="flex-1 min-w-40 flex items-center gap-2 bg-[#1C1E27] border border-white/10 rounded-lg px-3 py-2">
          <Search size={14} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pedagang..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1C1E27] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              {[
                "Pedagang",
                "Lapak",
                "Tagihan",
                "Nominal",
                "Status",
                ...(role === "admin" ? ["Aksi"] : []),
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
                  colSpan={6}
                  className="px-5 py-12 text-center text-gray-500 text-sm"
                >
                  Memuat data...
                </td>
              </tr>
            ) : shown.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm">
                  <div className="flex flex-col items-center gap-3">
                    <CreditCard size={32} className="text-gray-600" />
                    <p className="text-gray-500">
                      Belum ada tagihan untuk bulan ini
                    </p>
                    <button
                      onClick={() => generateMutation.mutate()}
                      className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Generate Tagihan Sekarang
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              shown.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">
                      {b.trader_name}
                    </p>
                    <p className="text-[10px] text-gray-500">{b.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-mono text-gray-300">
                      {b.stall_code || "—"}
                    </p>
                    <p className="text-[10px] text-gray-500">{b.zone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-gray-300">{b.bill_month}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-white">
                      {fmtRp(b.amount)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    {b.status === "paid" ? (
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                          <CheckCircle2 size={10} /> Lunas
                        </span>
                        {b.paid_at && (
                          <p className="text-[10px] text-gray-600 mt-1">
                            {new Date(b.paid_at).toLocaleDateString("id-ID")}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full bg-red-500/10 text-red-400">
                        <Clock size={10} /> Belum Bayar
                      </span>
                    )}
                  </td>
                  {role === "admin" && (
                    <td className="px-5 py-4">
                      {b.status === "unpaid" && (
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() =>
                              payMutation.mutate({
                                id: b.id,
                                trader_name: b.trader_name,
                              })
                            }
                            disabled={payMutation.isPending}
                            className="text-[10px] text-green-400 border border-green-500/30 px-2.5 py-1.5 rounded-lg hover:bg-green-500/10 transition-colors font-semibold flex items-center gap-1"
                          >
                            <CheckCircle2 size={11} /> Lunas
                          </button>
                          <button
                            onClick={async (e) => {
                              const btn = e.currentTarget;
                              const originalText = btn.innerHTML;
                              btn.innerHTML = "Mengirim...";
                              btn.disabled = true;
                              try {
                                await fetch("/api/admin/notifications", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ action: "send_bill_reminder", payload: b }),
                                });
                                btn.innerHTML = "Terkirim!";
                                setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
                              } catch(err) {
                                btn.innerHTML = "Gagal";
                                setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
                              }
                            }}
                            className="text-[10px] text-white bg-green-600 px-2.5 py-1.5 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-1 disabled:opacity-50"
                          >
                            <MessageCircle size={11} /> Kirim WA
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
