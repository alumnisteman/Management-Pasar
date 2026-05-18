import { useNavigate } from "react-router";
import { Shield, ArrowLeft, FileText, AlertTriangle, CheckCircle2, XCircle, Scale, Clock } from "lucide-react";

const SECTIONS = [
  {
    icon: CheckCircle2,
    color: "#22C55E",
    title: "1. Penerimaan Ketentuan",
    content: `Dengan mengakses dan menggunakan SVMS Enterprise ("Sistem"), Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan yang tercantum dalam dokumen ini.

Sistem ini hanya diperuntukkan bagi **instansi pemerintah resmi** yang mengelola pasar tradisional (Dinas Pengelolaan Pasar, UPTD Pasar, atau unit setara) dan personel yang ditugaskan oleh instansi tersebut.

Penggunaan sistem oleh pihak yang tidak berwenang merupakan pelanggaran dan dapat diproses sesuai ketentuan hukum yang berlaku.`
  },
  {
    icon: FileText,
    color: "#2563EB",
    title: "2. Hak Akses & Akun Pengguna",
    content: `**Pemberian Akses**: Akun pengguna diberikan oleh administrator sistem atas persetujuan pejabat berwenang instansi terkait.

**Tanggung Jawab Akun**: Setiap pengguna bertanggung jawab penuh atas aktivitas yang dilakukan menggunakan akun mereka. Jangan berbagi kredensial login dengan siapapun.

**Penonaktifan Akun**: Akun dapat dinonaktifkan sewaktu-waktu apabila pengguna tidak lagi berstatus pegawai aktif instansi, atau atas kebijakan administrator.

**Level Akses**: Sistem menerapkan kontrol akses berbasis peran (RBAC). Pengguna hanya dapat mengakses fitur sesuai peran yang ditetapkan (Admin / Petugas / Pengawas).`
  },
  {
    icon: CheckCircle2,
    color: "#059669",
    title: "3. Penggunaan yang Diizinkan",
    content: `Pengguna diizinkan untuk:

• Mengelola data pedagang, kios, dan porter dalam lingkup tugas resmi.
• Membuat, mengkonfirmasi, dan mencetak tagihan retribusi.
• Mengakses dan mengunduh laporan sesuai wewenang jabatan.
• Menggunakan fitur peta GIS untuk pemantauan dan perencanaan pasar.
• Melaporkan masalah teknis kepada administrator atau tim dukungan.`
  },
  {
    icon: XCircle,
    color: "#EF4444",
    title: "4. Penggunaan yang Dilarang",
    content: `Pengguna dilarang keras untuk:

• **Mengubah data secara tidak sah**: Memanipulasi data pedagang, tagihan, atau laporan untuk kepentingan pribadi atau kelompok.
• **Akses tidak berwenang**: Mencoba mengakses fitur atau data di luar level akses yang ditetapkan.
• **Berbagi akun**: Memberikan kredensial login kepada pihak lain, termasuk sesama pegawai.
• **Aktivitas merusak sistem**: Upaya hacking, injeksi kode berbahaya, atau eksploitasi kelemahan sistem.
• **Penggunaan komersial pribadi**: Menggunakan data atau akses sistem untuk keuntungan pribadi di luar tugas resmi.
• **Distribusi data tanpa izin**: Menyebarkan data pedagang atau laporan keuangan kepada pihak yang tidak berhak.

Pelanggaran dapat berakibat penonaktifan akun, sanksi administratif, dan/atau proses hukum.`
  },
  {
    icon: Scale,
    color: "#7C3AED",
    title: "5. Kepemilikan & Kekayaan Intelektual",
    content: `**Kepemilikan Sistem**: SVMS Enterprise beserta seluruh kode sumber, desain, dan fiturnya adalah properti intelektual pengembang sistem.

**Kepemilikan Data**: Data pedagang, kios, dan transaksi yang dimasukkan ke dalam sistem merupakan milik instansi pengelola (Dinas/UPTD) sesuai peraturan perundang-undangan.

**Larangan Reproduksi**: Dilarang menyalin, mendistribusikan, atau memodifikasi sistem tanpa izin tertulis dari pihak pengembang.`
  },
  {
    icon: AlertTriangle,
    color: "#F59E0B",
    title: "6. Batasan Tanggung Jawab",
    content: `Sistem disediakan **"sebagaimana adanya"** dengan upaya terbaik untuk menjaga ketersediaan dan keandalan.

Kami tidak bertanggung jawab atas:

• Kerugian akibat gangguan sistem yang disebabkan faktor di luar kendali (force majeure, gangguan infrastruktur).
• Kehilangan data akibat kesalahan pengguna atau penggunaan tidak sesuai prosedur.
• Keputusan operasional yang diambil berdasarkan data atau laporan dari sistem.

**Pemeliharaan**: Sistem dapat mengalami downtime terjadwal untuk pembaruan. Pengguna akan diberitahu minimal 24 jam sebelumnya.`
  },
  {
    icon: Clock,
    color: "#64748B",
    title: "7. Perubahan Ketentuan & Hukum yang Berlaku",
    content: `**Perubahan Ketentuan**: Syarat & Ketentuan ini dapat diperbarui sesuai kebutuhan. Perubahan signifikan akan diumumkan melalui sistem dengan pemberitahuan minimal 7 hari sebelum berlaku.

**Hukum yang Berlaku**: Syarat & Ketentuan ini diatur dan ditafsirkan sesuai hukum Republik Indonesia.

**Penyelesaian Sengketa**: Sengketa yang timbul diselesaikan secara musyawarah. Apabila tidak tercapai kesepakatan, diselesaikan melalui Pengadilan Negeri yang berwenang.

Dokumen ini berlaku efektif sejak **1 Januari 2026** untuk SVMS Enterprise versi 6.0 ke atas.`
  },
];

