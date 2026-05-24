import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, ChevronDown, ChevronUp, ArrowLeft, Mail, Phone, MessageSquare, Book, Settings, Users, Receipt, Map, Truck, BarChart } from "lucide-react";

const FAQS = [
  {
    kategori: "Akun & Login",
    items: [
      { q: "Bagaimana cara masuk ke sistem SVMS?", a: "Buka halaman Login dan masukkan email serta password yang diberikan oleh admin sistem. Jika belum memiliki akun, hubungi Dinas Pengelolaan Pasar setempat." },
      { q: "Saya lupa password, apa yang harus dilakukan?", a: "Hubungi administrator sistem Anda untuk reset password. Fitur reset password mandiri akan tersedia di pembaruan mendatang." },
      { q: "Apakah bisa login dari perangkat mobile?", a: "Ya, Sistem Manajemen Pasar Terpadu bersifat responsif dan dapat diakses dari smartphone, tablet, maupun komputer." },
    ]
  },
  {
    kategori: "Manajemen Pedagang",
    items: [
      { q: "Bagaimana cara menambah data pedagang baru?", a: "Masuk ke menu Data Pedagang → klik tombol Tambah Pedagang → isi formulir lengkap termasuk data KTP, foto, dan informasi kios. Klik Simpan untuk menyimpan data." },
      { q: "Bisakah data pedagang diubah setelah disimpan?", a: "Ya, klik ikon edit pada baris data pedagang yang ingin diubah. Setiap perubahan akan tercatat otomatis di Audit Log." },
      { q: "Bagaimana cara mencetak kartu pedagang?", a: "Buka detail pedagang → klik tombol Cetak Kartu di pojok kanan atas. Tersedia format PDF untuk dicetak." },
    ]
  },
  {
    kategori: "Tagihan & Pembayaran",
    items: [
      { q: "Bagaimana sistem tagihan dibuat secara otomatis?", a: "Tagihan retribusi dibuat otomatis setiap awal bulan berdasarkan data kios aktif. Admin dapat mengatur jadwal dan nominal tagihan di menu Pengaturan Tagihan." },
      { q: "Bagaimana mencatat pembayaran dari pedagang?", a: "Masuk ke Tagihan Digital → cari tagihan pedagang → klik Konfirmasi Pembayaran → masukkan metode dan bukti pembayaran." },
      { q: "Apakah bisa cetak kwitansi?", a: "Ya, setiap pembayaran yang dikonfirmasi dapat langsung dicetak atau dikirim sebagai kwitansi digital (PDF)." },
    ]
  },
  {
    kategori: "Peta & GIS",
    items: [
      { q: "Apa itu fitur Peta Kios GIS?", a: "Peta Kios GIS menampilkan denah pasar secara visual dalam grid interaktif. Setiap kios ditampilkan dengan kode warna status: hijau (aktif), kuning (kosong), merah (sengketa)." },
      { q: "Bagaimana memindah pedagang antar kios?", a: "Buka Peta GIS → klik kios asal → pilih Pindah Pedagang → klik kios tujuan yang kosong → konfirmasi perpindahan." },
    ]
  },
  {
    kategori: "Laporan",
    items: [
      { q: "Laporan apa saja yang tersedia?", a: "SVMS menyediakan: laporan pendapatan retribusi, laporan hunian kios, laporan tunggakan, laporan aktivitas porter, dan laporan komprehensif bulanan/tahunan." },
      { q: "Bagaimana cara mengunduh laporan?", a: "Masuk ke menu Laporan & Analitik → pilih jenis laporan dan periode → klik tombol Unduh PDF atau Export Excel." },
    ]
  },
];

