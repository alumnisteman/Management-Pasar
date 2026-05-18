import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Shield, ArrowLeft, Megaphone, Clock, Tag,
  ChevronRight, Bell, Calendar, Info, AlertTriangle, CheckCircle2, X
} from "lucide-react";

const KATEGORI = ["Semua", "Operasional", "Retribusi", "Pengumuman", "Penting"];

const PENGUMUMAN = [
  {
    id: 1,
    judul: "Jadwal Pemeliharaan Sistem SVMS — Juni 2026",
    isi: "Akan dilakukan pemeliharaan sistem SVMS Enterprise pada Sabtu, 7 Juni 2026 pukul 22.00–02.00 WIB. Selama periode tersebut sistem tidak dapat diakses. Harap selesaikan transaksi sebelum waktu pemeliharaan. Mohon maaf atas ketidaknyamanan yang ditimbulkan.",
    kategori: "Operasional",
    tanggal: "15 Mei 2026",
    penting: false,
    icon: Info,
    warna: "#2563EB",
  },
  {
    id: 2,
    judul: "Kenaikan Tarif Retribusi Pasar Tahun 2026",
    isi: "Berdasarkan Peraturan Daerah No. 4 Tahun 2026, tarif retribusi kios pasar disesuaikan mulai 1 Juni 2026. Kios tipe A: Rp 15.000/hari, Kios tipe B: Rp 10.000/hari, Lapak terbuka: Rp 5.000/hari. Tagihan baru akan diterbitkan otomatis mulai 1 Juni 2026.",
    kategori: "Retribusi",
    tanggal: "10 Mei 2026",
    penting: true,
    icon: AlertTriangle,
    warna: "#F59E0B",
  },
  {
    id: 3,
    judul: "Jam Operasional Pasar Selama Libur Lebaran 2026",
    isi: "Pasar tetap beroperasi selama libur Lebaran 2026 dengan penyesuaian jam: 28 Mei–1 Juni 2026: 06.00–11.00 WIB. Pedagang yang berjualan diwajibkan melapor ke petugas jaga. Tagihan retribusi tetap berjalan normal selama periode ini.",
    kategori: "Operasional",
    tanggal: "8 Mei 2026",
    penting: false,
    icon: Clock,
    warna: "#059669",
  },
  {
    id: 4,
    judul: "Pendaftaran Ulang Pedagang — Batas Waktu 31 Mei 2026",
    isi: "Seluruh pedagang diwajibkan melakukan pendaftaran ulang untuk pembaruan data identitas dan kontrak sewa kios. Bawa KTP asli dan fotokopi, foto 3x4 terbaru, dan surat keterangan domisili. Pendaftaran dapat dilakukan di kantor UPTD Pasar setiap hari Senin–Jumat pukul 08.00–14.00 WIB.",
    kategori: "Pengumuman",
    tanggal: "5 Mei 2026",
    penting: true,
    icon: AlertTriangle,
    warna: "#E11D48",
  },
  {
    id: 5,
    judul: "Fitur Baru: Notifikasi Tagihan via WhatsApp",
    isi: "SVMS Enterprise kini mendukung pengiriman notifikasi tagihan retribusi langsung ke WhatsApp pedagang. Petugas dapat mengaktifkan fitur ini di menu Pengaturan Tagihan. Pastikan nomor WhatsApp pedagang sudah terdaftar dengan benar di sistem.",
    kategori: "Pengumuman",
    tanggal: "1 Mei 2026",
    penting: false,
    icon: Bell,
    warna: "#7C3AED",
  },
  {
    id: 6,
    judul: "Pembayaran Retribusi Bulan Mei 2026 Telah Dibuka",
    isi: "Tagihan retribusi bulan Mei 2026 telah diterbitkan dan dapat dibayarkan mulai 1 Mei 2026. Batas pembayaran tanpa denda: 15 Mei 2026. Pembayaran lewat batas akan dikenakan denda 2% per hari. Pembayaran dapat dilakukan di kantor UPTD Pasar atau melalui petugas keliling.",
    kategori: "Retribusi",
    tanggal: "1 Mei 2026",
    penting: false,
    icon: CheckCircle2,
    warna: "#059669",
  },
];

