"use client";

import { useQuery } from "@tanstack/react-query";
import { useRole } from "@/app/useRole";
import { Printer, FileBarChart, Calendar as CalendarIcon, Store, DollarSign, Users, AlertCircle, Megaphone } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function DailyReportPage() {
  const [role] = useRole();

  const { data: report, isLoading } = useQuery({
    queryKey: ["daily-report"],
    queryFn: () => fetch("/api/admin/daily-report").then((r) => r.json())
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="flex justify-center p-10"><p className="text-gray-500">Menyusun Laporan Harian...</p></div>;
  }

  if (!report || report.error) {
    return (
      <div className="bg-[#1C1E27] p-10 text-center rounded-xl border border-white/5">
        <p className="text-red-400">Gagal memuat laporan harian.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Non-printable header controls */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileBarChart size={24} className="text-emerald-400" /> Executive Briefing
          </h1>
          <p className="text-sm text-gray-400 mt-1">Laporan harian komprehensif untuk direksi dan pengelola</p>
        </div>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-white text-gray-900 hover:bg-gray-200 text-sm font-bold rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95"
        >
          <Printer size={18} /> Cetak Laporan
        </button>
      </div>

      {/* Printable Report Document */}
      <div className="bg-[#1C1E27] border border-white/10 rounded-2xl p-8 sm:p-12 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none shadow-2xl">
        
        {/* Report Header */}
        <div className="border-b border-white/10 print:border-black/20 pb-8 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 print:bg-blue-600 flex items-center justify-center font-black text-xl text-white">
              S
            </div>
            <div>
              <h2 className="text-2xl font-black text-white print:text-black leading-tight">SVMS Daily Report</h2>
              <p className="text-xs text-gray-500 print:text-gray-600 tracking-widest uppercase mt-1">Steman Vendor Management System</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-sm text-gray-400 print:text-gray-600 font-semibold mb-1">
              <CalendarIcon size={16} /> 
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <p className="text-xs text-gray-500 print:text-gray-500">Dicetak oleh: {role.toUpperCase()}</p>
          </div>
        </div>

        {/* 1. Slot Activity & Revenue (Side by Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 print:bg-gray-50 border border-white/10 print:border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 text-emerald-400 print:text-emerald-600 mb-4">
              <Store size={20} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Aktivitas Slot Lapak</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 print:border-gray-200 pb-2">
                <span className="text-gray-400 print:text-gray-600">Total Lapak</span>
                <span className="font-bold text-white print:text-black">{report.slot_activity.total}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 print:border-gray-200 pb-2">
                <span className="text-gray-400 print:text-gray-600">Terisi (Occupied)</span>
                <span className="font-bold text-green-400 print:text-green-600">{report.slot_activity.occupied}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 print:border-gray-200 pb-2">
                <span className="text-gray-400 print:text-gray-600">Kosong (Vacant)</span>
                <span className="font-bold text-orange-400 print:text-orange-600">{report.slot_activity.vacant}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-400 print:text-gray-600 font-semibold">Tingkat Hunian</span>
                <span className="font-black text-xl text-white print:text-black">{report.slot_activity.occupancy_rate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 print:bg-gray-50 border border-white/10 print:border-gray-200 rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 print:bg-emerald-100 flex items-center justify-center mb-4">
              <DollarSign size={24} className="text-emerald-400 print:text-emerald-600" />
            </div>
            <p className="text-sm text-gray-400 print:text-gray-600 font-bold uppercase tracking-wider mb-2">Pendapatan Hari Ini</p>
            <p className="text-4xl font-black text-emerald-400 print:text-emerald-600">
              Rp {report.revenue.collected_today.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-gray-500 print:text-gray-500 mt-3">*Total dari seluruh tagihan yang dibayarkan pada hari ini.</p>
          </div>
        </div>

        {/* 2. New Vendors & Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 print:text-blue-600">
              <Users size={18} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Pedagang Baru</h3>
            </div>
            {report.new_vendors.length === 0 ? (
              <p className="text-sm text-gray-500 print:text-gray-500 italic">Tidak ada pedagang baru yang bergabung hari ini.</p>
            ) : (
              <div className="bg-white/5 print:bg-gray-50 border border-white/10 print:border-gray-200 rounded-xl divide-y divide-white/5 print:divide-gray-200 overflow-hidden">
                {report.new_vendors.map((v) => (
                  <div key={v.id} className="p-3 text-sm flex justify-between">
                    <span className="text-white print:text-black font-medium">{v.name}</span>
                    <span className="text-gray-500 print:text-gray-500">{v.trader_type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-400 print:text-red-600">
              <AlertCircle size={18} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Isu Kepatuhan / Sanksi</h3>
            </div>
            {report.compliance_issues.length === 0 ? (
              <p className="text-sm text-gray-500 print:text-gray-500 italic">Semua pedagang dalam status aktif dan patuh.</p>
            ) : (
              <div className="bg-white/5 print:bg-gray-50 border border-white/10 print:border-gray-200 rounded-xl divide-y divide-white/5 print:divide-gray-200 overflow-hidden">
                {report.compliance_issues.map((c) => (
                  <div key={c.id} className="p-3 text-sm flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-white print:text-black font-bold">{c.name}</span>
                      <span className={twMerge("text-[10px] px-2 py-0.5 rounded-full font-bold", c.status === 'warning' ? "bg-orange-500/20 text-orange-400 print:bg-orange-100 print:text-orange-600" : "bg-red-500/20 text-red-400 print:bg-red-100 print:text-red-600")}>
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 print:text-gray-500">Lapak ID: {c.stall_id} | Telp: {c.phone}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Pending / Active Announcements */}
        <div className="space-y-4 mt-8 pt-8 border-t border-white/10 print:border-black/20">
          <div className="flex items-center gap-2 text-violet-400 print:text-violet-600">
            <Megaphone size={18} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Pengumuman Aktif</h3>
          </div>
          {report.active_announcements.length === 0 ? (
            <p className="text-sm text-gray-500 print:text-gray-500 italic">Tidak ada pengumuman yang sedang tayang.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {report.active_announcements.map((a) => (
                <div key={a.id} className="bg-white/5 print:bg-gray-50 border border-white/10 print:border-gray-200 rounded-xl p-4 flex gap-4 items-start">
                  <div className={twMerge(
                    "text-xs font-black px-2 py-1 rounded shrink-0 w-24 text-center",
                    a.urgency === 'DARURAT' ? "bg-red-500 text-white" : 
                    a.urgency === 'PENTING' ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
                  )}>
                    {a.urgency}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white print:text-black">{a.title}</h4>
                    <p className="text-xs text-gray-400 print:text-gray-600 mt-1 line-clamp-2">{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 print:border-gray-200 text-center text-[10px] text-gray-500 print:text-gray-400">
          <p>Laporan ini digenerate secara otomatis oleh SVMS. Data bersifat final dan mengikat untuk tanggal {new Date().toLocaleDateString('id-ID')}.</p>
        </div>
      </div>
    </div>
  );
}
