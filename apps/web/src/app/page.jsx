import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Shield, Users, Receipt, Map as MapIcon,
  Truck, BarChart, Menu, X, ArrowRight, Sun, Moon
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

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("svms-dark") === "true"; } catch { return false; }
  });
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

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: t.pageBg, color: t.heading, minHeight: "100vh", overflowX: "hidden", transition: "background 0.3s, color 0.3s" }}>

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

      {/* Hero Section — always dark */}
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
                <button onClick={() => document.getElementById("cara-kerja")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", color: "white", fontWeight: "600", padding: "14px 32px", borderRadius: "12px", border: "1px solid rgba(71,85,105,1)", cursor: "pointer", fontSize: "16px" }}>
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
            <FeatureCard t={t} icon={<Users style={{ width: "24px", height: "24px", color: "#2563EB" }} />} title="Manajemen Pedagang" description="Kelola data pedagang secara terpusat dengan verifikasi identitas dan rekam jejak digital yang lengkap." />
            <FeatureCard t={t} icon={<Receipt style={{ width: "24px", height: "24px", color: "#F59E0B" }} />} title="Tagihan Digital" description="Penagihan otomatis dan pelacakan pembayaran retribusi secara real-time mengurangi tunggakan." />
            <FeatureCard t={t} icon={<MapIcon style={{ width: "24px", height: "24px", color: "#059669" }} />} title="Peta Kios GIS" description="Visualisasi denah pasar interaktif untuk pemantauan okupansi dan zonasi area pedagang." />
            <FeatureCard t={t} icon={<Truck style={{ width: "24px", height: "24px", color: "#7C3AED" }} />} title="Porter Management" description="Koordinasi porter dan layanan angkut barang secara efisien untuk kelancaran logistik." />
            <FeatureCard t={t} icon={<BarChart style={{ width: "24px", height: "24px", color: "#E11D48" }} />} title="Laporan & Analitik" description="Dashboard analitik real-time memberikan insight mendalam untuk pengambilan keputusan strategis." />
            <FeatureCard t={t} icon={<Shield style={{ width: "24px", height: "24px", color: dark ? "#94A3B8" : "#334155" }} />} title="Audit Log" description="Rekam jejak aktivitas lengkap memastikan transparansi dan akuntabilitas sistem yang tinggi." />
          </div>
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

      {/* CTA Section — always dark */}
      <section style={{ padding: "96px 16px", background: "#0F172A", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 10 }}>
          <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", border: "1px solid rgba(71,85,105,1)", borderRadius: "24px", padding: "clamp(48px, 8vw, 80px)", textAlign: "center", maxWidth: "800px", margin: "0 auto", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
            <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: "800", color: "white", marginBottom: "16px", letterSpacing: "-0.02em" }}>
              Siap Transformasi Pasar Anda?
            </h2>
            <p style={{ fontSize: "18px", color: "#94A3B8", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px", lineHeight: "1.7" }}>
              Tingkatkan efisiensi, transparansi, dan pendapatan daerah dengan SVMS Enterprise.
            </p>
            <button onClick={goToLogin} style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "16px 48px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "18px", boxShadow: "0 8px 24px rgba(245,158,11,0.3)" }}>
              Mulai Sekarang
            </button>
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
            <div style={{ display: "flex", gap: "24px" }}>
              {["Bantuan","Kebijakan Privasi","Syarat & Ketentuan"].map(link => (
                <a key={link} href="#" style={{ color: t.footerLink, textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{link}</a>
              ))}
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

function FeatureCard({ icon, title, description, t }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ background: t.cardBg, padding: "32px", borderRadius: "16px", border: `1px solid ${t.cardBorder}`, boxShadow: hovered ? t.cardShadowHover : t.cardShadow, transform: hovered ? "translateY(-3px)" : "translateY(0)", transition: "box-shadow 0.25s, transform 0.25s, background 0.3s, border-color 0.3s", cursor: "default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", transition: "background 0.3s" }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: "700", color: t.heading, marginBottom: "12px", transition: "color 0.3s" }}>{title}</h3>
      <p style={{ color: t.body, lineHeight: "1.7", fontSize: "15px", transition: "color 0.3s" }}>{description}</p>
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