export default function PengumumanPage() {
  const navigate = useNavigate();
  const [aktifKategori, setAktifKategori] = useState("Semua");
  const [buka, setBuka] = useState(null);

  const filtered = aktifKategori === "Semua"
    ? PENGUMUMAN
    : PENGUMUMAN.filter(p => p.kategori === aktifKategori);

  const detail = buka ? PENGUMUMAN.find(p => p.id === buka) : null;

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#0F172A", minHeight: "100vh", color: "white" }}>

      {/* Detail Modal */}
      {detail && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setBuka(null); }}
        >
          <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "16px", width: "100%", maxWidth: "600px", overflow: "hidden", boxShadow: "0 32px 64px rgba(0,0,0,0.6)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: `${detail.warna}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <detail.icon style={{ width: "18px", height: "18px", color: detail.warna }} />
                </div>
                <span style={{ fontSize: "11px", color: detail.warna, fontWeight: "700", background: `${detail.warna}15`, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{detail.kategori}</span>
                {detail.penting && <span style={{ fontSize: "11px", color: "#E11D48", fontWeight: "700", background: "#E11D4815", padding: "2px 8px", borderRadius: "4px" }}>⚠ Penting</span>}
              </div>
              <button onClick={() => setBuka(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1E293B", borderRadius: "7px", padding: "5px", cursor: "pointer", color: "#64748B", display: "flex" }}>
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
            <div style={{ padding: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#F1F5F9", marginBottom: "12px", lineHeight: "1.4" }}>{detail.judul}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
                <Calendar style={{ width: "13px", height: "13px", color: "#475569" }} />
                <span style={{ fontSize: "12px", color: "#475569" }}>Diterbitkan {detail.tanggal}</span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "14px", lineHeight: "1.8" }}>{detail.isi}</p>
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#475569" }}>SVMS Enterprise — Dinas Pengelolaan Pasar</span>
              <button onClick={() => setBuka(null)} style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px" }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,23,42,0.97)", borderBottom: "1px solid #1E293B", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1E293B", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
              <ArrowLeft style={{ width: "15px", height: "15px" }} /> Kembali
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ background: "#F59E0B", padding: "5px", borderRadius: "7px" }}>
                <Shield style={{ width: "18px", height: "18px", color: "#0F172A" }} />
              </div>
              <span style={{ fontWeight: "700", fontSize: "16px", color: "#F1F5F9" }}>SVMS Enterprise</span>
            </div>
          </div>
          <button onClick={() => navigate("/login")} style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px" }}>
            Masuk ke Dashboard
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 20px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "9999px", padding: "4px 14px", marginBottom: "16px" }}>
            <Megaphone style={{ width: "14px", height: "14px", color: "#F59E0B" }} />
            <span style={{ fontSize: "13px", color: "#F59E0B", fontWeight: "600" }}>Pengumuman Resmi</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", marginBottom: "10px", letterSpacing: "-0.02em" }}>
            Pengumuman Pasar
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "15px" }}>
            Informasi resmi dari Dinas Pengelolaan Pasar — jadwal operasional, retribusi, dan pemberitahuan penting.
          </p>
        </div>

        {/* Pinned / Penting */}
        {PENGUMUMAN.filter(p => p.penting).length > 0 && (
          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <AlertTriangle style={{ width: "15px", height: "15px", color: "#E11D48" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#E11D48", textTransform: "uppercase", letterSpacing: "0.08em" }}>Pengumuman Penting</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {PENGUMUMAN.filter(p => p.penting).map(p => (
                <div
                  key={p.id}
                  onClick={() => setBuka(p.id)}
                  style={{ background: "rgba(225,29,72,0.06)", border: "1px solid rgba(225,29,72,0.25)", borderRadius: "12px", padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(225,29,72,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(225,29,72,0.06)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <AlertTriangle style={{ width: "18px", height: "18px", color: "#E11D48", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#F1F5F9", marginBottom: "3px" }}>{p.judul}</div>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>{p.tanggal} · {p.kategori}</div>
                    </div>
                  </div>
                  <ChevronRight style={{ width: "16px", height: "16px", color: "#E11D48", flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          {KATEGORI.map(k => (
            <button
              key={k}
              onClick={() => setAktifKategori(k)}
              style={{ padding: "7px 16px", borderRadius: "9999px", border: `1px solid ${aktifKategori === k ? "#F59E0B" : "#1E293B"}`, background: aktifKategori === k ? "rgba(245,158,11,0.15)" : "rgba(30,41,59,0.4)", color: aktifKategori === k ? "#F59E0B" : "#94A3B8", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
            >
              {k}
              {k !== "Semua" && (
                <span style={{ marginLeft: "6px", fontSize: "11px", opacity: 0.8 }}>
                  ({PENGUMUMAN.filter(p => p.kategori === k).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map(p => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => setBuka(p.id)}
                style={{ background: "rgba(30,41,59,0.4)", border: "1px solid #1E293B", borderRadius: "14px", padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "16px", transition: "border-color 0.2s, background 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = p.warna + "60"; e.currentTarget.style.background = "rgba(30,41,59,0.6)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.background = "rgba(30,41,59,0.4)"; }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "11px", background: `${p.warna}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${p.warna}25` }}>
                  <Icon style={{ width: "20px", height: "20px", color: p.warna }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", color: p.warna, fontWeight: "700", background: `${p.warna}15`, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{p.kategori}</span>
                    {p.penting && <span style={{ fontSize: "11px", color: "#E11D48", fontWeight: "600" }}>⚠ Penting</span>}
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#F1F5F9", marginBottom: "6px", lineHeight: "1.4" }}>{p.judul}</h3>
                  <p style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.6", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {p.isi}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px" }}>
                    <Calendar style={{ width: "12px", height: "12px", color: "#475569" }} />
                    <span style={{ fontSize: "12px", color: "#475569" }}>{p.tanggal}</span>
                  </div>
                </div>
                <ChevronRight style={{ width: "16px", height: "16px", color: "#334155", flexShrink: 0, marginTop: "4px" }} />
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#475569" }}>
              <Megaphone style={{ width: "40px", height: "40px", margin: "0 auto 12px", opacity: 0.3 }} />
              <p>Belum ada pengumuman untuk kategori ini.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ marginTop: "48px", background: "linear-gradient(135deg, #1E293B, #0F172A)", border: "1px solid rgba(71,85,105,0.4)", borderRadius: "16px", padding: "32px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "4px" }}>Akses Dashboard Lengkap</h3>
            <p style={{ color: "#64748B", fontSize: "13px" }}>Kelola pedagang, tagihan, dan laporan secara real-time.</p>
          </div>
          <button
            onClick={() => navigate("/login")}
            style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}
          >
            Masuk Sekarang <ChevronRight style={{ width: "16px", height: "16px" }} />
          </button>
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #1E293B", padding: "24px 20px", textAlign: "center" }}>
        <p style={{ color: "#475569", fontSize: "13px" }}>© 2026 SVMS Enterprise — Dinas Pengelolaan Pasar</p>
      </footer>
    </div>
  );
}
