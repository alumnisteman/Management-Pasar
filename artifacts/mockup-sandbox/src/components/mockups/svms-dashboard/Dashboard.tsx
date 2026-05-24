import { useState } from "react";
import {
  Shield,
  Users,
  Truck,
  Map,
  CircleCheck,
  BarChart3,
  FileText,
  Bell,
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  MoreHorizontal,
  Download,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Wallet,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { id: "dashboard", icon: Home, label: "Dashboard", active: true },
  { id: "traders", icon: Users, label: "Pedagang", badge: null },
  { id: "billing", icon: Wallet, label: "Tagihan", badge: "3" },
  { id: "grid", icon: Map, label: "Peta Kios", badge: null },
  { id: "porter", icon: Truck, label: "Porter", badge: null },
  { id: "analytics", icon: BarChart3, label: "Analitik", badge: null },
  { id: "audit", icon: Shield, label: "Audit Log", badge: null },
  { id: "reports", icon: FileText, label: "Laporan", badge: null },
];

const STATS = [
  {
    label: "Total Pedagang",
    value: "132",
    sub: "Aktif bulan ini",
    change: "+4",
    up: true,
    color: "#2563EB",
    icon: Users,
    bg: "#EFF6FF",
  },
  {
    label: "Pendapatan Bulan Ini",
    value: "Rp 52,7 jt",
    sub: "vs bulan lalu",
    change: "+8,3%",
    up: true,
    color: "#F59E0B",
    icon: Wallet,
    bg: "#FFFBEB",
  },
  {
    label: "Kepatuhan Tagihan",
    value: "97%",
    sub: "Dari 200 kios",
    change: "+2%",
    up: true,
    color: "#059669",
    icon: CircleCheck,
    bg: "#ECFDF5",
  },
  {
    label: "Kios Menunggak",
    value: "6",
    sub: "Total Rp 4,2 jt",
    change: "-2",
    up: false,
    color: "#E11D48",
    icon: AlertCircle,
    bg: "#FFF1F2",
  },
];

const TRADERS = [
  { name: "Siti Rahayu", kios: "A-12", zona: "Zona A", status: "Aktif", bayar: "Lunas", avatar: "SR" },
  { name: "Budi Santoso", kios: "B-07", zona: "Zona B", status: "Aktif", bayar: "Lunas", avatar: "BS" },
  { name: "Dewi Lestari", kios: "C-03", zona: "Zona C", status: "Aktif", bayar: "Menunggak", avatar: "DL" },
  { name: "Ahmad Fauzi", kios: "A-05", zona: "Zona A", status: "Aktif", bayar: "Lunas", avatar: "AF" },
  { name: "Rina Susanti", kios: "D-11", zona: "Zona D", status: "Kosong", bayar: "-", avatar: "RS" },
  { name: "Joko Prasetyo", kios: "B-14", zona: "Zona B", status: "Aktif", bayar: "Lunas", avatar: "JP" },
];

const AUDIT_LOGS = [
  { user: "admin", action: "Edit data pedagang A-12", module: "Pedagang", time: "09:14", icon: Users },
  { user: "petugas1", action: "Cetak tagihan bulan Juni", module: "Tagihan", time: "09:08", icon: FileText },
  { user: "admin", action: "Tambah porter baru – Suparman", module: "Porter", time: "08:55", icon: Truck },
  { user: "petugas2", action: "Konfirmasi pembayaran B-07", module: "Tagihan", time: "08:30", icon: CircleCheck },
  { user: "admin", action: "Update denah Zona C", module: "Peta Kios", time: "07:52", icon: Map },
];

const CHART_DATA = [55, 70, 45, 88, 62, 95, 78, 83, 91, 69, 74, 100];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

const GIS_GRID = [
  ["A01", "A02", "A03", "A04", "A05", "A06"],
  ["A07", "A08", "A09", "A10", "A11", "A12"],
  ["B01", "B02", "B03", "B04", "B05", "B06"],
  ["B07", "B08", "B09", "B10", "B11", "B12"],
];

