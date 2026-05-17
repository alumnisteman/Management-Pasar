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
  UserCog
} from "lucide-react";
import { twMerge } from "tailwind-merge";

const navItems = [
  {
    href: "/admin",
    label: "Executive Pulse",
    icon: LayoutDashboard,
    color: "text-blue-500",
  },
  {
    href: "/admin/grid",
    label: "GIS & Grid Lapak",
    icon: Grid3X3,
    color: "text-emerald-500",
  },
  {
    href: "/admin/traders",
    label: "Data Pedagang",
    icon: Users,
    color: "text-violet-500",
  },
  {
    href: "/admin/siptu",
    label: "Manajemen SIPTU",
    icon: FileText,
    color: "text-orange-500",
  },
  {
    href: "/admin/billing",
    label: "Tagihan & Bayar",
    icon: CreditCard,
    color: "text-rose-500",
  },
  {
    href: "/admin/porter",
    label: "Kuli Panggul",
    icon: Package,
    color: "text-cyan-500",
  },
  {
    href: "/admin/audit",
    label: "Audit Log",
    icon: ShieldCheck,
    color: "text-gray-500",
  },
  {
    href: "/admin/users",
    label: "Manajemen Akun",
    icon: UserCog,
    color: "text-pink-500",
  },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, changeRole, , logout, user] = useRole();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/admin",
  );

  // Auth Guard
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("svms_token") : null;
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNavItems = navItems.filter((item) => {
    if (role !== "admin" && (item.href === "/admin/audit" || item.href === "/admin/users")) {
      return false;
    }
    return true;
  });

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
              <p className="text-sm font-bold text-white leading-tight">
                SVMS v6.0
              </p>
              <p className="text-[10px] text-gray-500">Enterprise Edition</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {filteredNavItems.map(({ href, label, icon: Icon, color }) => {
            const active = currentPath === href;
            return (
              <a
                key={href}
                href={href}
                onClick={() => setCurrentPath(href)}
                className={twMerge(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                  active
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon
                  size={18}
                  className={twMerge(
                    "shrink-0",
                    active ? color : "text-gray-500 group-hover:text-gray-300",
                  )}
                />
                {sidebarOpen && (
                  <span className="truncate font-medium">{label}</span>
                )}
                {sidebarOpen && active && (
                  <ChevronRight size={14} className="ml-auto text-gray-400" />
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
            <div className="relative flex items-center gap-2 pl-3 border-l border-white/10">
              <button 
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left"
              >
                <div className={twMerge(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white",
                  role === "admin" ? "bg-blue-600" : "bg-orange-500"
                )}>
                  {user?.name ? user.name[0].toUpperCase() : (role === "admin" ? "A" : "P")}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold leading-none text-white">{user?.name || "User"}</p>
                  <p className="text-[9px] text-gray-500 font-medium mt-0.5 capitalize">{role}</p>
                </div>
              </button>

              {roleMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setRoleMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#16181F] border border-white/10 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user?.name || "User"}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{role}</p>
                    </div>
                    
                    {role === "admin" && (
                      <a
                        href="/admin/users"
                        className="w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-white/5 transition-colors text-gray-300"
                      >
                        <UserCog size={14} className="text-gray-400" />
                        Kelola Akun
                      </a>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-red-500/10 transition-colors text-red-400 mt-1"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
