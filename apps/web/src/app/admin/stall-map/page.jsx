import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Lock, 
  Unlock, 
  Save, 
  RefreshCw, 
  User, 
  Phone, 
  TrendingUp,
  FileText,
  AlertTriangle,
  Send,
  Trash2,
  Layers
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function StallMapPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filterZone, setFilterZone] = useState("ALL");
  const [scale, setScale] = useState(1);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stall-map");
      const data = await res.json();
      if (!data.error) {
        setSlots(data);
      } else {
        toast.error("Gagal memuat peta kios");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error menghubungkan ke API server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handlePositionChange = (id, axis, val) => {
    setSlots(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, [axis]: parseInt(val) || 0 };
      }
      return s;
    }));
  };

  const savePositions = async () => {
    try {
      const payload = {
        slots: slots.map(s => ({
          id: s.id,
          x_position: s.x_position,
          y_position: s.y_position
        }))
      };
      
      const res = await fetch("/api/admin/stall-map/update-coordinates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Tata letak berhasil disimpan!");
        setIsEditable(false);
      } else {
        toast.error(data.error || "Gagal menyimpan koordinat");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error menyimpan tata letak");
    }
  };

  const handleVacate = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin mengosongkan lapak ini? Semua asosiasi pedagang akan dihapus.")) return;
    try {
      const res = await fetch(`/api/slots/vacate/${id}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Lapak berhasil dikosongkan.");
        fetchSlots();
        setSelectedSlot(null);
      } else {
        toast.error(data.message || "Gagal mengosongkan lapak");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error mengosongkan lapak");
    }
  };

  const sendWhatsAppWarning = (trader) => {
    toast.success(`Simulasi WA Terkirim ke ${trader.name} (${trader.phone}) untuk pelunasan tagihan!`);
  };

  const filteredSlots = slots.filter(s => {
    if (filterZone === "ALL") return true;
    return s.category?.toUpperCase() === filterZone.toUpperCase() || 
           s.type?.toUpperCase() === filterZone.toUpperCase();
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors />
      
      {/* Upper Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40 backdrop-blur-md p-5 border border-white/10 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent flex items-center gap-2">
            <Layers className="text-blue-500" /> Kubah Peta Kios Interaktif
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Visualisasi 2D tata letak kios real-time, status pembayaran sewa, dan pengeditan koordinat drag-and-drop.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Zone filter */}
          <select 
            value={filterZone} 
            onChange={(e) => setFilterZone(e.target.value)}
            className="bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Semua Zona & Tipe</option>
            <option value="basah">Zona Basah</option>
            <option value="kering">Zona Kering</option>
            <option value="kuliner">Zona Kuliner</option>
            <option value="lapak">Tipe Lapak</option>
            <option value="kios">Tipe Kios</option>
          </select>

          {/* Edit toggle button */}
          <button
            onClick={() => {
              if (isEditable) {
                savePositions();
              } else {
                setIsEditable(true);
                toast.info("Mode Edit Aktif! Gunakan slider panel kanan untuk memindahkan letak kios.");
              }
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isEditable 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isEditable ? (
              <>
                <Save size={14} /> Simpan Denah
              </>
            ) : (
              <>
                <Unlock size={14} /> Edit Denah Kios
              </>
            )}
          </button>

          <button 
            onClick={fetchSlots}
            className="p-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-300"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Grid Canvas Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Visual Map Grid */}
        <div className="lg:col-span-3 bg-[#0d0f17] border border-white/10 rounded-3xl p-6 min-h-[500px] max-h-[650px] overflow-auto shadow-2xl relative">
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/5 rounded-lg text-[10px] text-gray-500 font-semibold space-y-1 z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Lunas & Aktif
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
              Menunggak Tagihan
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-500/20 border border-gray-400" />
              Kosong / Maintenance
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <RefreshCw className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <div 
              className="relative border border-dashed border-white/5 rounded-2xl bg-[#090a0f] p-4"
              style={{ 
                width: "900px", 
                height: "550px", 
                backgroundImage: "radial-gradient(#ffffff05 1px, transparent 1px)", 
                backgroundSize: "20px 20px" 
              }}
            >
              {filteredSlots.map(s => {
                const isSelected = selectedSlot?.id === s.id;
                const hasTrader = !!s.trader;
                
                // Styling based on status & billing
                let colorClass = "bg-gray-500/10 border-gray-500 text-gray-400";
                let glowClass = "";

                if (hasTrader) {
                  if (s.has_unpaid_bill) {
                    colorClass = "bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-pulse";
                    glowClass = "shadow-[0_0_10px_rgba(239,68,68,0.3)]";
                  } else {
                    colorClass = "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]";
                    glowClass = "shadow-[0_0_10px_rgba(16,185,129,0.3)]";
                  }
                }
                
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSlot(s)}
                    className={`absolute w-16 h-16 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-150 group select-none hover:scale-105 ${colorClass} ${
                      isSelected ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-black scale-110 z-20" : ""
                    }`}
                    style={{
                      left: `${s.x_position * 10}px`,
                      top: `${s.y_position * 5}px`
                    }}
                  >
                    <p className="text-[10px] font-black tracking-wider leading-none">{s.code}</p>
                    <span className="text-[8px] opacity-70 mt-1 capitalize">{s.category || s.type}</span>
                    
                    {/* Tiny user badge */}
                    {hasTrader && (
                      <span className="absolute bottom-1 right-1 bg-white/10 rounded-full p-0.5 text-[6px]">
                        👤
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Control Panel / Detail View */}
        <div className="bg-[#0e1018]/60 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
          {selectedSlot ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Info */}
              <div className="border-b border-white/5 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                      {selectedSlot.type} / {selectedSlot.category}
                    </span>
                    <h2 className="text-xl font-black mt-2 text-white flex items-center gap-1.5">
                      Kios {selectedSlot.code}
                    </h2>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    selectedSlot.trader 
                      ? (selectedSlot.has_unpaid_bill ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400")
                      : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {selectedSlot.trader 
                      ? (selectedSlot.has_unpaid_bill ? "Menunggak" : "Terisi")
                      : "Kosong"
                    }
                  </span>
                </div>
              </div>

              {/* Coordinates Editor */}
              {isEditable && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <MapPin size={12} className="text-blue-400" /> Atur Koordinat Kios
                  </h3>
                  
                  <div>
                    <label className="text-[10px] text-gray-400 flex justify-between font-medium">
                      Posisi Horisontal (X) <span>{selectedSlot.x_position}</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="80" 
                      value={selectedSlot.x_position} 
                      onChange={(e) => handlePositionChange(selectedSlot.id, "x_position", e.target.value)}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 flex justify-between font-medium">
                      Posisi Vertikal (Y) <span>{selectedSlot.y_position}</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={selectedSlot.y_position} 
                      onChange={(e) => handlePositionChange(selectedSlot.id, "y_position", e.target.value)}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Occupant Detail */}
              {selectedSlot.trader ? (
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3">
                    <h3 className="text-xs font-bold text-gray-300 flex items-center gap-1.5 border-b border-white/5 pb-2">
                      <User size={14} className="text-blue-400" /> Profil Pedagang
                    </h3>
                    
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500">Nama Lengkap</p>
                      <p className="text-xs font-bold text-white">{selectedSlot.trader.name}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500">Nomor Telepon</p>
                      <p className="text-xs font-semibold text-gray-300 flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {selectedSlot.trader.phone || "-"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500">Skor Reputasi Pedagang</p>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <TrendingUp size={12} className="text-emerald-400" /> {selectedSlot.trader.reputation} / 100
                      </p>
                    </div>
                  </div>

                  {/* Billing Card Info */}
                  <div className={`p-4 rounded-2xl border ${
                    selectedSlot.has_unpaid_bill 
                      ? "bg-red-500/10 border-red-500/20 text-red-300"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle size={16} className={selectedSlot.has_unpaid_bill ? "text-red-400" : "text-emerald-400"} />
                      <div>
                        <p className="text-xs font-bold">
                          {selectedSlot.has_unpaid_bill ? "Tagihan Belum Lunas" : "Pembayaran Aman"}
                        </p>
                        <p className="text-[10px] mt-0.5 opacity-80">
                          {selectedSlot.has_unpaid_bill 
                            ? "Terdapat tagihan sewa bulanan kios yang belum terbayar."
                            : "Seluruh tagihan utilitas dan sewa aktif pedagang lunas sempurna!"
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Group */}
                  <div className="space-y-2 pt-2">
                    {selectedSlot.has_unpaid_bill && (
                      <button
                        onClick={() => sendWhatsAppWarning(selectedSlot.trader)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-green-500/10"
                      >
                        <Send size={12} /> Kirim Peringatan WA
                      </button>
                    )}

                    <button
                      onClick={() => handleVacate(selectedSlot.id)}
                      className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={12} /> Kosongkan Kios
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-white/5 border border-white/5 border-dashed rounded-2xl">
                  <p className="text-xs font-medium text-gray-500 text-center px-4">
                    Kios ini kosong. Tidak ada pedagang aktif yang ditautkan saat ini.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                <MapPin className="text-blue-500" size={24} />
              </div>
              <h3 className="text-sm font-bold text-white">Detail Kios</h3>
              <p className="text-[11px] text-gray-500 px-4 mt-1.5">
                Klik salah satu slot kios di peta interaktif untuk melihat profil pedagang, tagihan bulanan, dan melakukan kontrol cepat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
