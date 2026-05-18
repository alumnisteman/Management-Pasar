import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  User, 
  FileText, 
  AlertTriangle, 
  Send, 
  Activity, 
  QrCode,
  ShieldCheck,
  CheckCircle,
  Wrench,
  Loader2
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function TenantPortalPage() {
  const [tradersList, setTradersList] = useState([]);
  const [selectedTraderId, setSelectedTraderId] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Complaint form state
  const [compCat, setCompCat] = useState("Kelistrikan");
  const [compDesc, setCompDesc] = useState("");
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  // Load all traders for simulated login dropdown
  const loadTraders = async () => {
    try {
      const res = await fetch("/api/admin/stall-map");
      const data = await res.json();
      if (!data.error && data.length > 0) {
        // Unique traders
        const traders = [];
        const seen = new Set();
        data.forEach(s => {
          if (s.trader && !seen.has(s.trader.id)) {
            seen.add(s.trader.id);
            traders.push(s.trader);
          }
        });
        setTradersList(traders);
        if (traders.length > 0) {
          setSelectedTraderId(traders[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading traders list", err);
    }
  };

  const fetchDashboard = async (traderId) => {
    if (!traderId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tenant/dashboard/${traderId}`);
      const data = await res.json();
      if (!data.error) {
        setDashboardData(data);
      } else {
        toast.error("Gagal mengambil data dashboard pedagang");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error menghubungkan ke server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTraders();
  }, []);

  useEffect(() => {
    if (selectedTraderId) {
      fetchDashboard(selectedTraderId);
    }
  }, [selectedTraderId]);

  const handlePay = async (billId) => {
    try {
      const res = await fetch("/api/tenant/pay-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bill_id: billId,
          trader_id: selectedTraderId
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Tagihan berhasil terbayar lunas!");
        fetchDashboard(selectedTraderId);
      } else {
        toast.error(data.error || "Gagal melakukan pembayaran");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error memproses pembayaran sewa");
    }
  };

  const handleComplaint = async (e) => {
    e.preventDefault();
    if (!compDesc.trim()) {
      toast.warning("Silakan tulis penjelasan keluhan kerusakan terlebih dahulu.");
      return;
    }

    setSubmittingComplaint(true);
    try {
      const res = await fetch("/api/tenant/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trader_id: selectedTraderId,
          category: compCat,
          description: compDesc
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Keluhan berhasil diteruskan ke Porter!");
        setCompDesc("");
        fetchDashboard(selectedTraderId);
      } else {
        toast.error("Gagal meneruskan keluhan.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error mengirim keluhan");
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const simulateTopup = () => {
    toast.success("Simulasi Top Up QRIS Dompet Cerdas berhasil ditambahkan Rp 200,000!");
    // Locally increment wallet balance to speed up testing experience
    if (dashboardData?.trader?.wallet) {
      setDashboardData(prev => ({
        ...prev,
        trader: {
          ...prev.trader,
          wallet: {
            ...prev.trader.wallet,
            balance: parseFloat(prev.trader.wallet.balance) + 200000
          }
        }
      }));
    }
  };

  const activePermit = dashboardData?.trader?.permits?.[0];

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-[#0d0f18] to-[#121422] border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-6 relative overflow-hidden min-h-[700px]">
      <Toaster position="top-right" richColors />
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-violet-600/20 blur-[60px] pointer-events-none z-0" />
      
      {/* Header Context Switcher */}
      <div className="bg-white/5 border border-white/5 p-4 rounded-2xl relative z-10 space-y-3">
        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
          Simulasi Akun Pedagang (Pilih Profil)
        </label>
        <select
          value={selectedTraderId}
          onChange={(e) => setSelectedTraderId(e.target.value)}
          className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-gray-200 focus:outline-none focus:border-violet-500"
        >
          {tradersList.map(t => (
            <option key={t.id} value={t.id}>
              👤 {t.name} (NIK: {t.nik?.substring(0, 8)}...)
            </option>
          ))}
        </select>
      </div>

      {loading && !dashboardData ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="animate-spin text-violet-500" size={32} />
          <p className="text-xs text-gray-500 mt-2">Menghubungkan ke Portal Pedagang...</p>
        </div>
      ) : dashboardData ? (
        <div className="space-y-6 animate-in fade-in duration-300 relative z-10">
          {/* Welcome Dashboard Profile card */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg">
              {dashboardData.trader.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Selamat Datang</p>
              <h2 className="text-base font-black text-white">{dashboardData.trader.name}</h2>
              <p className="text-[9px] text-gray-400 capitalize mt-0.5">Pedagang {dashboardData.trader.type} • Status: Aktif</p>
            </div>
          </div>

          {/* Wallet Balance widget */}
          <div className="bg-[#181a26] border border-white/5 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-[9px] text-gray-500 font-bold uppercase">Saldo Dompet SVMS</p>
              <p className="text-xl font-black text-emerald-400 mt-1">
                Rp {parseFloat(dashboardData.trader.wallet?.balance || 0).toLocaleString("id-ID")}
              </p>
            </div>
            <button
              onClick={simulateTopup}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-1.5 px-3 rounded-xl text-[10px] transition-colors"
            >
              ⚡ Top Up QRIS
            </button>
          </div>

          {/* Digital SIPTU Certificate */}
          {activePermit ? (
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-violet-950/40 border border-indigo-500/30 p-5 rounded-3xl relative overflow-hidden shadow-lg space-y-4">
              <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start border-b border-indigo-500/20 pb-3">
                <div>
                  <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded leading-none">
                    DOKUMEN RESMI SVMS
                  </span>
                  <h3 className="text-xs font-black text-white mt-1.5 uppercase tracking-wide">
                    Surat Izin Pemakaian Tempat Usaha (SIPTU)
                  </h3>
                </div>
                <ShieldCheck className="text-indigo-400" size={20} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div>
                  <span className="text-gray-500">Nomor Izin</span>
                  <p className="font-bold text-gray-200 mt-0.5">{activePermit.permit_number}</p>
                </div>
                <div>
                  <span className="text-gray-500">Kios Ditunjuk</span>
                  <p className="font-bold text-indigo-400 mt-0.5">Slot {activePermit.slot?.code || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tanggal Terbit</span>
                  <p className="font-bold text-gray-200 mt-0.5">{new Date(activePermit.issued_at).toLocaleDateString("id-ID")}</p>
                </div>
                <div>
                  <span className="text-gray-500">Masa Berlaku</span>
                  <p className="font-bold text-gray-200 mt-0.5">{new Date(activePermit.expires_at).toLocaleDateString("id-ID")}</p>
                </div>
              </div>

              <div className="border-t border-indigo-500/20 pt-3 flex items-center justify-between gap-3 text-[9px] text-gray-400">
                <div className="flex items-center gap-1">
                  <QrCode size={12} className="text-indigo-400" />
                  QR Validated Digital License
                </div>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">
                  Aktif
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/5 p-4 rounded-3xl text-center text-xs text-gray-500">
              Tidak ada Surat Izin SIPTU digital yang terdaftar.
            </div>
          )}

          {/* Active Invoices Widget */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              💳 Tagihan Sewa & Utilitas Aktif
            </h3>

            {dashboardData.unpaid_bills?.length === 0 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-2 text-emerald-300">
                <CheckCircle size={16} />
                <span className="text-[10px] font-bold">Hebat! Seluruh tagihan bulanan Anda lunas tanpa tunggakan.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {dashboardData.unpaid_bills?.map(bill => (
                  <div key={bill.id} className="bg-[#181a26] border border-red-500/20 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[9px] text-gray-500 font-bold">Jatuh Tempo: {new Date(bill.due_date).toLocaleDateString("id-ID")}</p>
                      <p className="text-xs font-black text-white mt-0.5">Tagihan Bulanan Cerdas</p>
                      <p className="text-sm font-black text-red-400 mt-1">Rp {parseFloat(bill.amount).toLocaleString("id-ID")}</p>
                    </div>
                    <button
                      onClick={() => handlePay(bill.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-xl text-[10px] transition-colors"
                    >
                      Bayar Instan
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Helpdesk Porter Sync Ticket Widget */}
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Wrench size={14} className="text-violet-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Lapor Kerusakan & Bantuan Porter
              </h3>
            </div>
            
            <form onSubmit={handleComplaint} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[8px] text-gray-500 font-bold uppercase">Kategori Masalah</label>
                <select
                  value={compCat}
                  onChange={(e) => setCompCat(e.target.value)}
                  className="w-full bg-[#181a26] border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] font-semibold text-gray-300 focus:outline-none focus:border-violet-500"
                >
                  <option value="Kelistrikan">Kelistrikan / Konsleting Kios</option>
                  <option value="Kebocoran Air">Kebocoran Air / Pipa Pecah</option>
                  <option value="Kebersihan/Sampah">Masalah Kebersihan & Penumpukan Sampah</option>
                  <option value="Struktural Kios">Kerusakan Bangunan / Rolling Door Macet</option>
                  <option value="Angkut Logistik">Butuh Kuli Panggul / Porter Logistik</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] text-gray-500 font-bold uppercase">Deskripsi Detail</label>
                <textarea
                  rows="2"
                  value={compDesc}
                  onChange={(e) => setCompDesc(e.target.value)}
                  placeholder="Jelaskan detail lokasi kerusakan atau bantuan angkutan barang yang Anda butuhkan..."
                  className="w-full bg-[#181a26] border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingComplaint}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-colors"
              >
                {submittingComplaint ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <><Send size={10} /> Kirim Pengaduan Cerdas</>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-20 text-center text-gray-500 text-xs">
          Silakan pilih pedagang di atas untuk memuat simulator portal mandiri.
        </div>
      )}
    </div>
  );
}