export default function SyaratPage() {
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
            <FileText style={{ width: "14px", height: "14px", color: "#F59E0B" }} />
            <span style={{ fontSize: "13px", color: "#F59E0B", fontWeight: "600" }}>Syarat &amp; Ketentuan</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: "800", marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Syarat &amp; Ketentuan Penggunaan
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "15px", lineHeight: "1.7", maxWidth: "650px" }}>
            Ketentuan penggunaan ini mengatur hak dan kewajiban pengguna sistem SVMS Enterprise. Harap baca dengan seksama sebelum menggunakan sistem.
          </p>
          <div style={{ marginTop: "16px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#64748B" }}>Versi: 6.0</span>
            <span style={{ fontSize: "12px", color: "#64748B" }}>Berlaku sejak: 1 Januari 2026</span>
          </div>
        </div>

        {/* Table of Contents */}
        <div style={{ background: "rgba(30,41,59,0.4)", border: "1px solid #1E293B", borderRadius: "14px", padding: "20px 24px", marginBottom: "32px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Daftar Isi</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {SECTIONS.map((sec, i) => (
              <div key={i} style={{ fontSize: "14px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: sec.color, flexShrink: 0 }} />
                {sec.title}
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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

        {/* Agreement Banner */}
        <div style={{ marginTop: "40px", padding: "24px 28px", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "14px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <CheckCircle2 style={{ width: "20px", height: "20px", color: "#22C55E", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ color: "#CBD5E1", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
            Dengan terus menggunakan SVMS Enterprise, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan di atas. Jika tidak setuju, harap hentikan penggunaan sistem dan hubungi administrator instansi Anda.
          </p>
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #1E293B", padding: "24px 20px", textAlign: "center" }}>
        <p style={{ color: "#475569", fontSize: "13px" }}>© 2026 SVMS Enterprise — Dinas Pengelolaan Pasar</p>
      </footer>
    </div>
  );
}
