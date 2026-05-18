"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useRole } from "@/app/useRole";
import {
  LayoutDashboard,
  Grid3X3,
  Users,
  FileText,
  Package,
  CreditCard,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Bell,
  LogOut,
  UserCog,
  Megaphone,
  FileBarChart,
  AlertTriangle,
  LineChart,
  FileSignature,
  Crown,
  Briefcase,
  Eye,
  Building2,
  HardHat,
  Sparkles,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";

const ALL_NAV = [
  { href: "/admin", label: "Executive Pulse", icon: LayoutDashboard, color: "text-blue-500", roles: ["admin", "kepala_pasar", "operator", "auditor", "pemda", "petugas"] },
  { href: "/admin/grid", label: "GIS & Grid Lapak", icon: Grid3X3, color: "text-emerald-500", roles: ["admin", "kepala_pasar", "operator", "petugas"] },
  { href: "/admin/traders", label: "Data Pedagang", icon: Users, color: "text-violet-500", roles: ["admin", "kepala_pasar", "operator"] },
  { href: "/admin/siptu", label: "Manajemen SIPTU", icon: FileText, color: "text-orange-500", roles: ["admin", "kepala_pasar", "operator"] },
  { href: "/admin/billing", label: "Tagihan & Bayar", icon: CreditCard, color: "text-rose-500", roles: ["admin", "kepala_pasar", "operator", "auditor"] },
  { href: "/admin/porter", label: "Kuli Panggul", icon: Package, color: "text-cyan-500", roles: ["admin", "kepala_pasar", "operator", "petugas"] },
  { href: "/admin/contracts", label: "Kontrak Digital", icon: FileSignature, color: "text-violet-400", roles: ["admin", "kepala_pasar"] },
  { href: "/admin/audit", label: "Audit Log", icon: ShieldCheck, color: "text-gray-500", roles: ["admin", "auditor"] },
  { href: "/admin/users", label: "Manajemen Akun", icon: UserCog, color: "text-pink-500", roles: ["admin"] },
  { href: "/admin/announcements", label: "Pengumuman", icon: Megaphone, color: "text-blue-400", roles: ["admin", "kepala_pasar", "operator", "pemda", "petugas"] },
  { href: "/admin/reports", label: "Laporan Harian", icon: FileBarChart, color: "text-emerald-400", roles: ["admin", "kepala_pasar", "auditor", "pemda"] },
  { href: "/admin/analytics", label: "Analitik Real-time", icon: LineChart, color: "text-yellow-400", roles: ["admin", "kepala_pasar", "auditor", "pemda"] },
  { href: "/admin/financial", label: "Intelijen Keuangan", icon: Sparkles, color: "text-emerald-400", roles: ["admin", "kepala_pasar", "auditor"] },
];

const ROLE_META = {
  admin: { label: "Administrator", color: "bg-blue-600", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: ShieldCheck },
  kepala_pasar: { label: "Kepala Pasar", color: "bg-amber-600", badge: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: Crown },
  operator: { label: "Operator", color: "bg-emerald-600", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: Briefcase },
  auditor: { label: "Auditor", color: "bg-violet-600", badge: "bg-violet-500/20 text-violet-300 border-violet-500/30", icon: Eye },
  pemda: { label: "Dinas Pemda", color: "bg-sky-600", badge: "bg-sky-500/20 text-sky-300 border-sky-500/30", icon: Building2 },
  petugas: { label: "Petugas Lapangan", color: "bg-orange-500", badge: "bg-orange-500/20 text-orange-300 border-orange-500/30", icon: HardHat },
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, changeRole, , logout, user] = useRole();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/admin",
  );
  const [announcements, setAnnouncements] = useState([]);
  const [dismissDarurat, setDismissDarurat] = useState(false);

  useEffect(() => {
    fetch('/api/admin/announcements')
      .then(res => res.json())
      .then(data => { if (!data.error) setAnnouncements(data); })
      .catch(() => {});
  }, []);

  const activeAnnouncements = announcements.filter(a => {
    const now = new Date();
    const start = new Date(a.start_date);
    const end = a.end_date ? new Date(a.end_date) : null;
    return now >= start && (!end || now <= end);
  });

  const daruratAnn = activeAnnouncements.find(a => a.urgency === 'DARURAT');

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("svms_token") : null;
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => { logout(); navigate("/login"); };

  const filteredNavItems = ALL_NAV.filter(item => item.roles.includes(role || "petugas"));
  const roleMeta = ROLE_META[role] || ROLE_META.petugas;
  const RoleIcon = roleMeta.icon;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0E1015] to-[#1a1c29] text-white relative">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none z-0" />

      {/* Sidebar */}
      <aside
        className={twMerge(
          "flex flex-col border-r border-white/10 shadow-2xl transition-all duration-300 shrink-0 relative z-20",
          "bg-black/50 backdrop-blur-2xl",
          sidebarOpen ? "w-60" : "w-16",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-blue-500/20">
            S
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white leading-tight">SVMS v6.0</p>
              <p className="text-[10px] text-gray-500">Enterprise Edition</p>
            </div>
          )}
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div className="mx-2 mt-3 mb-1">
            <div className={twMerge("flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold", roleMeta.badge)}>
              <RoleIcon size={13} />
              <span>{roleMeta.label}</span>
            </div>
          </div>
        )}
        {!sidebarOpen && (
          <div className="flex justify-center mt-3 mb-1">
            <div className={twMerge("w-8 h-8 rounded-full flex items-center justify-center", roleMeta.color)}>
              <RoleIcon size={14} className="text-white" />
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
          {filteredNavItems.map(({ href, label, icon: Icon, color }) => {
            const active = currentPath === href || (href !== "/admin" && currentPath.startsWith(href));
            return (
              <a
                key={href}
                href={href}
                onClick={() => setCurrentPath(href)}
                className={twMerge(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group relative",
                  active
                    ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.03)] border border-white/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent",
                )}
              >
                <Icon size={17} className={twMerge("shrink-0 transition-colors", active ? color : "text-gray-500 group-hover:text-gray-300")} />
                {sidebarOpen && (
                  <span className="truncate font-medium flex-1 flex justify-between items-center">
                    {label}
                    {href === "/admin/announcements" && activeAnnouncements.length > 0 && (
                      <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {activeAnnouncements.length}
                      </span>
                    )}
                  </span>
                )}
                {sidebarOpen && active && href !== "/admin/announcements" && (
                  <ChevronRight size={13} className="ml-auto text-gray-500" />
                )}
                {!sidebarOpen && active && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-white/50" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 border-t border-white/5 pt-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm"
          >
            {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
            {sidebarOpen && <span>Tutup Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-30 shrink-0 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white md:hidden"
            >
              <Menu size={18} />
            </button>
            <p className="text-xs text-gray-500">
              🕐{" "}
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="relative flex items-center gap-2 pl-3 border-l border-white/10">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left"
              >
                <div className={twMerge("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white", roleMeta.color)}>
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold leading-none text-white">{user?.name || "User"}</p>
                  <p className="text-[9px] text-gray-500 font-medium mt-0.5">{roleMeta.label}</p>
                </div>
              </button>

              {roleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#16181F] border border-white/10 rounded-xl shadow-xl py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user?.name || "User"}</p>
                      <div className={twMerge("inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold border", roleMeta.badge)}>
                        <RoleIcon size={10} />
                        {roleMeta.label}
                      </div>
                    </div>
                    {role === "admin" && (
                      <a href="/admin/users" className="w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-white/5 transition-colors text-gray-300">
                        <UserCog size={14} className="text-gray-400" /> Kelola Akun
                      </a>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-red-500/10 transition-colors text-red-400 mt-1"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {daruratAnn && !dismissDarurat && (
          <div className="bg-red-500/20 border-b border-red-500/50 px-6 py-3 flex items-start sm:items-center justify-between shrink-0">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse shrink-0">
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-400 uppercase tracking-wide">🚨 {daruratAnn.title}</p>
                <p className="text-xs text-gray-300 mt-0.5">{daruratAnn.body}</p>
              </div>
            </div>
            <button
              onClick={() => setDismissDarurat(true)}
              className="text-xs font-semibold text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              ✕ TUTUP
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.main
            key={currentPath}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 overflow-auto p-6 relative z-10"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
