"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Activity, ShieldAlert, ShieldCheck, Terminal,
  RefreshCw, Cpu, Database, HardDrive, Gauge,
  Play, AlertTriangle, CheckCircle, Network, Server,
  ArrowRight, Flame, Hourglass, Trash2
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import { useRole } from "@/app/useRole";

function RadialProgress({ percent, label, color, value, icon: Icon }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md min-w-[130px] flex-1 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 bg-white/5 blur-xl rounded-full -mr-8 -mt-8" />
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="none" 
            stroke={color} 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="text-center z-10 flex flex-col items-center">
          <Icon size={14} className="text-gray-400 mb-0.5" />
          <span className="text-lg font-black text-white leading-none">{percent}%</span>
          <span className="block text-[9px] text-gray-500 font-semibold tracking-wider uppercase mt-1">{value}</span>
        </div>
      </div>
      <span className="text-xs font-bold text-gray-300 mt-3">{label}</span>
    </motion.div>
  );
}

function ServiceCard({ name, status, description, icon: Icon, delay }) {
  const statusColors = {
    OK: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    DEGRADED: "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse",
    DOWN: "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={twMerge(
        "p-4 rounded-xl border flex items-center gap-4 bg-white/5 border-white/5 shadow-md relative overflow-hidden group hover:border-white/10 transition-colors"
      )}
    >
      <div className={twMerge(
        "p-2.5 rounded-lg shrink-0",
        status === "OK" ? "bg-emerald-500/10 text-emerald-400" : status === "DEGRADED" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
      )}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white">{name}</h4>
        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{description}</p>
      </div>
      <div className={twMerge("text-[10px] font-black uppercase px-2 py-1 rounded-md border shrink-0 tracking-widest", statusColors[status] || statusColors.DOWN)}>
        {status}
      </div>
    </motion.div>
  );
}

