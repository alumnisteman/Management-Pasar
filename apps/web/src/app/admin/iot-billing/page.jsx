import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Droplet, 
  AlertOctagon, 
  Send, 
  Plus, 
  Activity, 
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { toast, Toaster } from "sonner";

export default function IotBillingPage() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simulator states
  const [slots, setSlots] = useState([]);
  const [simSlotId, setSimSlotId] = useState("");
  const [simType, setSimType] = useState("electricity");
  const [simValue, setSimValue] = useState(150);
  const [simCost, setSimCost] = useState(1500);

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/iot/readings");
      const data = await res.json();
      if (!data.error) {
        setReadings(data.readings || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal terhubung ke API server IoT");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await fetch("/api/admin/stall-map/data");
      const data = await res.json();
      if (!data.error) {
        setSlots(data);
        if (data.length > 0) setSimSlotId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReadings();
    fetchSlots();
  }, []);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!simSlotId) {
      toast.warning("Silakan buat slot kios terlebih dahulu.");
      return;
    }

    try {
      const res = await fetch("/api/iot/sim-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: simSlotId,
          type: simType,
          reading: parseFloat(simValue),
          cost: parseFloat(simCost)
        })
      });
      
      const data = await res.ok ? await res.json() : null;
      if (res.ok) {
        if (data.alert) {
          toast.error(data.message, { duration: 6000 });
        } else {
          toast.success(data.message || "Simulasi IoT berhasil dicatat!");
        }
        fetchReadings();
      } else {
        toast.error("Gagal mencatat simulasi.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error menjalankan simulator IoT");
    }
  };

  // Auto-fill cost helper in simulator
  useEffect(() => {
    if (simType === "electricity") {
      setSimCost(simValue * 1500); // 1500 IDR per KWh
    } else {
      setSimCost(simValue * 3000); // 3000 IDR per cubic meter
    }
  }, [simValue, simType]);

  // Aggregate charts data (last 7 entries aggregated)
  const chartData = readings.slice(0, 15).reverse().map((r, i) => ({
    name: new Date(r.recorded_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    konsumsi: r.reading,
    biaya: parseFloat(r.cost)
  }));

  const triggerWarnWA = (code, type, val, traderName) => {
    if (!traderName) {
      toast.warning("Kios ini kosong, tidak dapat mengirim peringatan WA.");
      return;
    }
    toast.success(`⚠️ WA Terkirim ke ${traderName}! Menginfokan adanya pemakaian ${type === "electricity" ? "Listrik" : "Air"} berlebih (${val}) di Kios ${code}.`);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40 backdrop-blur-md p-5 border border-white/10 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
            <Zap className="text-cyan-400" /> Utilitas IoT & Sub-Metering Tagihan
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Monitoring meteran air & listrik terpusat menggunakan sensor IoT real-time dengan proteksi lonjakan utilitas pasar.
          </p>
        </div>
        <button 
          onClick={fetchReadings}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300 transition-colors"
        >
          <Activity size={14} className="animate-pulse text-cyan-400" /> Refresh Log Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readings and charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <div className="bg-[#0e1018]/60 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-sm font-black text-white flex items-center gap-2 mb-4">
              📈 Tren Konsumsi Utilitas IoT Terbaru
            </h2>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569", borderRadius: "12px", fontSize: "11px", color: "#fff" }} />
                  <Area type="monotone" dataKey="konsumsi" stroke="#22d3ee" fillOpacity={1} fill="url(#colorCons)" strokeWidth={2} name="Nilai Bacaan" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Meter List Table */}
          <div className="bg-[#0e1018]/60 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <h2 className="text-sm font-black text-white flex items-center gap-2 mb-4">
              📋 List Pemantauan Meteran Kios Aktif
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 font-bold">
                    <th className="pb-3">Kios</th>
                    <th className="pb-3">Tipe</th>
                    <th className="pb-3">Batas Bacaan</th>
                    <th className="pb-3">Biaya Terkumpul</th>
                    <th className="pb-3">Status Alarm</th>
                    <th className="pb-3 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500">
                        Memuat data sensor utilitas...
                      </td>
                    </tr>
                  ) : readings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500">
                        Tidak ada log IoT yang terekam. Gunakan panel kanan untuk melakukan simulasi!
                      </td>
                    </tr>
                  ) : (
                    readings.map((r, i) => {
                      const isAlert = (r.type === "electricity" && r.reading > 500) || 
                                      (r.type === "water" && r.reading > 50);
                      const traderName = r.slot?.trader?.name || 
                                         slots.find(s => s.id === r.slot_id)?.trader?.name;
                      const traderPhone = r.slot?.trader?.phone || 
                                          slots.find(s => s.id === r.slot_id)?.trader?.phone;

                      return (
                        <tr key={r.id || i} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 font-bold text-white">
                            Kios {r.slot?.code || slots.find(s => s.id === r.slot_id)?.code || "N/A"}
                          </td>
                          <td className="py-3 capitalize flex items-center gap-1">
                            {r.type === "electricity" ? (
                              <><Zap size={12} className="text-yellow-400" /> Listrik</>
                            ) : (
                              <><Droplet size={12} className="text-blue-400" /> Air</>
                            )}
                          </td>
                          <td className="py-3 font-semibold text-gray-300">
                            {r.reading} {r.type === "electricity" ? "KWh" : "m³"}
                          </td>
                          <td className="py-3 text-emerald-400 font-bold">
                            Rp {parseFloat(r.cost).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3">
                            {isAlert ? (
                              <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 w-fit animate-pulse border border-red-500/20">
                                <AlertOctagon size={10} /> Lonjakan Bocor
                              </span>
                            ) : (
                              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 w-fit">
                                <CheckCircle size={10} /> Normal
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            {isAlert ? (
                              <button
                                onClick={() => triggerWarnWA(
                                  r.slot?.code || slots.find(s => s.id === r.slot_id)?.code || "N/A",
                                  r.type,
                                  `${r.reading} ${r.type === "electricity" ? "KWh" : "m³"}`,
                                  traderName
                                )}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 rounded text-[10px] flex items-center gap-1.5 mx-auto transition-colors"
                              >
                                <Send size={10} /> Kirim Alert WA
                              </button>
                            ) : (
                              <span className="text-gray-600 text-[10px] font-medium">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Real-time Simulator Panel */}
        <div className="bg-[#0e1018]/60 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-2 mb-1">
              🎮 Simulator Sensor IoT (Uji Coba)
            </h2>
            <p className="text-[11px] text-gray-500">
              Gunakan panel ini untuk menyuntikkan data sensor IoT langsung ke API server guna menguji coba peringatan darurat.
            </p>
          </div>

          <form onSubmit={handleSimulate} className="space-y-4">
            {/* Slot Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Pilih Kios Target</label>
              <select
                value={simSlotId}
                onChange={(e) => setSimSlotId(e.target.value)}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-cyan-500"
              >
                {slots.map(s => (
                  <option key={s.id} value={s.id}>
                    Kios {s.code} ({s.trader ? s.trader.name : "Kosong"})
                  </option>
                ))}
              </select>
            </div>

            {/* Type selector */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Tipe Utilitas</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSimType("electricity")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    simType === "electricity" 
                      ? "bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-lg" 
                      : "bg-white/5 border-white/5 text-gray-400"
                  }`}
                >
                  <Zap size={12} /> Listrik
                </button>
                <button
                  type="button"
                  onClick={() => setSimType("water")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    simType === "water" 
                      ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-lg" 
                      : "bg-white/5 border-white/5 text-gray-400"
                  }`}
                >
                  <Droplet size={12} /> Air
                </button>
              </div>
            </div>

            {/* Reading value slider */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase flex justify-between">
                Nilai Bacaan Sensor 
                <span className="text-cyan-400 font-black">
                  {simValue} {simType === "electricity" ? "KWh" : "m³"}
                </span>
              </label>
              <input
                type="range"
                min="1"
                max={simType === "electricity" ? "600" : "80"}
                value={simValue}
                onChange={(e) => setSimValue(e.target.value)}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-2"
              />
              <p className="text-[9px] text-gray-500 mt-1">
                💡 Listrik &gt; 500 KWh atau Air &gt; 50 m³ akan menembakkan alarm lonjakan!
              </p>
            </div>

            {/* Aggregated Cost */}
            <div className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-1">
              <span className="text-[9px] text-gray-500">Estimasi Biaya Terkumpul</span>
              <p className="text-sm font-black text-emerald-400">
                Rp {simCost.toLocaleString("id-ID")}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/10"
            >
              <Plus size={14} /> Kirim Sinyal IoT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
