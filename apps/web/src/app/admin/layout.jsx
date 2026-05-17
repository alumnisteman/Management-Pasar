"use client";
import React, { useState, useEffect } from "react";
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
  UserCircle,
  KeyRound,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/utils/auth";

const ALL_NAV = [
  { href: "/admin",          label: "Executive Pulse",   icon: LayoutDashboard, color: "text-blue-500",   roles: ["admin", "petugas"] },
  { href: "/admin/grid",     label: "GIS & Grid Lapak",  icon: Grid3X3,          color: "text-emerald-500", roles: ["admin", "petugas"] },
  { href: "/admin/traders",  label: "Data Pedagang",     icon: Users,            color: "text-violet-500", roles: ["admin", "petugas"] },
  { href: "/admin/siptu",    label: "Manajemen SIPTU",   icon: FileText,         color: "text-orange-500", roles: ["admin"] },
  { href: "/admin/billing",  label: "Tagihan & Bayar",   icon: CreditCard,       color: "text-rose-500",   roles: ["admin", "petugas"] },
  { href: "/admin/porter",   label: "Kuli Panggul",      icon: Package,          color: "text-cyan-500",   roles: ["admin", "petugas"] },
  { href: "/admin/audit",    label: "Audit Log",         icon: ShieldCheck,      color: "text-gray-500",   roles: ["admin"] },
  { href: "/admin/users",    label: "Kelola Pengguna",   icon: KeyRound,         color: "text-indigo-500", roles: ["admin"] },
];

const ROLE_LABELS = {
  admin: { label: "Admin", bg: "bg-blue-500/15", text: "text-blue-400", dot: "bg-blue-500" },
  petugas: { label: "Petugas", bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-500" },
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/admin",
  );
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Memuat...</div>
      </div>
    );
  }

  const navItems = ALL_NAV.filter((n) => n.roles.includes(user.role));
  const roleCfg = ROLE_LABELS[user.role] || ROLE_LABELS.petugas;
  const initials = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex min-h-screen bg-[#0F1117] text-white">
      {/* Sidebar */}
      <aside
        className={twMerge(
          "flex flex-col bg-[#16181F] border-r border-white/5 transition-all duration-300 shrink-0",
          sidebarOpen ? "w-60" : "w-16",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm shrink-0">
            S
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white leading-tight">SVMS v6.0</p>
              <p className="text-[10px] text-gray-500">Enterprise Edition</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ href, label, icon: Icon, color }) => {
            const active = currentPath === href || (href !== "/admin" && currentPath.startsWith(href));
            return (
              <a
                key={href}
                href={href}
                onClick={() => setCurrentPath(href)}
                className={twMerge(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                  active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon
                  size={18}
                  className={twMerge(
                    "shrink-0",
                    active ? color : "text-gray-500 group-hover:text-gray-300",
                  )}
                />
                {sidebarOpen && <span className="truncate font-medium">{label}</span>}
                {sidebarOpen && active && (
                  <ChevronRight size={14} className="ml-auto text-gray-400" />
                )}
              </a>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-2 pb-4 border-t border-white/5 pt-4 space-y-2">
          {sidebarOpen && (
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div
                className={twMerge(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  user.role === "admin" ? "bg-blue-600" : "bg-emerald-600",
                )}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <span
                  className={twMerge(
                    "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    roleCfg.bg, roleCfg.text,
                  )}
                >
                  <span className={twMerge("w-1.5 h-1.5 rounded-full", roleCfg.dot)} />
                  {roleCfg.label}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={16} className="shrink-0" />
            {sidebarOpen && <span>Keluar</span>}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            {sidebarOpen && <span>Tutup Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#16181F] shrink-0">
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
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div
                className={twMerge(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                  user.role === "admin" ? "bg-blue-600" : "bg-emerald-600",
                )}
              >
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm text-gray-300 font-medium leading-none">{user.name}</p>
                <span
                  className={twMerge(
                    "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5",
                    roleCfg.bg, roleCfg.text,
                  )}
                >
                  <span className={twMerge("w-1.5 h-1.5 rounded-full", roleCfg.dot)} />
                  {roleCfg.label}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
