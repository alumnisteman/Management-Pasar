import { useEffect, useRef, useState } from "react";
import {
  Shield,
  Users,
  Truck,
  Map,
  CircleCheck,
  Menu,
  ArrowRight,
  FileText,
  X,
  ChevronRight,
  Moon,
  Sun,
  BarChart3,
  Bell,
  Lock,
} from "lucide-react";

const LIGHT = {
  pageBg: "#F8FAFC",
  navBg: "rgba(15,23,42,0.97)",
  navBorder: "#1E293B",
  navText: "#CBD5E1",
  cardBg: "#FFFFFF",
  cardBorder: "#F1F5F9",
  heading: "#0F172A",
  body: "#64748B",
  sectionAlt: "#F8FAFC",
  sectionWhite: "#FFFFFF",
  sectionBorder: "#F1F5F9",
  statBorder: "#F1F5F9",
  stepCircleBg: "#FFFFFF",
  stepCircleBorder: "#F1F5F9",
  footerBg: "#020617",
  footerBorder: "#1E293B",
  footerLink: "#64748B",
  footerCopy: "#475569",
};

const DARK = {
  pageBg: "#0D1117",
  navBg: "rgba(13,17,23,0.97)",
  navBorder: "#30363D",
  navText: "#8B949E",
  cardBg: "#161B22",
  cardBorder: "#30363D",
  heading: "#F0F6FC",
  body: "#8B949E",
  sectionAlt: "#0D1117",
  sectionWhite: "#161B22",
  sectionBorder: "#30363D",
  statBorder: "#30363D",
  stepCircleBg: "#161B22",
  stepCircleBorder: "#0D1117",
  footerBg: "#010409",
  footerBorder: "#30363D",
  footerLink: "#8B949E",
  footerCopy: "#6E7681",
};

const MODULES = [
  {
    id: "traders",
    label: "Manajemen Pedagang",
    icon: Users,
    color: "#2563EB",
    headline: "Database Pedagang Terpusat",
    desc: "Kelola seluruh data pedagang, verifikasi identitas, dan pantau status sewa kios dalam satu tampilan.",
    bullets: [
      "Data KTP & foto pedagang terverifikasi",
      "Riwayat sewa & perpanjangan kontrak",
      "Filter berdasarkan zona, status, dan blok",
      "Export laporan pedagang ke Excel/PDF",
    ],
  },
  {
    id: "billing",
    label: "Tagihan Digital",
    icon: Truck,
    color: "#F59E0B",
    headline: "Penagihan Otomatis & Transparan",
    desc: "Tagih retribusi, pantau pembayaran, dan kirim notifikasi tunggakan secara otomatis.",
    bullets: [
      "Tagihan otomatis bulanan/harian",
      "Notifikasi WhatsApp & SMS",
      "Rekap pendapatan real-time",
      "Cetak kwitansi digital",
    ],
  },
  {
    id: "grid",
    label: "Peta Kios GIS",
    icon: Map,
    color: "#059669",
    headline: "Denah Pasar Interaktif",
    desc: "Visualisasi denah pasar dalam grid 2D — lihat status setiap kios, blok, dan zona secara real-time.",
    bullets: [
      "Grid interaktif per blok & zona",
      "Warna kode status (aktif/kosong/sengketa)",
      "Klik kios untuk detail & riwayat",
      "Kelola penempatan pedagang baru",
    ],
  },
  {
    id: "porter",
    label: "Porter Management",
    icon: CircleCheck,
    color: "#7C3AED",
    headline: "Koordinasi Porter Efisien",
    desc: "Daftarkan, jadwalkan, dan pantau kinerja porter pasar untuk kelancaran logistik harian.",
    bullets: [
      "Database porter berlisensi",
      "Jadwal shift & area tugas",
      "Lacak jumlah layanan per porter",
      "Rating & evaluasi kinerja",
    ],
  },
  {
    id: "analytics",
    label: "Laporan & Analitik",
    icon: BarChart3,
    color: "#E11D48",
    headline: "Insight Berbasis Data",
    desc: "Dashboard analitik lengkap dengan grafik tren pendapatan, okupansi, dan perbandingan periode.",
    bullets: [
      "Grafik pendapatan bulanan",
      "Tingkat hunian & kekosongan kios",
      "Komparasi tahun-ke-tahun",
      "Unduh laporan otomatis",
    ],
  },
  {
    id: "audit",
    label: "Audit Log",
    icon: Shield,
    color: "#475569",
    headline: "Transparansi & Akuntabilitas",
    desc: "Setiap perubahan data tercatat otomatis — siapa, kapan, dan apa yang diubah.",
    bullets: [
      "Log semua aktivitas pengguna",
      "Filter berdasarkan modul & tanggal",
      "Deteksi akses mencurigakan",
      "Export log untuk audit eksternal",
    ],
  },
];

