import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Shield, Users, Receipt, Map as MapIcon,
  Truck, BarChart, Menu, X, ArrowRight, Sun, Moon,
  ChevronRight, Building2, MapPin, Package, FileText,
  CheckCircle2, TrendingUp, Clock, Lock
} from "lucide-react";

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return [count, ref];
}

const LIGHT = {
  pageBg: "#F8FAFC",
  navBg: "rgba(15,23,42,0.97)",
  navBorder: "#1E293B",
  navText: "#CBD5E1",
  cardBg: "#FFFFFF",
  cardBorder: "#F1F5F9",
  cardShadow: "0 2px 8px rgba(0,0,0,0.04)",
  cardShadowHover: "0 8px 24px rgba(0,0,0,0.10)",
  iconBg: "#F8FAFC",
  sectionAlt: "#F8FAFC",
  sectionWhite: "#FFFFFF",
  sectionBorder: "#F1F5F9",
  heading: "#0F172A",
  body: "#64748B",
  statValue: "#0F172A",
  statBorder: "#F1F5F9",
  stepCircleBg: "#FFFFFF",
  stepCircleBorder: "#F8FAFC",
  footerBg: "#020617",
  footerBorder: "#1E293B",
  footerLink: "#64748B",
  footerCopy: "#475569",
  toggleBg: "#1E293B",
  toggleIcon: "#F59E0B",
  mobileBg: "#0F172A",
};

const DARK = {
  pageBg: "#0D1117",
  navBg: "rgba(13,17,23,0.97)",
  navBorder: "#30363D",
  navText: "#8B949E",
  cardBg: "#161B22",
  cardBorder: "#30363D",
  cardShadow: "0 2px 8px rgba(0,0,0,0.3)",
  cardShadowHover: "0 8px 24px rgba(0,0,0,0.5)",
  iconBg: "#0D1117",
  sectionAlt: "#0D1117",
  sectionWhite: "#161B22",
  sectionBorder: "#30363D",
  heading: "#F0F6FC",
  body: "#8B949E",
  statValue: "#F0F6FC",
  statBorder: "#30363D",
  stepCircleBg: "#161B22",
  stepCircleBorder: "#0D1117",
  footerBg: "#010409",
  footerBorder: "#30363D",
  footerLink: "#8B949E",
  footerCopy: "#6E7681",
  toggleBg: "#F59E0B",
  toggleIcon: "#0D1117",
  mobileBg: "#0D1117",
};