export default function SystemGuardPage() {
  const [role] = useRole();
  const queryClient = useQueryClient();
  const terminalEndRef = useRef(null);
  const [logs, setLogs] = useState([
    `[${new Date().toLocaleTimeString()}] 🛡️ SYSTEM GUARD v6.0 Autonomous Monitor online.`,
    `[${new Date().toLocaleTimeString()}] Loading telemetry services...`,
    `[${new Date().toLocaleTimeString()}] Listening on docker overlay network bridge.`
  ]);

  const addLog = (text) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`].slice(-40));
  };

  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Query stats every 10 seconds for real-time telemetry
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["systemGuardStats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/system-guard");
      if (!res.ok) throw new Error("Gagal mengambil data monitoring");
      return res.json();
    },
    refetchInterval: 10000,
  });

  // Handle logging of fetch events
  useEffect(() => {
    if (data) {
      addLog(`📈 Telemetry received. System: ${data.status} · DB: ${data.backend?.checks?.database === 'OK' ? 'OK' : 'DEGRADED'} · Redis: ${data.backend?.checks?.redis === 'OK' ? 'OK' : 'DEGRADED'}`);
    }
  }, [data]);

  // Mutation for manual repair / healing
  const healMutation = useMutation({
    mutationFn: async () => {
      addLog("🚀 Initiating SYSTEM GUARD autonomous repair protocol...");
      const res = await fetch("/api/admin/system-guard/heal", {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal memproses self-healing");
      }
      return res.json();
    },
    onSuccess: (resData) => {
      addLog("🧹 Cache clearance successfully processed.");
      addLog("🔄 Background queue engine restart signal issued.");
      addLog("✅ Global optimization complete. System operating within optimal params!");
      queryClient.invalidateQueries(["systemGuardStats"]);
      refetch();
    },
    onError: (err) => {
      addLog(`❌ Self-healing failed: ${err.message}`);
    }
  });

  // Simple clean logs button
  const clearConsole = () => {
    setLogs([`[${new Date().toLocaleTimeString()}] Console logs flushed. Monitoring active.`]);
  };

  // Determine system banner colors & messages
  const statusConfig = {
    OPERATIONAL: {
      title: "ALL SYSTEMS OPERATIONAL",
      subtitle: "Autonomous defense active · All containers fully responsive",
      accent: "from-emerald-500/10 to-teal-500/5 border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
      ringColor: "#10b981",
      glow: "shadow-[0_0_25px_rgba(16,185,129,0.15)]",
      icon: ShieldCheck
    },
    DEGRADED: {
      title: "SYSTEM PERFORMANCE DEGRADED",
      subtitle: "Warning flagged in service probes · Autonomous stabilization ready",
      accent: "from-amber-500/10 to-orange-500/5 border-amber-500/30 text-amber-400 bg-amber-500/5",
      ringColor: "#f59e0b",
      glow: "shadow-[0_0_25px_rgba(245,158,11,0.15)]",
      icon: AlertTriangle
    },
    CRITICAL: {
      title: "CRITICAL FAILURE IDENTIFIED",
      subtitle: "Severe connection drop or container crash · Trigger manual self-healing",
      accent: "from-red-500/10 to-rose-500/5 border-red-500/30 text-red-400 bg-red-500/5",
      ringColor: "#ef4444",
      glow: "shadow-[0_0_25px_rgba(239,68,68,0.2)]",
      icon: ShieldAlert
    }
  };

  const sysStatus = data?.status || (error ? "CRITICAL" : "OPERATIONAL");
  const config = statusConfig[sysStatus];
  const StatusIcon = config.icon;

  // Frontend metrics fallbacks
  const cpuPercent = data?.frontend?.cpu?.load ? Math.min(Math.round(data.frontend.cpu.load[0] * 100), 100) : 15;
  const ramPercent = data?.frontend?.memory?.percent || 0;
  const diskPercentStr = data?.frontend?.disk?.percent || "0%";
  const diskPercent = parseInt(diskPercentStr.replace("%", ""), 10) || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-7xl mx-auto pb-10 px-4"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-red-500/20 rounded text-red-400 animate-pulse"><Activity size={14} /></div>
            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Autonomous Center</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">SYSTEM GUARD</h1>
          <p className="text-xs text-gray-400 mt-0.5">Real-time health center & autonomous healing portal · SVMS Docker Enterprise</p>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Operator: <strong className="text-white ml-0.5">{role || "SYS_ADMIN"}</strong>
        </div>
      </div>

      {/* Main Status Bar Banner */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={twMerge(
          "bg-gradient-to-r border rounded-2xl p-5 md:p-6 flex items-start gap-4 transition-all duration-500",
          config.accent,
          config.glow
        )}
      >
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl shrink-0">
          <StatusIcon size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-black tracking-wide leading-none">{config.title}</h2>
          <p className="text-xs text-gray-300 mt-2 font-medium leading-relaxed">{config.subtitle}</p>
          <div className="mt-3 flex items-center gap-4 text-[10px] uppercase tracking-wider font-semibold text-gray-400">
            <span className="flex items-center gap-1.5"><Server size={10} /> Frontend Latency: {data?.nginx?.latency || "0ms"}</span>
            <span className="flex items-center gap-1.5"><Hourglass size={10} /> Container Uptime: {data?.frontend?.uptime || "N/A"}</span>
          </div>
        </div>
      </motion.div>

      {/* Hardware Telemetry Progress Rings */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <RadialProgress 
          percent={cpuPercent} 
          label="CPU Load Average" 
          color={config.ringColor} 
          value={`${data?.frontend?.cpu?.cores || 1} Cores`} 
          icon={Cpu}
        />
        <RadialProgress 
          percent={ramPercent} 
          label="Frontend Memory" 
          color={ramPercent > 80 ? "#ef4444" : config.ringColor} 
          value={`${data?.frontend?.memory?.used || "0GB"} / ${data?.frontend?.memory?.total || "0GB"}`} 
          icon={Gauge}
        />
        <RadialProgress 
          percent={diskPercent} 
          label="Storage Disk Capacity" 
          color={diskPercent > 90 ? "#ef4444" : config.ringColor} 
          value={`${data?.frontend?.disk?.used || "0"} / ${data?.frontend?.disk?.size || "0"}`} 
          icon={HardDrive}
        />
      </div>

      {/* Main Grid: Services and Console */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Services Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Network size={14} className="text-blue-400" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Services Integrity</h3>
          </div>
          
          <div className="space-y-3 bg-[#11131A]/30 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
            <ServiceCard 
              name="MySQL database" 
              status={data?.backend?.checks?.database === 'OK' ? 'OK' : 'DOWN'} 
              description="Primary relational transaction storage (mysql:3306)" 
              icon={Database}
              delay={0.05}
            />
            <ServiceCard 
              name="Redis Key Cache" 
              status={data?.backend?.checks?.redis === 'OK' ? 'OK' : 'DOWN'} 
              description="In-memory cache store and event queuing (redis:6379)" 
              icon={Server}
              delay={0.1}
            />
            <ServiceCard 
              name="Laravel API core" 
              status={data?.backend?.status || 'DOWN'} 
              description="Core application API and router endpoints (app:8000)" 
              icon={Activity}
              delay={0.15}
            />
            <ServiceCard 
              name="Reverb WebSocket Server" 
              status={data?.websocket || 'DOWN'} 
              description="Real-time web socket broadast event controller (app:8081)" 
              icon={Network}
              delay={0.2}
            />
            <ServiceCard 
              name="Nginx Reverse Proxy" 
              status={data?.nginx?.status || 'DOWN'} 
              description="Gateway server managing routes forwarding (port:80)" 
              icon={Server}
              delay={0.25}
            />
            <ServiceCard 
              name="Queue Event Worker" 
              status={data?.backend?.checks?.redis === 'OK' ? 'OK' : 'DOWN'} 
              description="Background job processor container (svms-worker-1)" 
              icon={RefreshCw}
              delay={0.3}
            />
          </div>
        </div>

        {/* Console logs and Self Healing Controller */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <div className="flex items-center justify-between gap-4 mb-2 px-1">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-red-400" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Realtime Guard Diagnostics</h3>
            </div>
            <button 
              onClick={clearConsole} 
              className="text-[10px] font-bold text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors border border-white/5 bg-white/5 px-2.5 py-1 rounded-md"
            >
              <Trash2 size={10} /> Clean Log
            </button>
          </div>

          <div className="flex-1 flex flex-col bg-[#08090E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">
            {/* Terminal Top Bar */}
            <div className="bg-[#12141F] px-4 py-2 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 select-none">system_guard_diagnostics.log</span>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 font-mono text-xs text-green-400 leading-relaxed overflow-y-auto space-y-1.5 max-h-[350px]">
              {logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap font-mono break-all leading-normal">
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Healing Action Button */}
          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="absolute top-0 left-0 p-8 bg-red-500/5 blur-3xl rounded-full -ml-16 -mt-16" />
            <div className="relative z-10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame size={14} className="text-red-400" /> Self-Healing Action Centre
              </h4>
              <p className="text-[11px] text-gray-400 mt-1">Clears all caches, purges compiled views, and forces an Artisan queue reboot.</p>
            </div>
            <button
              onClick={() => healMutation.mutate()}
              disabled={healMutation.isPending || isLoading}
              className={twMerge(
                "relative z-10 px-5 py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 disabled:scale-100 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 transition-all shrink-0 flex items-center justify-center gap-2",
                healMutation.isPending ? "animate-pulse" : ""
              )}
            >
              {healMutation.isPending ? (
                <>
                  <RefreshCw size={13} className="animate-spin" /> Repairing...
                </>
              ) : (
                <>
                  <Play size={13} fill="currentColor" /> Repair System
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