const STEPS = [
  {
    number: "1",
    title: "Login & Setup",
    description:
      "Akses sistem dengan kredensial aman dan konfigurasi profil pasar Anda.",
  },
  {
    number: "2",
    title: "Kelola Data",
    description:
      "Input dan migrasi data pedagang, kios, dan aset ke dalam database terpusat.",
  },
  {
    number: "3",
    title: "Monitor & Laporan",
    description:
      "Pantau operasional, terima retribusi, dan unduh laporan komprehensif harian.",
  },
];

function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    let startTime: number;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return [count, ref] as const;
}

export function Landing() {
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const t = dark ? DARK : LIGHT;

  const [traders, tradersRef] = useCounter(132);
  const [stalls, stallsRef] = useCounter(200);
  const [compliance, complianceRef] = useCounter(97);

  const activeM = MODULES.find((m) => m.id === activeModule);

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: t.pageBg,
        color: t.heading,
        minHeight: "100vh",
        overflowX: "hidden",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {/* Modal */}
      {activeM && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModule(null);
          }}
        >
          <div
            style={{
              background: "#0F172A",
              borderRadius: "20px",
              border: "1px solid rgba(71,85,105,0.6)",
              width: "100%",
              maxWidth: "560px",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                borderBottom: "1px solid rgba(30,41,59,1)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    background: activeM.color,
                    padding: "8px",
                    borderRadius: "10px",
                  }}
                >
                  <activeM.icon
                    style={{ width: "18px", height: "18px", color: "#fff" }}
                  />
                </div>
                <span
                  style={{
                    fontWeight: "700",
                    fontSize: "16px",
                    color: "white",
                  }}
                >
                  {activeM.headline}
                </span>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748B",
                }}
              >
                <X style={{ width: "20px", height: "20px" }} />
              </button>
            </div>
            <div style={{ padding: "24px" }}>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "15px",
                  lineHeight: "1.7",
                  marginBottom: "20px",
                }}
              >
                {activeM.desc}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {activeM.bullets.map((b, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 0",
                      borderBottom:
                        i < activeM.bullets.length - 1
                          ? "1px solid rgba(30,41,59,0.6)"
                          : "none",
                      color: "#CBD5E1",
                      fontSize: "14px",
                    }}
                  >
                    <CircleCheck
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#22C55E",
                        flexShrink: 0,
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: t.navBg,
          borderBottom: `1px solid ${t.navBorder}`,
          backdropFilter: "blur(12px)",
          transition: "background 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 16px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                background: "#F59E0B",
                padding: "7px",
                borderRadius: "9px",
              }}
            >
              <Shield style={{ width: "18px", height: "18px", color: "#0F172A" }} />
            </div>
            <div>
              <span
                style={{
                  fontWeight: "700",
                  fontSize: "15px",
                  color: "white",
                  display: "block",
                  lineHeight: "1.2",
                }}
              >
                Sistem Manajemen Pasar
              </span>
              <span style={{ color: "#64748B", fontSize: "11px" }}>
                v6.0 — Dinas Pengelolaan Pasar
              </span>
            </div>
          </div>

          {/* Desktop links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
            className="nav-links"
          >
            {["Fitur", "Cara Kerja", "Tentang", "Kontak"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: t.navText,
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#F59E0B")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = t.navText)
                }
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setDark(!dark)}
              style={{
                background: dark ? "#F59E0B" : "#1E293B",
                border: "none",
                borderRadius: "8px",
                padding: "7px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {dark ? (
                <Sun style={{ width: "16px", height: "16px", color: "#0D1117" }} />
              ) : (
                <Moon style={{ width: "16px", height: "16px", color: "#F59E0B" }} />
              )}
            </button>
            <button
              style={{
                background: "#F59E0B",
                color: "#0F172A",
                fontWeight: "700",
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Masuk
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94A3B8",
                cursor: "pointer",
                padding: "4px",
                display: "none",
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? (
                <X style={{ width: "22px", height: "22px" }} />
              ) : (
                <Menu style={{ width: "22px", height: "22px" }} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #020617 0%, #0F172A 50%, #1E293B 100%)",
          padding: "96px 16px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: "100px",
              padding: "6px 14px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#F59E0B",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{ color: "#F59E0B", fontSize: "13px", fontWeight: "600" }}
            >
              SVMS v6.0 — Resmi Diluncurkan
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: "800",
              color: "white",
              lineHeight: "1.15",
              letterSpacing: "-0.03em",
              maxWidth: "700px",
              marginBottom: "24px",
            }}
          >
            Pasar Digital yang{" "}
            <span style={{ color: "#F59E0B" }}>Terkelola Penuh</span>
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#94A3B8",
              lineHeight: "1.7",
              maxWidth: "580px",
              marginBottom: "40px",
            }}
          >
            Platform manajemen pasar terpadu untuk Dinas Pengelolaan Pasar —
            dari data pedagang, tagihan digital, hingga peta kios interaktif
            dalam satu sistem.
          </p>

          <div
            style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "64px" }}
          >
            <button
              style={{
                background: "#F59E0B",
                color: "#0F172A",
                fontWeight: "700",
                padding: "14px 36px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
              }}
            >
              Mulai Sekarang <ArrowRight style={{ width: "18px", height: "18px" }} />
            </button>
            <button
              style={{
                background: "transparent",
                color: "white",
                fontWeight: "600",
                padding: "14px 28px",
                borderRadius: "10px",
                border: "1px solid rgba(71,85,105,0.8)",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Lihat Demo
            </button>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "0",
              flexWrap: "wrap",
              borderTop: "1px solid rgba(30,41,59,1)",
              paddingTop: "48px",
            }}
          >
            {[
              { ref: tradersRef, value: traders, suffix: "+", label: "Pedagang Aktif" },
              { ref: stallsRef, value: stalls, suffix: "+", label: "Kios Terkelola" },
              { ref: complianceRef, value: compliance, suffix: "%", label: "Kepatuhan Tagihan" },
            ].map((stat, i) => (
              <div
                key={i}
                ref={stat.ref as React.RefObject<HTMLDivElement>}
                style={{
                  flex: "1",
                  minWidth: "140px",
                  textAlign: "center",
                  padding: "0 32px",
                  borderRight:
                    i < 2 ? "1px solid rgba(30,41,59,1)" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: "800",
                    color: "#F59E0B",
                    lineHeight: "1",
                    marginBottom: "8px",
                  }}
                >
                  {stat.value}{stat.suffix}
                </div>
                <div style={{ color: "#64748B", fontSize: "14px", fontWeight: "500" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="fitur"
        style={{
          padding: "96px 16px",
          background: t.sectionAlt,
          transition: "background 0.3s",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              maxWidth: "640px",
              margin: "0 auto 64px",
            }}
          >
            <span
              style={{
                color: "#F59E0B",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Fitur Lengkap
            </span>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: "800",
                color: t.heading,
                marginBottom: "16px",
                letterSpacing: "-0.02em",
                transition: "color 0.3s",
              }}
            >
              Semua Kebutuhan Pasar, Satu Platform
            </h2>
            <p
              style={{
                fontSize: "17px",
                color: t.body,
                lineHeight: "1.7",
                transition: "color 0.3s",
              }}
            >
              Enam modul terintegrasi untuk mengelola seluruh aspek operasional
              pasar secara efisien.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {MODULES.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                t={t}
                onClick={() => setActiveModule(mod.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="cara-kerja"
        style={{
          padding: "96px 16px",
          background: t.sectionWhite,
          borderTop: `1px solid ${t.sectionBorder}`,
          borderBottom: `1px solid ${t.sectionBorder}`,
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              maxWidth: "640px",
              margin: "0 auto 64px",
            }}
          >
            <span
              style={{
                color: "#F59E0B",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Cara Kerja
            </span>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: "800",
                color: t.heading,
                marginBottom: "16px",
                letterSpacing: "-0.02em",
                transition: "color 0.3s",
              }}
            >
              Alur Kerja Sederhana
            </h2>
            <p
              style={{
                fontSize: "17px",
                color: t.body,
                lineHeight: "1.7",
                transition: "color 0.3s",
              }}
            >
              Implementasi cepat tanpa mengganggu operasional harian pasar.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "32px",
              position: "relative",
            }}
          >
            {STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  flex: "1",
                  minWidth: "220px",
                  maxWidth: "300px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 16px",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: t.stepCircleBg,
                    border: `4px solid #F59E0B`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#F59E0B",
                    marginBottom: "24px",
                    boxShadow: "0 4px 16px rgba(245,158,11,0.2)",
                    transition: "background 0.3s",
                  }}
                >
                  {step.number}
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: t.heading,
                    marginBottom: "12px",
                    transition: "color 0.3s",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: t.body,
                    lineHeight: "1.7",
                    fontSize: "15px",
                    transition: "color 0.3s",
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security strip */}
      <section
        style={{
          padding: "48px 16px",
          background: t.sectionAlt,
          borderBottom: `1px solid ${t.sectionBorder}`,
          transition: "background 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "40px",
          }}
        >
          {[
            { icon: Lock, text: "Enkripsi Data End-to-End" },
            { icon: Shield, text: "Audit Log Real-time" },
            { icon: Bell, text: "Notifikasi Otomatis" },
            { icon: FileText, text: "Laporan Komprehensif" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: t.body,
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <Icon style={{ width: "18px", height: "18px", color: "#F59E0B" }} />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "96px 16px",
          background: "#0F172A",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1E293B, #0F172A)",
              border: "1px solid rgba(71,85,105,1)",
              borderRadius: "24px",
              padding: "clamp(48px, 8vw, 80px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.75rem, 5vw, 3rem)",
                fontWeight: "800",
                color: "white",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
              }}
            >
              Siap Transformasi Pasar Anda?
            </h2>
            <p
              style={{
                fontSize: "17px",
                color: "#94A3B8",
                marginBottom: "40px",
                maxWidth: "500px",
                margin: "0 auto 40px",
                lineHeight: "1.7",
              }}
            >
              Tingkatkan efisiensi, transparansi, dan pendapatan daerah dengan
              Sistem Manajemen Pasar Terpadu.
            </p>
            <div
              style={{
                display: "flex",
                gap: "14px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                style={{
                  background: "#F59E0B",
                  color: "#0F172A",
                  fontWeight: "700",
                  padding: "16px 48px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "17px",
                  boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Mulai Sekarang <ArrowRight style={{ width: "20px", height: "20px" }} />
              </button>
              <button
                style={{
                  background: "transparent",
                  color: "white",
                  fontWeight: "600",
                  padding: "16px 32px",
                  borderRadius: "12px",
                  border: "1px solid rgba(71,85,105,1)",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: t.footerBg,
          paddingTop: "64px",
          paddingBottom: "32px",
          borderTop: `1px solid ${t.footerBorder}`,
          transition: "background 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "24px",
              marginBottom: "48px",
              paddingBottom: "48px",
              borderBottom: `1px solid ${t.footerBorder}`,
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <div
                style={{
                  background: "#F59E0B",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <Shield
                  style={{ width: "22px", height: "22px", color: "#0F172A" }}
                />
              </div>
              <div>
                <span
                  style={{
                    fontWeight: "700",
                    fontSize: "18px",
                    color: "white",
                    display: "block",
                  }}
                >
                  Sistem Manajemen Pasar Terpadu
                </span>
                <span style={{ color: t.footerLink, fontSize: "13px" }}>
                  v6.0 — Dinas Pengelolaan Pasar
                </span>
              </div>
            </div>
            <div
              style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}
            >
              {["Pengumuman", "Bantuan", "Kebijakan Privasi", "Syarat & Ketentuan"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      color: t.footerLink,
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F59E0B")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = t.footerLink)
                    }
                  >
                    {link}
                  </a>
                )
              )}
            </div>
          </div>
          <p style={{ color: t.footerCopy, fontSize: "13px", textAlign: "center" }}>
            SVMS Version 6.0 © 2025 Dinas Pengelolaan Pasar. Hak cipta dilindungi.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

function ModuleCard({
  module,
  t,
  onClick,
}: {
  module: (typeof MODULES)[0];
  t: typeof LIGHT;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = module.icon;

  return (
    <div
      style={{
        background: t.cardBg,
        padding: "32px",
        borderRadius: "16px",
        border: `1px solid ${hovered ? module.color + "60" : t.cardBorder}`,
        boxShadow: hovered
          ? `0 12px 32px ${module.color}18`
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition:
          "box-shadow 0.25s, transform 0.25s, background 0.3s, border-color 0.25s",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "12px",
          background: module.color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Icon
          style={{ width: "24px", height: "24px", color: module.color }}
        />
      </div>
      <h3
        style={{
          fontSize: "17px",
          fontWeight: "700",
          color: t.heading,
          marginBottom: "10px",
          transition: "color 0.3s",
        }}
      >
        {module.label}
      </h3>
      <p
        style={{
          color: t.body,
          lineHeight: "1.65",
          fontSize: "14px",
          transition: "color 0.3s",
          marginBottom: hovered ? "16px" : "0",
        }}
      >
        {module.desc}
      </p>
      {hovered && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: module.color,
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Lihat Modul{" "}
          <ChevronRight style={{ width: "14px", height: "14px" }} />
        </div>
      )}
    </div>
  );
}