export default function BantuanPage() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState({});

  const toggle = (key) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#0F172A", minHeight: "100vh", color: "white" }}>
      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,23,42,0.97)", borderBottom: "1px solid #1E293B", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px", height: "64px", display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1E293B", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "500" }}>
            <ArrowLeft style={{ width: "15px", height: "15px" }} /> Kembali
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ background: "#F59E0B", padding: "5px", borderRadius: "7px" }}>
              <Shield style={{ width: "18px", height: "18px", color: "#0F172A" }} />
            </div>
            <span style={{ fontWeight: "700", fontSize: "16px", color: "#F1F5F9" }}>Sistem Manajemen Pasar Terpadu</span>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 20px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "9999px", padding: "4px 14px", marginBottom: "16px" }}>
            <Book style={{ width: "14px", height: "14px", color: "#F59E0B" }} />
            <span style={{ fontSize: "13px", color: "#F59E0B", fontWeight: "600" }}>Pusat Bantuan</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "800", marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Ada yang bisa kami bantu?
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "16px", maxWidth: "500px", margin: "0 auto" }}>
            Temukan jawaban dari pertanyaan umum seputar penggunaan Sistem Manajemen Pasar Terpadu.
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "56px" }}>
          {[
            { icon: Users, label: "Pedagang", color: "#2563EB" },
            { icon: Receipt, label: "Tagihan", color: "#F59E0B" },
            { icon: Map, label: "Peta GIS", color: "#059669" },
            { icon: Truck, label: "Porter", color: "#7C3AED" },
            { icon: BarChart, label: "Laporan", color: "#E11D48" },
            { icon: Settings, label: "Pengaturan", color: "#64748B" },
          ].map(({ icon: Icon, label, color }) => (
            <button key={label} style={{ background: "rgba(30,41,59,0.5)", border: "1px solid #1E293B", borderRadius: "12px", padding: "16px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.background = "rgba(30,41,59,0.5)"; }}
            >
              <Icon style={{ width: "22px", height: "22px", color }} />
              <span style={{ fontSize: "13px", color: "#CBD5E1", fontWeight: "600" }}>{label}</span>
            </button>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "28px", color: "#F1F5F9" }}>
            Pertanyaan yang Sering Diajukan
          </h2>
          {FAQS.map((kat) => (
            <div key={kat.kategori} style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>{kat.kategori}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {kat.items.map((item, i) => {
                  const key = `${kat.kategori}-${i}`;
                  const open = openItems[key];
                  return (
                    <div key={i} style={{ background: "rgba(30,41,59,0.5)", border: `1px solid ${open ? "rgba(245,158,11,0.3)" : "#1E293B"}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s" }}>
                      <button
                        onClick={() => toggle(key)}
                        style={{ width: "100%", padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", textAlign: "left" }}
                      >
                        <span style={{ fontSize: "15px", fontWeight: "600", color: "#E2E8F0" }}>{item.q}</span>
                        {open
                          ? <ChevronUp style={{ width: "18px", height: "18px", color: "#F59E0B", flexShrink: 0 }} />
                          : <ChevronDown style={{ width: "18px", height: "18px", color: "#64748B", flexShrink: 0 }} />
                        }
                      </button>
                      {open && (
                        <div style={{ padding: "0 20px 16px", color: "#94A3B8", fontSize: "14px", lineHeight: "1.7", borderTop: "1px solid #1E293B" }}>
                          <div style={{ paddingTop: "14px" }}>{item.a}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ marginTop: "56px", background: "linear-gradient(135deg, #1E293B, #0F172A)", border: "1px solid rgba(71,85,105,0.5)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>Masih butuh bantuan?</h2>
          <p style={{ color: "#94A3B8", marginBottom: "28px" }}>Tim kami siap membantu Anda pada hari kerja pukul 08.00–17.00 WIB.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:support@svms.id" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", fontSize: "14px" }}>
              <Mail style={{ width: "16px", height: "16px" }} /> Email Support
            </a>
            <a href="tel:+62218001234" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", color: "white", fontWeight: "600", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", fontSize: "14px", border: "1px solid #334155" }}>
              <Phone style={{ width: "16px", height: "16px" }} /> (021) 800-1234
            </a>
          </div>
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #1E293B", padding: "24px 20px", textAlign: "center" }}>
        <p style={{ color: "#475569", fontSize: "13px" }}>© 2026 Sistem Manajemen Pasar Terpadu — Dinas Pengelolaan Pasar</p>
      </footer>
    </div>
  );
}
