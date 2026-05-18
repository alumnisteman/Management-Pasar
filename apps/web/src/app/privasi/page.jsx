import { useNavigate } from "react-router";
import { Shield, ArrowLeft, Lock, Eye, Database, Share2, Bell, UserCheck } from "lucide-react";

const SECTIONS = [
  {
    icon: Database,
    color: "#2563EB",
    title: "Data yang Kami Kumpulkan",
    content: `SVMS Enterprise mengumpulkan data yang diperlukan untuk operasional sistem manajemen pasar, meliputi:

• **Data Pengguna Sistem**: Nama, email, dan peran pengguna (admin/petugas) yang terdaftar oleh Dinas Pengelolaan Pasar.
• **Data Pedagang**: Identitas pedagang (nama, NIK, foto), data kios yang disewa, dan riwayat transaksi retribusi. Data ini diinput oleh petugas resmi dan merupakan data operasional Dinas.
• **Data Aktivitas Sistem**: Log aktivitas pengguna (siapa mengubah apa dan kapan) untuk keperluan audit internal dan transparansi.
• **Data Teknis**: Alamat IP, jenis perangkat, dan log akses untuk keamanan sistem.`
  },
  {
    icon: Eye,
    color: "#059669",
    title: "Bagaimana Data Digunakan",
    content: `Data yang dikumpulkan digunakan semata-mata untuk:

• Mengelola dan mengoperasikan sistem manajemen pasar tradisional.
• Menghasilkan laporan operasional, keuangan, dan analitik untuk kebutuhan Dinas.
• Mengirimkan tagihan dan notifikasi retribusi kepada pedagang terdaftar.
• Menjaga keamanan dan integritas sistem melalui audit log.
• Meningkatkan kualitas layanan dan fitur SVMS Enterprise.

Data **tidak digunakan** untuk keperluan komersial, iklan, atau dijual kepada pihak ketiga manapun.`
  },
  {
    icon: Share2,
    color: "#7C3AED",
    title: "Berbagi Data dengan Pihak Ketiga",
    content: `SVMS Enterprise **tidak menjual atau menyewakan** data kepada pihak ketiga. Data dapat dibagikan hanya dalam kondisi berikut:

• **Kewajiban Hukum**: Apabila diwajibkan oleh peraturan perundang-undangan atau perintah pengadilan yang sah.
• **Instansi Pemerintah**: Data agregat (tanpa identitas personal) dapat dilaporkan kepada instansi pemerintah terkait sesuai regulasi pengelolaan pasar.
• **Penyedia Infrastruktur**: Penyedia hosting dan server yang digunakan untuk menjalankan sistem, terikat perjanjian kerahasiaan data.`
  },
  {
    icon: Lock,
    color: "#F59E0B",
    title: "Keamanan Data",
    content: `Kami menerapkan standar keamanan untuk melindungi data Anda:

• **Enkripsi**: Password tersimpan dalam bentuk hash (tidak dapat dibaca balik). Koneksi menggunakan HTTPS/TLS.
• **Kontrol Akses**: Setiap pengguna hanya dapat mengakses data sesuai peran yang ditetapkan (RBAC — Role-Based Access Control).
• **Audit Log**: Setiap perubahan data dicatat lengkap untuk deteksi akses tidak sah.
• **Backup Rutin**: Data di-backup secara berkala untuk mencegah kehilangan data.

Meskipun kami berupaya maksimal, tidak ada sistem yang 100% aman. Segera laporkan jika menemukan indikasi pelanggaran keamanan.`
  },
  {
    icon: UserCheck,
    color: "#E11D48",
    title: "Hak Anda atas Data",
    content: `Sebagai pengguna sistem atau pedagang yang datanya tercatat, Anda berhak:

• **Mengakses** data yang kami miliki tentang Anda dengan menghubungi administrator sistem.
• **Koreksi** data yang tidak akurat atau tidak lengkap.
• **Penghapusan** data sesuai kebijakan retensi data instansi, tunduk pada kewajiban hukum yang berlaku.
• **Objeksi** terhadap pemrosesan data tertentu dengan menyampaikan keberatan kepada admin sistem.`
  },
  {
    icon: Bell,
    color: "#64748B",
    title: "Perubahan Kebijakan",
    content: `Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu untuk mencerminkan perubahan sistem atau regulasi. Perubahan signifikan akan diberitahukan melalui pengumuman di dalam sistem.

Kebijakan ini terakhir diperbarui pada **Januari 2026** dan berlaku untuk SVMS Enterprise versi 6.0 ke atas.

Dengan menggunakan sistem ini, Anda menyatakan telah membaca dan memahami kebijakan privasi ini.`
  },
];

export default function PrivasiPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#0F172A", minHeight: "100vh", color: "white" }}>
      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,23,42,0.97)", borderBottom: "1px solid #1E293B", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px", height: "64px", display: "flex", alignItems: "center", gap: "16px" }}>
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
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 20px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "9999px", padding: "4px 14px", marginBottom: "16px" }}>
            <Lock style={{ width: "14px", height: "14px", color: "#F59E0B" }} />
            <span style={{ fontSize: "13px", color: "#F59E0B", fontWeight: "600" }}>Kebijakan Privasi</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: "800", marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Kebijakan Privasi SVMS Enterprise
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "15px", lineHeight: "1.7", maxWidth: "650px" }}>
            Kami berkomitmen untuk melindungi privasi dan keamanan data seluruh pengguna sistem dan pedagang yang terdaftar dalam SVMS Enterprise. Halaman ini menjelaskan bagaimana data dikumpulkan, digunakan, dan dilindungi.
          </p>
          <div style={{ marginTop: "16px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#64748B" }}>Versi: 6.0</span>
            <span style={{ fontSize: "12px", color: "#64748B" }}>Berlaku sejak: 1 Januari 2026</span>
            <span style={{ fontSize: "12px", color: "#64748B" }}>Terakhir diperbarui: Januari 2026</span>
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {SECTIONS.map((sec, i) => {
            const Icon = sec.icon;
            const paragraphs = sec.content.split("\n\n");
            return (
              <div key={i} style={{ background: "rgba(30,41,59,0.4)", border: "1px solid #1E293B", borderRadius: "16px", padding: "28px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${sec.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: "20px", height: "20px", color: sec.color }} />
                  </div>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#F1F5F9" }}>{sec.title}</h2>
                </div>
                <div>
                  {paragraphs.map((p, j) => (
                    <p key={j} style={{ color: "#94A3B8", fontSize: "14px", lineHeight: "1.8", marginBottom: j < paragraphs.length - 1 ? "12px" : "0", whiteSpace: "pre-line" }}>
                      {p.split("**").map((part, k) =>
                        k % 2 === 1
                          ? <strong key={k} style={{ color: "#CBD5E1" }}>{part}</strong>
                          : part
                      )}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact */}
        <div style={{ marginTop: "40px", padding: "24px 28px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "14px" }}>
          <p style={{ color: "#CBD5E1", fontSize: "14px", lineHeight: "1.7" }}>
            <strong style={{ color: "#F59E0B" }}>Pertanyaan tentang privasi?</strong> Hubungi administrator sistem atau kirim email ke{" "}
            <a href="mailto:privacy@svms.id" style={{ color: "#F59E0B", textDecoration: "none" }}>privacy@svms.id</a>.
            Kami akan merespons dalam waktu 3 hari kerja.
          </p>
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #1E293B", padding: "24px 20px", textAlign: "center" }}>
        <p style={{ color: "#475569", fontSize: "13px" }}>© 2026 SVMS Enterprise — Dinas Pengelolaan Pasar</p>
      </footer>
    </div>
  );
}