const KIOS_STATUS: Record<string, "aktif" | "kosong" | "menunggak"> = {
  "A01": "aktif", "A02": "aktif", "A03": "kosong", "A04": "aktif", "A05": "aktif", "A06": "aktif",
  "A07": "aktif", "A08": "menunggak", "A09": "aktif", "A10": "aktif", "A11": "kosong", "A12": "aktif",
  "B01": "aktif", "B02": "aktif", "B03": "aktif", "B04": "menunggak", "B05": "aktif", "B06": "aktif",
  "B07": "aktif", "B08": "aktif", "B09": "kosong", "B10": "aktif", "B11": "aktif", "B12": "aktif",
};

const KIOS_COLOR = {
  aktif: { bg: "#DCFCE7", border: "#22C55E", text: "#166534" },
  kosong: { bg: "#F1F5F9", border: "#CBD5E1", text: "#64748B" },
  menunggak: { bg: "#FEE2E2", border: "#EF4444", text: "#991B1B" },
};

export function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredKios, setHoveredKios] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const maxBar = Math.max(...CHART_DATA);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", background: "#F8FAFC", overflow: "hidden" }}>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? "220px" : "64px",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
        zIndex: 20,
        boxShadow: "2px 0 20px rgba(0,0,0,0.15)",
      }}>
        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: sidebarOpen ? "20px 16px" : "20px 16px",
          borderBottom: "1px solid #1E293B",
          minHeight: "65px",
        }}>
          <div style={{ background: "#F59E0B", padding: "7px", borderRadius: "8px", flexShrink: 0 }}>
            <Shield style={{ width: "16px", height: "16px", color: "#0F172A" }} />
          </div>
          {sidebarOpen && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "white", whiteSpace: "nowrap" }}>Manajemen Pasar</div>
              <div style={{ color: "#475569", fontSize: "10px", whiteSpace: "nowrap" }}>v6.0 — Admin</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "10px 10px",
                borderRadius: "8px",
                border: "none",
                background: activeNav === item.id ? "rgba(245,158,11,0.15)" : "transparent",
                color: activeNav === item.id ? "#F59E0B" : "#64748B",
                cursor: "pointer",
                marginBottom: "2px",
                transition: "background 0.2s, color 0.2s",
                textAlign: "left",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (activeNav !== item.id) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#CBD5E1";
                }
              }}
              onMouseLeave={(e) => {
                if (activeNav !== item.id) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748B";
                }
              }}
            >
              {activeNav === item.id && (
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: "4px",
                  bottom: "4px",
                  width: "3px",
                  background: "#F59E0B",
                  borderRadius: "0 3px 3px 0",
                }} />
              )}
              <item.icon style={{ width: "18px", height: "18px", flexShrink: 0 }} />
              {sidebarOpen && (
                <span style={{ fontSize: "13px", fontWeight: "500", whiteSpace: "nowrap", flex: 1 }}>{item.label}</span>
              )}
              {sidebarOpen && item.badge && (
                <span style={{
                  background: "#EF4444",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  flexShrink: 0,
                }}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid #1E293B" }}>
          {sidebarOpen ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "#F59E0B", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#0F172A", flexShrink: 0,
              }}>AD</div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#CBD5E1", whiteSpace: "nowrap" }}>Administrator</div>
                <div style={{ fontSize: "10px", color: "#475569", whiteSpace: "nowrap" }}>admin@dispasar.go.id</div>
              </div>
              <LogOut style={{ width: "14px", height: "14px", color: "#475569", cursor: "pointer", flexShrink: 0 }} />
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "#F59E0B", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#0F172A",
              }}>AD</div>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          background: "white",
          borderBottom: "1px solid #F1F5F9",
          padding: "0 24px",
          height: "65px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748B", padding: "4px" }}
            >
              <Menu style={{ width: "20px", height: "20px" }} />
            </button>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>Dashboard</div>
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>Selamat pagi, Administrator · Senin, 24 Mei 2026</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search style={{ width: "15px", height: "15px", color: "#94A3B8", position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                placeholder="Cari pedagang, kios..."
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "7px 12px 7px 32px",
                  fontSize: "13px",
                  color: "#0F172A",
                  outline: "none",
                  width: "200px",
                }}
              />
            </div>

            {/* Notifications */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  borderRadius: "8px",
                  padding: "7px",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <Bell style={{ width: "16px", height: "16px", color: "#64748B" }} />
                <span style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "8px",
                  height: "8px",
                  background: "#EF4444",
                  borderRadius: "50%",
                  border: "2px solid white",
                }} />
              </button>
              {notifOpen && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #F1F5F9",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  width: "300px",
                  zIndex: 50,
                  overflow: "hidden",
                }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "700", fontSize: "14px", color: "#0F172A" }}>Notifikasi</span>
                    <span style={{ fontSize: "12px", color: "#F59E0B", fontWeight: "600", cursor: "pointer" }}>Tandai semua dibaca</span>
                  </div>
                  {[
                    { text: "Pedagang C-03 belum bayar tagihan Juni", time: "5 mnt lalu", type: "warn" },
                    { text: "Laporan bulanan Mei siap diunduh", time: "1 jam lalu", type: "info" },
                    { text: "3 tagihan baru dikirim via WhatsApp", time: "2 jam lalu", type: "success" },
                  ].map((n, i) => (
                    <div key={i} style={{ padding: "12px 16px", borderBottom: i < 2 ? "1px solid #F8FAFC" : "none", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: n.type === "warn" ? "#EF4444" : n.type === "info" ? "#2563EB" : "#22C55E",
                        flexShrink: 0, marginTop: "5px",
                      }} />
                      <div>
                        <div style={{ fontSize: "13px", color: "#0F172A", lineHeight: "1.4" }}>{n.text}</div>
                        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <button style={{ background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "8px", padding: "7px", cursor: "pointer" }}>
              <Settings style={{ width: "16px", height: "16px", color: "#64748B" }} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Stats cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{
                background: "white",
                borderRadius: "14px",
                border: "1px solid #F1F5F9",
                padding: "20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ background: stat.bg, padding: "10px", borderRadius: "10px" }}>
                    <stat.icon style={{ width: "20px", height: "20px", color: stat.color }} />
                  </div>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                    background: stat.up ? "#DCFCE7" : "#FEE2E2",
                    color: stat.up ? "#166534" : "#991B1B",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "3px 8px",
                    borderRadius: "100px",
                  }}>
                    {stat.up ? <TrendingUp style={{ width: "11px", height: "11px" }} /> : <TrendingDown style={{ width: "11px", height: "11px" }} />}
                    {stat.change}
                  </span>
                </div>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "#0F172A", marginBottom: "4px" }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>{stat.label}</div>
                <div style={{ fontSize: "11px", color: "#CBD5E1", marginTop: "2px" }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Row 2: Chart + GIS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

            {/* Revenue Chart */}
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #F1F5F9", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px", color: "#0F172A" }}>Pendapatan Bulanan</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8" }}>Tahun 2026 · dalam jutaan rupiah</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "6px", padding: "5px 10px", fontSize: "11px", color: "#64748B", cursor: "pointer" }}>
                    <Download style={{ width: "12px", height: "12px" }} />
                  </button>
                  <button style={{ background: "#F59E0B", border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "11px", fontWeight: "600", color: "#0F172A", cursor: "pointer" }}>
                    Export
                  </button>
                </div>
              </div>

              {/* Bar chart */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "140px" }}>
                {CHART_DATA.map((val, i) => (
                  <div
                    key={i}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%", position: "relative" }}>
                      {hoveredBar === i && (
                        <div style={{
                          position: "absolute",
                          bottom: "calc(100% + 4px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "#0F172A",
                          color: "white",
                          fontSize: "10px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                          zIndex: 10,
                        }}>
                          Rp {val / 10}M
                        </div>
                      )}
                      <div style={{
                        width: "100%",
                        height: `${(val / maxBar) * 100}%`,
                        background: i === 11 ? "#F59E0B" : hoveredBar === i ? "#FBBF24" : "#E2E8F0",
                        borderRadius: "4px 4px 0 0",
                        transition: "background 0.2s",
                        minHeight: "4px",
                      }} />
                    </div>
                    <span style={{ fontSize: "9px", color: "#94A3B8", fontWeight: "500" }}>{MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GIS Grid */}
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #F1F5F9", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px", color: "#0F172A" }}>Peta Kios GIS</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8" }}>Zona A & B · Klik kios untuk detail</div>
                </div>
                <button style={{ background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "6px", padding: "5px 10px", fontSize: "11px", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Eye style={{ width: "12px", height: "12px" }} /> Semua Zona
                </button>
              </div>

              {/* Legend */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                {[
                  { label: "Aktif", color: "#22C55E" },
                  { label: "Kosong", color: "#CBD5E1" },
                  { label: "Menunggak", color: "#EF4444" },
                ].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: l.color }} />
                    <span style={{ fontSize: "11px", color: "#64748B" }}>{l.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {GIS_GRID.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", gap: "6px" }}>
                    {row.map((kios) => {
                      const status = KIOS_STATUS[kios] || "aktif";
                      const style = KIOS_COLOR[status];
                      const isHovered = hoveredKios === kios;
                      return (
                        <div
                          key={kios}
                          onMouseEnter={() => setHoveredKios(kios)}
                          onMouseLeave={() => setHoveredKios(null)}
                          style={{
                            flex: 1,
                            background: isHovered ? style.border + "30" : style.bg,
                            border: `1px solid ${isHovered ? style.border : style.border + "80"}`,
                            borderRadius: "6px",
                            padding: "8px 4px",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.15s",
                            transform: isHovered ? "scale(1.05)" : "scale(1)",
                          }}
                        >
                          <div style={{ fontSize: "10px", fontWeight: "700", color: style.text }}>{kios}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Traders table + Audit log */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "20px" }}>

            {/* Traders table */}
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #F1F5F9", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #F8FAFC" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px", color: "#0F172A" }}>Daftar Pedagang</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8" }}>6 ditampilkan dari 132</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "6px", padding: "5px 10px", fontSize: "11px", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Filter style={{ width: "11px", height: "11px" }} /> Filter
                  </button>
                  <button style={{ background: "#F59E0B", border: "none", borderRadius: "6px", padding: "5px 14px", fontSize: "11px", fontWeight: "700", color: "#0F172A", cursor: "pointer" }}>
                    + Tambah
                  </button>
                </div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Pedagang", "Kios", "Zona", "Status", "Tagihan", ""].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRADERS.map((t, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #F8FAFC" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            background: "#F1F5F9", display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: "10px", fontWeight: "700", color: "#475569", flexShrink: 0,
                          }}>{t.avatar}</div>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A" }}>{t.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 16px", fontSize: "13px", color: "#0F172A", fontWeight: "600" }}>{t.kios}</td>
                      <td style={{ padding: "11px 16px", fontSize: "12px", color: "#64748B" }}>{t.zona}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{
                          background: t.status === "Aktif" ? "#DCFCE7" : "#F1F5F9",
                          color: t.status === "Aktif" ? "#166534" : "#64748B",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "100px",
                        }}>{t.status}</span>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{
                          background: t.bayar === "Lunas" ? "#DCFCE7" : t.bayar === "Menunggak" ? "#FEE2E2" : "#F1F5F9",
                          color: t.bayar === "Lunas" ? "#166534" : t.bayar === "Menunggak" ? "#991B1B" : "#64748B",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "100px",
                        }}>{t.bayar}</span>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                          <MoreHorizontal style={{ width: "16px", height: "16px" }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audit log */}
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #F1F5F9", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #F8FAFC" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px", color: "#0F172A" }}>Audit Log</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8" }}>Aktivitas hari ini</div>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: "4px", color: "#F59E0B", fontSize: "12px", fontWeight: "600", background: "transparent", border: "none", cursor: "pointer" }}>
                  Lihat semua <ArrowUpRight style={{ width: "13px", height: "13px" }} />
                </button>
              </div>
              <div style={{ padding: "4px 0" }}>
                {AUDIT_LOGS.map((log, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "12px 20px",
                      borderBottom: i < AUDIT_LOGS.length - 1 ? "1px solid #F8FAFC" : "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ background: "#F8FAFC", padding: "7px", borderRadius: "8px", flexShrink: 0 }}>
                      <log.icon style={{ width: "14px", height: "14px", color: "#64748B" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: "#0F172A", marginBottom: "2px" }}>{log.action}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#94A3B8" }}>@{log.user}</span>
                        <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#CBD5E1", display: "inline-block" }} />
                        <span style={{ fontSize: "11px", color: "#94A3B8", background: "#F1F5F9", padding: "1px 6px", borderRadius: "4px" }}>{log.module}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", color: "#94A3B8", flexShrink: 0, display: "flex", alignItems: "center", gap: "3px" }}>
                      <Clock style={{ width: "11px", height: "11px" }} />
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