const DEMO_FEATURES = [
  {
    id: "traders",
    label: "Manajemen Pedagang",
    icon: Users,
    color: "#2563EB",
    route: "/admin/traders",
    headline: "Database Pedagang Terpusat",
    desc: "Kelola seluruh data pedagang, verifikasi identitas, dan pantau status sewa kios dalam satu tampilan.",
    bullets: ["Data KTP & foto pedagang terverifikasi", "Riwayat sewa & perpanjangan kontrak", "Filter berdasarkan zona, status, dan blok", "Export laporan pedagang ke Excel/PDF"],
    preview: {
      rows: [
        { name: "Siti Rahayu", kios: "A-12", status: "Aktif", color: "#22C55E" },
        { name: "Budi Santoso", kios: "B-07", status: "Aktif", color: "#22C55E" },
        { name: "Dewi Lestari", kios: "C-03", status: "Menunggak", color: "#EF4444" },
        { name: "Ahmad Fauzi", kios: "A-05", status: "Aktif", color: "#22C55E" },
      ]
    }
  },
  {
    id: "billing",
    label: "Tagihan Digital",
    icon: Receipt,
    color: "#F59E0B",
    route: "/admin/billing",
    headline: "Penagihan Otomatis & Transparan",
    desc: "Tagih retribusi, pantau pembayaran, dan kirim notifikasi tunggakan secara otomatis.",
    bullets: ["Tagihan otomatis bulanan/harian", "Notifikasi WhatsApp & SMS", "Rekap pendapatan real-time", "Cetak kwitansi digital"],
    preview: {
      stats: [
        { label: "Terbayar", val: "Rp 48,5 jt", color: "#22C55E" },
        { label: "Menunggak", val: "Rp 4,2 jt", color: "#EF4444" },
        { label: "Bulan Ini", val: "Rp 52,7 jt", color: "#F59E0B" },
      ]
    }
  },
  {
    id: "grid",
    label: "Peta Kios GIS",
    icon: MapIcon,
    color: "#059669",
    route: "/admin/grid",
    headline: "Denah Pasar Interaktif",
    desc: "Visualisasi denah pasar dalam grid 2D — lihat status setiap kios, blok, dan zona secara real-time.",
    bullets: ["Grid interaktif per blok & zona", "Warna kode status (aktif/kosong/sengketa)", "Klik kios untuk detail & riwayat", "Kelola penempatan pedagang baru"],
    preview: {
      grid: true
    }
  },
  {
    id: "porter",
    label: "Porter Management",
    icon: Truck,
    color: "#7C3AED",
    route: "/admin/porter",
    headline: "Koordinasi Porter Efisien",
    desc: "Daftarkan, jadwalkan, dan pantau kinerja porter pasar untuk kelancaran logistik harian.",
    bullets: ["Database porter berlisensi", "Jadwal shift & area tugas", "Lacak jumlah layanan per porter", "Rating & evaluasi kinerja"],
    preview: {
      porters: [
        { name: "Joko Widodo", shift: "Pagi 06:00–14:00", tugas: 12 },
        { name: "Rudi Hartono", shift: "Siang 14:00–22:00", tugas: 8 },
        { name: "Suparman", shift: "Pagi 06:00–14:00", tugas: 15 },
      ]
    }
  },
  {
    id: "analytics",
    label: "Laporan & Analitik",
    icon: BarChart,
    color: "#E11D48",
    route: "/admin/analytics",
    headline: "Insight Berbasis Data",
    desc: "Dashboard analitik lengkap dengan grafik tren pendapatan, okupansi, dan perbandingan periode.",
    bullets: ["Grafik pendapatan bulanan", "Tingkat hunian & kekosongan kios", "Komparasi tahun-ke-tahun", "Unduh laporan otomatis"],
    preview: {
      bars: [55, 70, 45, 88, 62, 95, 78, 83, 91, 69, 74, 100]
    }
  },
  {
    id: "audit",
    label: "Audit Log",
    icon: Shield,
    color: "#475569",
    route: "/admin/audit",
    headline: "Transparansi & Akuntabilitas",
    desc: "Setiap perubahan data tercatat otomatis — siapa, kapan, dan apa yang diubah.",
    bullets: ["Log semua aktivitas pengguna", "Filter berdasarkan modul & tanggal", "Deteksi akses mencurigakan", "Export log untuk audit eksternal"],
    preview: {
      logs: [
        { user: "admin", action: "Edit data pedagang A-12", time: "09:14" },
        { user: "petugas1", action: "Cetak tagihan bulan Juni", time: "09:08" },
        { user: "admin", action: "Tambah porter baru", time: "08:55" },
        { user: "petugas2", action: "Konfirmasi pembayaran", time: "08:30" },
      ]
    }
  },
];

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("svms-dark") === "true"; } catch { return false; }
  });
  const [showDemo, setShowDemo] = useState(false);
  const [demoTab, setDemoTab] = useState(0);
  const navigate = useNavigate();
  const [traders, tradersRef] = useCountUp(500);
  const [stalls, stallsRef] = useCountUp(200);
  const [bills, billsRef] = useCountUp(98);

  const t = dark ? DARK : LIGHT;

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    try { localStorage.setItem("svms-dark", String(next)); } catch {}
  };

  const goToLogin = () => navigate("/login");
  const openDemo = () => { setDemoTab(0); setShowDemo(true); };

  const featureRoutes = [
    "/admin/traders",
    "/admin/billing",
    "/admin/grid",
    "/admin/porter",
    "/admin/analytics",
    "/admin/audit",
  ];

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: t.pageBg, color: t.heading, minHeight: "100vh", overflowX: "hidden", transition: "background 0.3s, color 0.3s" }}>

      {/* Demo Modal */}
      {showDemo && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowDemo(false); }}
        >
          <div style={{ background: "#0F172A", borderRadius: "20px", border: "1px solid rgba(71,85,105,0.6)", width: "100%", maxWidth: "900px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(30,41,59,1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ background: "#F59E0B", padding: "6px", borderRadius: "8px" }}>
                  <Shield style={{ width: "18px", height: "18px", color: "#0F172A" }} />
                </div>
                <span style={{ fontWeight: "700", fontSize: "16px", color: "white" }}>SVMS Enterprise — Demo Interaktif</span>
              </div>
              <button onClick={() => setShowDemo(false)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(71,85,105,0.5)", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#94A3B8", display: "flex" }}>
                <X style={{ width: "18px", height: "18px" }} />
              </button>
            </div>

            {/* Tab Nav */}
            <div style={{ display: "flex", overflowX: "auto", gap: "4px", padding: "12px 24px 0", borderBottom: "1px solid rgba(30,41,59,1)" }}>
              {DEMO_FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => setDemoTab(i)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", background: demoTab === i ? "#1E293B" : "transparent", color: demoTab === i ? "white" : "#64748B", borderBottom: demoTab === i ? "2px solid #F59E0B" : "2px solid transparent", transition: "all 0.2s" }}
                  >
                    <Icon style={{ width: "14px", height: "14px", color: demoTab === i ? f.color : "#64748B" }} />
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflow: "auto", padding: "28px 24px" }}>
              {(() => {
                const feat = DEMO_FEATURES[demoTab];
                const Icon = feat.icon;
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "28px", alignItems: "start" }}>
                    {/* Left: Info */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${feat.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon style={{ width: "24px", height: "24px", color: feat.color }} />
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "#64748B", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>Modul</div>
                          <div style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>{feat.label}</div>
                        </div>
                      </div>
                      <h3 style={{ fontSize: "20px", fontWeight: "700", color: "white", marginBottom: "10px" }}>{feat.headline}</h3>
                      <p style={{ color: "#94A3B8", lineHeight: "1.7", marginBottom: "20px", fontSize: "14px" }}>{feat.desc}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                        {feat.bullets.map((b, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                            <CheckCircle2 style={{ width: "16px", height: "16px", color: "#22C55E", flexShrink: 0, marginTop: "2px" }} />
                            <span style={{ color: "#CBD5E1", fontSize: "14px" }}>{b}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => { setShowDemo(false); navigate("/login"); }}
                        style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
                      >
                        Akses Modul Ini <ChevronRight style={{ width: "16px", height: "16px" }} />
                      </button>
                    </div>

                    {/* Right: Preview */}
                    <div style={{ background: "#020B18", borderRadius: "14px", border: "1px solid rgba(30,41,59,1)", overflow: "hidden" }}>
                      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(30,41,59,1)", display: "flex", alignItems: "center", gap: "6px" }}>
                        {["#334155","#334155","#334155"].map((c, i) => <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />)}
                        <span style={{ fontSize: "11px", color: "#475569", marginLeft: "6px", flex: 1, textAlign: "center" }}>svms.enterprise / {feat.route}</span>
                      </div>
                      <div style={{ padding: "16px" }}>
                        {/* Traders preview */}
                        {feat.preview.rows && (
                          <div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: "6px", padding: "6px 8px", marginBottom: "4px" }}>
                              {["Nama Pedagang","No. Kios","Status"].map(h => <span key={h} style={{ fontSize: "10px", fontWeight: "700", color: "#475569", textTransform: "uppercase" }}>{h}</span>)}
                            </div>
                            {feat.preview.rows.map((r, i) => (
                              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: "6px", padding: "8px", background: "rgba(30,41,59,0.4)", borderRadius: "6px", marginBottom: "4px", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#94A3B8", fontWeight: "700" }}>{r.name[0]}</div>
                                  <span style={{ fontSize: "12px", color: "#E2E8F0" }}>{r.name}</span>
                                </div>
                                <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "monospace" }}>{r.kios}</span>
                                <span style={{ fontSize: "11px", color: r.color, fontWeight: "600", background: `${r.color}15`, padding: "2px 6px", borderRadius: "4px", textAlign: "center" }}>{r.status}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Billing preview */}
                        {feat.preview.stats && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {feat.preview.stats.map((s, i) => (
                              <div key={i} style={{ background: "rgba(30,41,59,0.4)", borderRadius: "10px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${s.color}` }}>
                                <span style={{ fontSize: "12px", color: "#94A3B8" }}>{s.label}</span>
                                <span style={{ fontSize: "16px", fontWeight: "800", color: s.color }}>{s.val}</span>
                              </div>
                            ))}
                            <div style={{ marginTop: "8px" }}>
                              <div style={{ fontSize: "11px", color: "#475569", marginBottom: "8px" }}>Progres Tagihan Bulan Ini</div>
                              <div style={{ height: "8px", background: "#1E293B", borderRadius: "4px" }}>
                                <div style={{ width: "92%", height: "100%", background: "linear-gradient(90deg, #22C55E, #F59E0B)", borderRadius: "4px" }} />
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                                <span style={{ fontSize: "10px", color: "#475569" }}>0%</span>
                                <span style={{ fontSize: "10px", color: "#F59E0B", fontWeight: "700" }}>92% terbayar</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* GIS Grid preview */}
                        {feat.preview.grid && (
                          <div>
                            <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                              {[["#22C55E","Aktif"],["#F59E0B","Kosong"],["#EF4444","Sengketa"]].map(([c,l]) => (
                                <div key={l} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: c }} />
                                  <span style={{ fontSize: "10px", color: "#64748B" }}>{l}</span>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "3px" }}>
                              {Array.from({ length: 48 }, (_, i) => {
                                const r = Math.random();
                                const color = r > 0.75 ? "#EF444430" : r > 0.15 ? "#22C55E30" : "#F59E0B30";
                                const border = r > 0.75 ? "#EF4444" : r > 0.15 ? "#22C55E" : "#F59E0B";
                                return <div key={i} style={{ aspectRatio: "1", borderRadius: "3px", background: color, border: `1px solid ${border}40`, cursor: "pointer" }} title={`Kios ${i+1}`} />;
                              })}
                            </div>
                          </div>
                        )}

                        {/* Porter preview */}
                        {feat.preview.porters && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {feat.preview.porters.map((p, i) => (
                              <div key={i} style={{ background: "rgba(30,41,59,0.4)", borderRadius: "8px", padding: "10px 12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#E2E8F0" }}>{p.name}</span>
                                  <span style={{ fontSize: "11px", color: "#7C3AED", background: "#7C3AED20", padding: "1px 6px", borderRadius: "4px", fontWeight: "600" }}>{p.tugas} tugas</span>
                                </div>
                                <span style={{ fontSize: "11px", color: "#64748B" }}>{p.shift}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Analytics preview */}
                        {feat.preview.bars && (
                          <div>
                            <div style={{ fontSize: "11px", color: "#475569", marginBottom: "10px" }}>Pendapatan Retribusi 2026 (Juta Rp)</div>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "100px" }}>
                              {feat.preview.bars.map((h, i) => (
                                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                                  <div style={{ width: "100%", background: i === feat.preview.bars.length - 1 ? "#F59E0B" : "rgba(245,158,11,0.5)", borderRadius: "3px 3px 0 0", height: `${h}%`, transition: "height 0.3s" }} />
                                  <span style={{ fontSize: "8px", color: "#475569" }}>{["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"][i]}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Audit preview */}
                        {feat.preview.logs && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {feat.preview.logs.map((l, i) => (
                              <div key={i} style={{ background: "rgba(30,41,59,0.4)", borderRadius: "6px", padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                                <div>
                                  <span style={{ fontSize: "10px", color: "#F59E0B", fontWeight: "600", background: "#F59E0B15", padding: "1px 5px", borderRadius: "3px" }}>{l.user}</span>
                                  <p style={{ fontSize: "12px", color: "#CBD5E1", marginTop: "4px" }}>{l.action}</p>
                                </div>
                                <span style={{ fontSize: "10px", color: "#475569", whiteSpace: "nowrap", marginTop: "2px" }}>{l.time}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(30,41,59,1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#475569" }}>Demo bersifat ilustratif. Data nyata tersedia setelah login.</span>
              <button
                onClick={() => { setShowDemo(false); navigate("/login"); }}
                style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px" }}
              >
                Masuk ke Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", background: t.navBg, borderBottom: `1px solid ${t.navBorder}`, backdropFilter: "blur(12px)", transition: "background 0.3s, border-color 0.3s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ background: "#F59E0B", padding: "6px", borderRadius: "8px" }}>
              <Shield style={{ width: "20px", height: "20px", color: "#0F172A" }} />
            </div>
            <span style={{ fontWeight: "700", fontSize: "18px", letterSpacing: "-0.02em", color: "#F1F5F9" }}>SVMS Enterprise</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "32px", fontSize: "14px", fontWeight: "500", color: t.navText }} className="nav-links">
            <a href="#fitur" style={{ color: "inherit", textDecoration: "none" }}>Fitur</a>
            <a href="#statistik" style={{ color: "inherit", textDecoration: "none" }}>Statistik</a>
            <a href="#cara-kerja" style={{ color: "inherit", textDecoration: "none" }}>Cara Kerja</a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="nav-actions">
            <button
              onClick={toggleDark}
              title={dark ? "Mode Terang" : "Mode Gelap"}
              style={{ background: t.toggleBg, border: "none", borderRadius: "8px", padding: "7px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}
            >
              {dark
                ? <Sun style={{ width: "16px", height: "16px", color: t.toggleIcon }} />
                : <Moon style={{ width: "16px", height: "16px", color: "#F59E0B" }} />
              }
            </button>
            <button
              onClick={goToLogin}
              style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "600", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px" }}
              className="nav-login-btn"
            >
              Masuk ke Dashboard
            </button>
          </div>

          <button
            className="mobile-menu-btn"
            style={{ background: "transparent", border: "none", color: "#CBD5E1", cursor: "pointer", padding: "8px" }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X style={{ width: "24px", height: "24px" }} /> : <Menu style={{ width: "24px", height: "24px" }} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, background: t.mobileBg, paddingTop: "64px", transition: "background 0.3s" }}>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", color: t.navText, fontWeight: "500" }}>
            {[["#fitur","Fitur"],["#statistik","Statistik"],["#cara-kerja","Cara Kerja"]].map(([href,label]) => (
              <a key={href} href={href} style={{ padding: "16px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", color: "inherit", textDecoration: "none" }} onClick={() => setIsMobileMenuOpen(false)}>{label}</a>
            ))}
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button onClick={toggleDark} style={{ flex: "0 0 auto", background: t.toggleBg, border: "none", borderRadius: "10px", padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: t.toggleIcon, fontWeight: "600", fontSize: "14px" }}>
                {dark ? <Sun style={{ width: "18px", height: "18px" }} /> : <Moon style={{ width: "18px", height: "18px" }} />}
                {dark ? "Terang" : "Gelap"}
              </button>
              <button onClick={goToLogin} style={{ flex: 1, background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "14px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "16px" }}>
                Masuk ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ position: "relative", paddingTop: "80px", paddingBottom: "128px", overflow: "hidden", background: "#0F172A", color: "white", minHeight: "90vh", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src="/svms-hero-bg.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,23,42,0.6), rgba(15,23,42,0.85), #0F172A)" }} />
        </div>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px", position: "relative", zIndex: 10, width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px", alignItems: "center" }}>
            <div style={{ maxWidth: "600px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRadius: "9999px", background: "rgba(30,41,59,0.8)", border: "1px solid rgba(71,85,105,1)", color: "#F59E0B", fontSize: "13px", fontWeight: "500", marginBottom: "24px" }}>
                <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px" }}>
                  <span style={{ position: "absolute", display: "inline-flex", width: "100%", height: "100%", borderRadius: "50%", background: "rgba(251,191,36,0.75)", animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite" }} />
                  <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }} />
                </span>
                Sistem Manajemen Pasar Terpadu v6.0
              </div>
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", fontWeight: "800", lineHeight: "1.1", marginBottom: "24px", letterSpacing: "-0.02em", color: "white" }}>
                Kelola Pasar{" "}
                <span style={{ background: "linear-gradient(135deg, #FCD34D, #D97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Lebih Cerdas,</span>{" "}
                Lebih Efisien
              </h1>
              <p style={{ fontSize: "18px", color: "#94A3B8", marginBottom: "32px", lineHeight: "1.7", maxWidth: "500px" }}>
                Platform digitalisasi pasar tradisional untuk Dinas Pengelolaan Pasar. Terintegrasi, transparan, dan dapat diandalkan untuk kemajuan ekonomi daerah.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button onClick={goToLogin} style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "14px 32px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "16px", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 0 24px rgba(245,158,11,0.35)" }}>
                  Mulai Sekarang <ArrowRight style={{ width: "20px", height: "20px" }} />
                </button>
                <button onClick={openDemo} style={{ background: "transparent", color: "white", fontWeight: "600", padding: "14px 32px", borderRadius: "12px", border: "1px solid rgba(71,85,105,1)", cursor: "pointer", fontSize: "16px", display: "inline-flex", alignItems: "center", gap: "8px", transition: "background 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(100,116,139,1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(71,85,105,1)"; }}
                >
                  Lihat Demo
                </button>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div style={{ position: "relative", width: "100%", maxWidth: "480px", margin: "0 auto" }}>
              <div style={{ position: "absolute", inset: "-4px", background: "linear-gradient(135deg, #F59E0B, #3B82F6)", borderRadius: "24px", filter: "blur(12px)", opacity: 0.2 }} />
              <div style={{ position: "relative", borderRadius: "16px", background: "#0B1120", border: "1px solid rgba(30,41,59,1)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)", overflow: "hidden", aspectRatio: "4/3", display: "flex", flexDirection: "column" }}>
                <div style={{ height: "40px", borderBottom: "1px solid rgba(30,41,59,1)", display: "flex", alignItems: "center", padding: "0 16px", gap: "8px", background: "rgba(15,23,42,0.5)" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {["#334155","#334155","#334155"].map((c,i) => <div key={i} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />)}
                  </div>
                </div>
                <div style={{ flex: 1, padding: "16px", display: "grid", gridTemplateColumns: "1fr 3fr", gap: "16px", background: "#0B1120" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ height: "32px", background: "#1E293B", borderRadius: "8px", width: "75%" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px" }}>
                      {[1,0.6,0.6,1].map((op,i) => <div key={i} style={{ height: "24px", background: i===3?"rgba(245,158,11,0.2)":"#1E293B", borderRadius: "6px", width: i===2?"67%":"100%", opacity: op, border: i===3?"1px solid rgba(245,158,11,0.3)":"none" }} />)}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", gap: "16px" }}>
                      {[{ accent: "#3B82F6" }, { accent: "#F59E0B" }].map((c,i) => (
                        <div key={i} style={{ flex: 1, height: "96px", background: "rgba(30,41,59,0.5)", borderRadius: "12px", border: "1px solid rgba(30,41,59,0.5)", padding: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${c.accent}33` }} />
                          <div>
                            <div style={{ height: "8px", width: "48px", background: "#475569", borderRadius: "4px", marginBottom: "6px" }} />
                            <div style={{ height: "16px", width: "80px", background: "#CBD5E1", borderRadius: "4px" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, background: "rgba(30,41,59,0.5)", borderRadius: "12px", border: "1px solid rgba(30,41,59,0.5)", padding: "16px" }}>
                      <div style={{ height: "12px", width: "128px", background: "#475569", borderRadius: "4px", marginBottom: "16px" }} />
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px" }}>
                        {[40,70,45,90,65,85,100].map((h,i) => <div key={i} style={{ flex: 1, background: "rgba(245,158,11,0.8)", borderRadius: "4px 4px 0 0", height: `${h}%` }} />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section id="statistik" style={{ position: "relative", zIndex: 20, maxWidth: "1200px", margin: "-64px auto 0", padding: "0 16px" }}>
        <div style={{ background: t.cardBg, borderRadius: "16px", boxShadow: dark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.10)", border: `1px solid ${t.cardBorder}`, padding: "32px", transition: "background 0.3s, border-color 0.3s" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div ref={tradersRef} style={{ textAlign: "center", padding: "0 16px", borderRight: `1px solid ${t.statBorder}` }}>
              <div style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", color: t.statValue, marginBottom: "4px", transition: "color 0.3s" }}>{traders}+</div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: t.body, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pedagang Aktif</div>
            </div>
            <div ref={stallsRef} style={{ textAlign: "center", padding: "0 16px", borderRight: `1px solid ${t.statBorder}` }}>
              <div style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", color: t.statValue, marginBottom: "4px", transition: "color 0.3s" }}>{stalls}+</div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: t.body, textTransform: "uppercase", letterSpacing: "0.08em" }}>Kios Terkelola</div>
            </div>
            <div ref={billsRef} style={{ textAlign: "center", padding: "0 16px", borderRight: `1px solid ${t.statBorder}` }}>
              <div style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", color: "#F59E0B", marginBottom: "4px" }}>{bills}%</div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: t.body, textTransform: "uppercase", letterSpacing: "0.08em" }}>Tagihan Terbayar</div>
            </div>
            <div style={{ textAlign: "center", padding: "0 16px" }}>
              <div style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", color: t.statValue, marginBottom: "4px", transition: "color 0.3s" }}>24/7</div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: t.body, textTransform: "uppercase", letterSpacing: "0.08em" }}>Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="fitur" style={{ padding: "96px 16px", background: t.sectionAlt, transition: "background 0.3s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 64px" }}>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", color: t.heading, marginBottom: "16px", letterSpacing: "-0.02em", transition: "color 0.3s" }}>
              Sistem Terpadu untuk Pengelolaan Modern
            </h2>
            <p style={{ fontSize: "18px", color: t.body, lineHeight: "1.7", transition: "color 0.3s" }}>
              Semua alat yang Anda butuhkan untuk mengelola pasar tradisional dengan standar enterprise, dalam satu dashboard terpusat.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <FeatureCard t={t} icon={<Users style={{ width: "24px", height: "24px", color: "#2563EB" }} />} title="Manajemen Pedagang" description="Kelola data pedagang secara terpusat dengan verifikasi identitas dan rekam jejak digital yang lengkap." onClick={() => navigate("/admin/traders")} />
            <FeatureCard t={t} icon={<Receipt style={{ width: "24px", height: "24px", color: "#F59E0B" }} />} title="Tagihan Digital" description="Penagihan otomatis dan pelacakan pembayaran retribusi secara real-time mengurangi tunggakan." onClick={() => navigate("/admin/billing")} />
            <FeatureCard t={t} icon={<MapIcon style={{ width: "24px", height: "24px", color: "#059669" }} />} title="Peta Kios GIS" description="Visualisasi denah pasar interaktif untuk pemantauan okupansi dan zonasi area pedagang." onClick={() => navigate("/admin/grid")} />
            <FeatureCard t={t} icon={<Truck style={{ width: "24px", height: "24px", color: "#7C3AED" }} />} title="Porter Management" description="Koordinasi porter dan layanan angkut barang secara efisien untuk kelancaran logistik." onClick={() => navigate("/admin/porter")} />
            <FeatureCard t={t} icon={<BarChart style={{ width: "24px", height: "24px", color: "#E11D48" }} />} title="Laporan & Analitik" description="Dashboard analitik real-time memberikan insight mendalam untuk pengambilan keputusan strategis." onClick={() => navigate("/admin/analytics")} />
            <FeatureCard t={t} icon={<Shield style={{ width: "24px", height: "24px", color: dark ? "#94A3B8" : "#334155" }} />} title="Audit Log" description="Rekam jejak aktivitas lengkap memastikan transparansi dan akuntabilitas sistem yang tinggi." onClick={() => navigate("/admin/audit")} />
          </div>
          <p style={{ textAlign: "center", marginTop: "28px", fontSize: "13px", color: t.body }}>
            Klik fitur di atas untuk langsung mengakses — login otomatis diarahkan.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-kerja" style={{ padding: "96px 16px", background: t.sectionWhite, borderTop: `1px solid ${t.sectionBorder}`, borderBottom: `1px solid ${t.sectionBorder}`, transition: "background 0.3s, border-color 0.3s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 64px" }}>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", color: t.heading, marginBottom: "16px", letterSpacing: "-0.02em", transition: "color 0.3s" }}>Alur Kerja Sederhana</h2>
            <p style={{ fontSize: "18px", color: t.body, lineHeight: "1.7", transition: "color 0.3s" }}>Implementasi cepat tanpa mengganggu operasional harian pasar.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "32px" }}>
            <Step t={t} number="1" title="Login & Setup" description="Akses sistem dengan kredensial aman dan konfigurasi profil pasar Anda." />
            <Step t={t} number="2" title="Kelola Data" description="Input dan migrasi data pedagang, kios, dan aset ke dalam database terpusat." />
            <Step t={t} number="3" title="Monitor & Laporan" description="Pantau operasional, terima retribusi, dan unduh laporan komprehensif harian." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "96px 16px", background: "#0F172A", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 10 }}>
          <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", border: "1px solid rgba(71,85,105,1)", borderRadius: "24px", padding: "clamp(48px, 8vw, 80px)", textAlign: "center", maxWidth: "800px", margin: "0 auto", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
            <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: "800", color: "white", marginBottom: "16px", letterSpacing: "-0.02em" }}>
              Siap Transformasi Pasar Anda?
            </h2>
            <p style={{ fontSize: "18px", color: "#94A3B8", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px", lineHeight: "1.7" }}>
              Tingkatkan efisiensi, transparansi, dan pendapatan daerah dengan SVMS Enterprise.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={goToLogin} style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "16px 48px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "18px", boxShadow: "0 8px 24px rgba(245,158,11,0.3)", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                Mulai Sekarang <ArrowRight style={{ width: "20px", height: "20px" }} />
              </button>
              <button onClick={openDemo} style={{ background: "transparent", color: "white", fontWeight: "600", padding: "16px 32px", borderRadius: "12px", border: "1px solid rgba(71,85,105,1)", cursor: "pointer", fontSize: "16px" }}>
                Lihat Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: t.footerBg, paddingTop: "64px", paddingBottom: "32px", borderTop: `1px solid ${t.footerBorder}`, transition: "background 0.3s, border-color 0.3s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "24px", marginBottom: "48px", paddingBottom: "48px", borderBottom: `1px solid ${t.footerBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ background: "#F59E0B", padding: "8px", borderRadius: "10px" }}>
                <Shield style={{ width: "24px", height: "24px", color: "#0F172A" }} />
              </div>
              <div>
                <span style={{ fontWeight: "700", fontSize: "20px", color: "white", display: "block" }}>SVMS Enterprise</span>
                <span style={{ color: t.footerLink, fontSize: "13px" }}>Sistem Manajemen Pasar Terpadu</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <a href="/pengumuman" style={{ color: t.footerLink, textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#F59E0B"}
                onMouseLeave={e => e.currentTarget.style.color = t.footerLink}
              >Pengumuman</a>
              <a href="/bantuan" style={{ color: t.footerLink, textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#F59E0B"}
                onMouseLeave={e => e.currentTarget.style.color = t.footerLink}
              >Bantuan</a>
              <a href="/privasi" style={{ color: t.footerLink, textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#F59E0B"}
                onMouseLeave={e => e.currentTarget.style.color = t.footerLink}
              >Kebijakan Privasi</a>
              <a href="/syarat" style={{ color: t.footerLink, textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#F59E0B"}
                onMouseLeave={e => e.currentTarget.style.color = t.footerLink}
              >Syarat &amp; Ketentuan</a>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <p style={{ color: t.footerCopy, fontSize: "13px" }}>SVMS Version 6.0 © 2026 Dinas Pengelolaan Pasar. All rights reserved.</p>
            <p style={{ color: t.footerCopy, fontSize: "13px" }}>Dibuat dengan bangga di Indonesia 🇮🇩</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        .nav-links { display: flex; }
        .nav-actions { display: flex; }
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-actions { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 640px) {
          #statistik > div > div { grid-template-columns: repeat(2, 1fr) !important; }
          #statistik > div > div > div { border-right: none !important; border-bottom: 1px solid ${t.statBorder}; padding: 16px; }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, description, t, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ background: t.cardBg, padding: "32px", borderRadius: "16px", border: `1px solid ${hovered ? "#F59E0B50" : t.cardBorder}`, boxShadow: hovered ? t.cardShadowHover : t.cardShadow, transform: hovered ? "translateY(-3px)" : "translateY(0)", transition: "box-shadow 0.25s, transform 0.25s, background 0.3s, border-color 0.3s", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", transition: "background 0.3s" }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: "700", color: t.heading, marginBottom: "12px", transition: "color 0.3s" }}>{title}</h3>
      <p style={{ color: t.body, lineHeight: "1.7", fontSize: "15px", transition: "color 0.3s", marginBottom: "16px" }}>{description}</p>
      {hovered && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F59E0B", fontSize: "13px", fontWeight: "600" }}>
          Lihat Modul <ChevronRight style={{ width: "14px", height: "14px" }} />
        </div>
      )}
    </div>
  );
}

function Step({ number, title, description, t }) {
  return (
    <div style={{ flex: "1", minWidth: "220px", maxWidth: "280px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 16px" }}>
      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: t.stepCircleBg, border: `6px solid ${t.stepCircleBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "800", color: "#F59E0B", marginBottom: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", transition: "background 0.3s, border-color 0.3s" }}>
        {number}
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: "700", color: t.heading, marginBottom: "12px", transition: "color 0.3s" }}>{title}</h3>
      <p style={{ color: t.body, lineHeight: "1.7", transition: "color 0.3s" }}>{description}</p>
    </div>
  );
}
