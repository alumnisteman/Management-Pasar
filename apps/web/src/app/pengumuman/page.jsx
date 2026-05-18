import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Shield, ArrowLeft, Megaphone, Clock, ChevronRight,
  Bell, Calendar, Info, AlertTriangle, CheckCircle2, X, Loader2, RefreshCcw
} from "lucide-react";

const URGENCY_CONFIG = {
  INFO: { label: "Informasi", color: "#2563EB", Icon: Info },
  WARNING: { label: "Peringatan", color: "#F59E0B", Icon: AlertTriangle },
  DARURAT: { label: "Darurat", color: "#E11D48", Icon: AlertTriangle },
  SUCCESS: { label: "Pengumuman", color: "#059669", Icon: CheckCircle2 },
};

const KATEGORI_FROM_URGENCY = {
  INFO: "Informasi",
  WARNING: "Peringatan",
  DARURAT: "Darurat",
  SUCCESS: "Pengumuman",
};

function isActive(ann) {
  const now = new Date();
  const start = new Date(ann.start_date);
  const end = ann.end_date ? new Date(ann.end_date) : null;
  return now >= start && (!end || now <= end);
}

function isUpcoming(ann) {
  const now = new Date();
  const start = new Date(ann.start_date);
  return now < start;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const TABS = ["Semua", "Informasi", "Peringatan", "Darurat", "Pengumuman"];

export default function PengumumanPage() {
  const navigate = useNavigate();
  const [aktifTab, setAktifTab] = useState("Semua");
  const [buka, setBuka] = useState(null);

  const { data: rawData = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["public-announcements"],
    queryFn: () =>
      fetch("/api/admin/announcements")
        .then((r) => r.json())
        .then((arr) => {
          if (!Array.isArray(arr)) return [];
          return arr
            .filter((a) => isActive(a) || isUpcoming(a))
            .sort((a, b) => {
              const urgOrder = { DARURAT: 0, WARNING: 1, INFO: 2, SUCCESS: 3 };
              if (a.urgency !== b.urgency) return (urgOrder[a.urgency] ?? 9) - (urgOrder[b.urgency] ?? 9);
              return new Date(b.start_date) - new Date(a.start_date);
            });
        }),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const penting = rawData.filter((a) => a.urgency === "DARURAT" && isActive(a));
  const filtered =
    aktifTab === "Semua"
      ? rawData
      : rawData.filter((a) => KATEGORI_FROM_URGENCY[a.urgency] === aktifTab);

  const detail = buka ? rawData.find((a) => a.id === buka) : null;

  const countByTab = (tab) =>
    rawData.filter((a) => KATEGORI_FROM_URGENCY[a.urgency] === tab).length;

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#0F172A", minHeight: "100vh", color: "white" }}>

      {/* Detail Modal */}
      {detail && (() => {
        const cfg = URGENCY_CONFIG[detail.urgency] || URGENCY_CONFIG.INFO;
        return (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setBuka(null); }}
          >
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "16px", width: "100%", maxWidth: "600px", overflow: "hidden", boxShadow: "0 32px 64px rgba(0,0,0,0.6)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: `${cfg.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <cfg.Icon style={{ width: "18px", height: "18px", color: cfg.color }} />
                  </div>
                  <span style={{ fontSize: "11px", color: cfg.color, fontWeight: "700", background: `${cfg.color}15`, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{cfg.label}</span>
                  {detail.target_zone && detail.target_zone !== "all" && (
                    <span style={{ fontSize: "11px", color: "#64748B", background: "rgba(100,116,139,0.1)", padding: "2px 8px", borderRadius: "4px" }}>Zona: {detail.target_zone.toUpperCase()}</span>
                  )}
                </div>
                <button onClick={() => setBuka(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1E293B", borderRadius: "7px", padding: "5px", cursor: "pointer", color: "#64748B", display: "flex" }}>
                  <X style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
              <div style={{ padding: "24px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#F1F5F9", marginBottom: "12px", lineHeight: "1.4" }}>{detail.title}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Calendar style={{ width: "12px", height: "12px", color: "#475569" }} />
                    <span style={{ fontSize: "12px", color: "#475569" }}>Berlaku mulai {formatDate(detail.start_date)}</span>
                  </div>
                  {detail.end_date && (
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Clock style={{ width: "12px", height: "12px", color: "#475569" }} />
                      <span style={{ fontSize: "12px", color: "#475569" }}>s.d. {formatDate(detail.end_date)}</span>
                    </div>
                  )}
                </div>
                <p style={{ color: "#94A3B8", fontSize: "14px", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>{detail.body}</p>
              </div>
              <div style={{ padding: "16px 24px", borderTop: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#475569" }}>SVMS Enterprise — Dinas Pengelolaan Pasar</span>
                <button onClick={() => setBuka(null)} style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px" }}>Tutup</button>
              </div>
            </div>
          </div>
        );
      })()}

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
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "40px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "9999px", padding: "4px 14px", marginBottom: "16px" }}>
              <Megaphone style={{ width: "14px", height: "14px", color: "#F59E0B" }} />
              <span style={{ fontSize: "13px", color: "#F59E0B", fontWeight: "600" }}>Pengumuman Resmi</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", marginBottom: "10px", letterSpacing: "-0.02em" }}>Pengumuman Pasar</h1>
            <p style={{ color: "#94A3B8", fontSize: "15px" }}>Informasi resmi dari Dinas Pengelolaan Pasar — diperbarui secara real-time.</p>
          </div>
          <button
            onClick={() => refetch()}
            style={{ background: "rgba(30,41,59,0.5)", border: "1px solid #1E293B", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "500", marginTop: "8px" }}
          >
            <RefreshCcw style={{ width: "14px", height: "14px" }} /> Perbarui
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div style={{ textAlign: "center", padding: "64px 20px" }}>
            <Loader2 style={{ width: "32px", height: "32px", margin: "0 auto 12px", color: "#F59E0B", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "#64748B" }}>Memuat pengumuman terbaru...</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "20px 24px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "12px" }}>
            <AlertTriangle style={{ width: "18px", height: "18px", color: "#EF4444", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#FCA5A5", marginBottom: "2px" }}>Gagal memuat pengumuman</p>
              <p style={{ fontSize: "12px", color: "#94A3B8" }}>Pastikan Anda terhubung ke internet. <button onClick={() => refetch()} style={{ background: "none", border: "none", cursor: "pointer", color: "#F59E0B", fontWeight: "600", fontSize: "12px", padding: 0 }}>Coba lagi</button></p>
            </div>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Pinned Darurat */}
            {penting.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <AlertTriangle style={{ width: "15px", height: "15px", color: "#E11D48" }} />
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#E11D48", textTransform: "uppercase", letterSpacing: "0.08em" }}>Pengumuman Darurat</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {penting.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setBuka(p.id)}
                      style={{ background: "rgba(225,29,72,0.06)", border: "1px solid rgba(225,29,72,0.25)", borderRadius: "12px", padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", transition: "background 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(225,29,72,0.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(225,29,72,0.06)")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <AlertTriangle style={{ width: "18px", height: "18px", color: "#E11D48", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "700", color: "#F1F5F9", marginBottom: "3px" }}>{p.title}</div>
                          <div style={{ fontSize: "12px", color: "#64748B" }}>{formatDate(p.start_date)} · Darurat</div>
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
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setAktifTab(tab)}
                  style={{ padding: "7px 16px", borderRadius: "9999px", border: `1px solid ${aktifTab === tab ? "#F59E0B" : "#1E293B"}`, background: aktifTab === tab ? "rgba(245,158,11,0.15)" : "rgba(30,41,59,0.4)", color: aktifTab === tab ? "#F59E0B" : "#94A3B8", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
                >
                  {tab}
                  {tab !== "Semua" && countByTab(tab) > 0 && (
                    <span style={{ marginLeft: "6px", fontSize: "11px", opacity: 0.8 }}>({countByTab(tab)})</span>
                  )}
                  {tab === "Semua" && rawData.length > 0 && (
                    <span style={{ marginLeft: "6px", fontSize: "11px", opacity: 0.8 }}>({rawData.length})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Announcement List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filtered.map((ann) => {
                const cfg = URGENCY_CONFIG[ann.urgency] || URGENCY_CONFIG.INFO;
                const active = isActive(ann);
                const upcoming = isUpcoming(ann);
                return (
                  <div
                    key={ann.id}
                    onClick={() => setBuka(ann.id)}
                    style={{ background: "rgba(30,41,59,0.4)", border: "1px solid #1E293B", borderRadius: "14px", padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "16px", transition: "border-color 0.2s, background 0.2s", opacity: !active ? 0.6 : 1 }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = cfg.color + "60"; e.currentTarget.style.background = "rgba(30,41,59,0.6)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.background = "rgba(30,41,59,0.4)"; }}
                  >
                    <div style={{ width: "44px", height: "44px", borderRadius: "11px", background: `${cfg.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${cfg.color}25` }}>
                      <cfg.Icon style={{ width: "20px", height: "20px", color: cfg.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11px", color: cfg.color, fontWeight: "700", background: `${cfg.color}15`, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cfg.label}</span>
                        {upcoming && <span style={{ fontSize: "11px", color: "#64748B", background: "rgba(100,116,139,0.1)", padding: "2px 8px", borderRadius: "4px" }}>Segera</span>}
                        {ann.target_zone && ann.target_zone !== "all" && (
                          <span style={{ fontSize: "11px", color: "#64748B", background: "rgba(100,116,139,0.1)", padding: "2px 8px", borderRadius: "4px" }}>Zona: {ann.target_zone.toUpperCase()}</span>
                        )}
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#F1F5F9", marginBottom: "6px", lineHeight: "1.4" }}>{ann.title}</h3>
                      <p style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.6", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {ann.body}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "10px", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <Calendar style={{ width: "12px", height: "12px", color: "#475569" }} />
                          <span style={{ fontSize: "12px", color: "#475569" }}>Mulai {formatDate(ann.start_date)}</span>
                        </div>
                        {ann.end_date && (
                          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <Clock style={{ width: "12px", height: "12px", color: "#475569" }} />
                            <span style={{ fontSize: "12px", color: "#475569" }}>s.d. {formatDate(ann.end_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight style={{ width: "16px", height: "16px", color: "#334155", flexShrink: 0, marginTop: "4px" }} />
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "64px 20px", color: "#475569" }}>
                  <Megaphone style={{ width: "40px", height: "40px", margin: "0 auto 12px", opacity: 0.3 }} />
                  <p style={{ fontWeight: "600", marginBottom: "4px" }}>Belum ada pengumuman</p>
                  <p style={{ fontSize: "13px" }}>
                    {aktifTab === "Semua"
                      ? "Pengumuman dari Dinas akan muncul di sini."
                      : `Belum ada pengumuman untuk kategori "${aktifTab}".`}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* CTA */}
        <div style={{ marginTop: "48px", background: "linear-gradient(135deg, #1E293B, #0F172A)", border: "1px solid rgba(71,85,105,0.4)", borderRadius: "16px", padding: "32px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "4px" }}>Akses Dashboard Lengkap</h3>
            <p style={{ color: "#64748B", fontSize: "13px" }}>Kelola pedagang, tagihan, dan laporan secara real-time.</p>
          </div>
          <button onClick={() => navigate("/login")} style={{ background: "#F59E0B", color: "#0F172A", fontWeight: "700", padding: "12px 28px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
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
