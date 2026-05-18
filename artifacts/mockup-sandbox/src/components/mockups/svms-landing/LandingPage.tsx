import React from "react";
import { 
  Shield, Users, Receipt, Map as MapIcon, 
  Truck, BarChart, ChevronRight, Menu, X, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-amber-500 selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-lg">
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-bold text-lg tracking-tight">SVMS Enterprise</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#fitur" className="hover:text-amber-500 transition-colors">Fitur</a>
            <a href="#statistik" className="hover:text-amber-500 transition-colors">Statistik</a>
            <a href="#tentang" className="hover:text-amber-500 transition-colors">Tentang</a>
            <a href="#login" className="hover:text-amber-500 transition-colors">Masuk</a>
          </div>

          <div className="hidden md:flex items-center">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold border-0">
              Masuk ke Dashboard
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900 pt-16">
          <div className="flex flex-col p-4 gap-4 text-slate-300 font-medium">
            <a href="#fitur" className="p-4 bg-slate-800/50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Fitur</a>
            <a href="#statistik" className="p-4 bg-slate-800/50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Statistik</a>
            <a href="#tentang" className="p-4 bg-slate-800/50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Tentang</a>
            <a href="#login" className="p-4 bg-slate-800/50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Masuk</a>
            <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold border-0 w-full py-6 text-lg">
              Masuk ke Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-900 text-white min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/svms-hero-bg.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-500 text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Sistem Manajemen Pasar Terpadu v6.0
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight text-white">
                Kelola Pasar <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Lebih Cerdas,</span> Lebih Efisien
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-xl leading-relaxed">
                Platform digitalisasi pasar tradisional untuk Dinas Pengelolaan Pasar. Terintegrasi, transparan, dan dapat diandalkan untuk kemajuan ekonomi daerah.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-6 text-lg rounded-xl transition-transform active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 hover:text-white px-8 py-6 text-lg rounded-xl transition-all">
                  Lihat Demo
                </Button>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-blue-600 rounded-[24px] blur opacity-20 animate-pulse"></div>
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
                <div className="h-10 border-b border-slate-800 flex items-center px-4 gap-2 bg-slate-900/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  </div>
                </div>
                <div className="flex-1 p-4 grid grid-cols-12 gap-4 bg-[#0B1120]">
                  {/* Sidebar Mock */}
                  <div className="col-span-3 space-y-3">
                    <div className="h-8 bg-slate-800 rounded-lg w-3/4"></div>
                    <div className="space-y-2 mt-6">
                      <div className="h-6 bg-slate-800 rounded w-full opacity-60"></div>
                      <div className="h-6 bg-slate-800 rounded w-5/6 opacity-60"></div>
                      <div className="h-6 bg-slate-800 rounded w-4/6 opacity-60"></div>
                      <div className="h-6 bg-amber-500/20 rounded w-full border border-amber-500/30"></div>
                    </div>
                  </div>
                  {/* Main Content Mock */}
                  <div className="col-span-9 space-y-4">
                    <div className="flex gap-4">
                      <div className="h-24 bg-slate-800/50 rounded-xl border border-slate-700/50 flex-1 p-3 flex flex-col justify-between">
                        <div className="w-8 h-8 rounded bg-blue-500/20"></div>
                        <div className="space-y-1.5">
                          <div className="h-2 w-12 bg-slate-600 rounded"></div>
                          <div className="h-4 w-20 bg-slate-300 rounded"></div>
                        </div>
                      </div>
                      <div className="h-24 bg-slate-800/50 rounded-xl border border-slate-700/50 flex-1 p-3 flex flex-col justify-between">
                        <div className="w-8 h-8 rounded bg-amber-500/20"></div>
                        <div className="space-y-1.5">
                          <div className="h-2 w-12 bg-slate-600 rounded"></div>
                          <div className="h-4 w-20 bg-slate-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="h-48 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                      <div className="h-3 w-32 bg-slate-600 rounded mb-4"></div>
                      <div className="flex items-end h-32 gap-2 mt-4">
                        {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-amber-500/80 rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
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
      <section id="statistik" className="relative -mt-16 z-20 container mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">500+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pedagang Aktif</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">200+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Kios Terkelola</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-1">98%</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tagihan Terbayar</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">24/7</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="fitur" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Sistem Terpadu untuk Pengelolaan Modern</h2>
            <p className="text-lg text-slate-600">Semua alat yang Anda butuhkan untuk mengelola pasar tradisional dengan standar enterprise, dalam satu dashboard terpusat.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-blue-600" />}
              title="Manajemen Pedagang"
              description="Kelola data pedagang secara terpusat dengan verifikasi identitas dan rekam jejak digital."
            />
            <FeatureCard 
              icon={<Receipt className="w-6 h-6 text-amber-500" />}
              title="Tagihan Digital"
              description="Penagihan otomatis dan pelacakan pembayaran retribusi secara real-time mengurangi tunggakan."
            />
            <FeatureCard 
              icon={<MapIcon className="w-6 h-6 text-emerald-600" />}
              title="Peta Kios GIS"
              description="Visualisasi denah pasar interaktif untuk pemantauan okupansi dan zonasi area pedagang."
            />
            <FeatureCard 
              icon={<Truck className="w-6 h-6 text-purple-600" />}
              title="Porter Management"
              description="Koordinasi porter dan layanan angkut barang secara efisien untuk kelancaran logistik."
            />
            <FeatureCard 
              icon={<BarChart className="w-6 h-6 text-rose-500" />}
              title="Laporan & Analitik"
              description="Dashboard analitik real-time memberikan insight mendalam untuk pengambilan keputusan."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-slate-700" />}
              title="Audit Log"
              description="Rekam jejak aktivitas lengkap memastikan transparansi dan akuntabilitas sistem."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Alur Kerja Sederhana</h2>
            <p className="text-lg text-slate-600">Implementasi cepat tanpa mengganggu operasional harian pasar.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-4 relative max-w-5xl mx-auto">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10"></div>

            <Step 
              number="1"
              title="Login & Setup"
              description="Akses sistem dengan kredensial aman dan konfigurasi profil pasar Anda."
            />
            <Step 
              number="2"
              title="Kelola Data"
              description="Input dan migrasi data pedagang, kios, dan aset ke dalam database terpusat."
            />
            <Step 
              number="3"
              title="Monitor & Laporan"
              description="Pantau operasional, terima retribusi, dan unduh laporan komprehensif harian."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Siap Transformasi Pasar Anda?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Tingkatkan efisiensi, transparansi, dan pendapatan daerah dengan SVMS Enterprise.
            </p>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-10 py-7 text-lg rounded-xl shadow-lg transition-transform active:scale-95">
              Mulai Gratis
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-slate-800 pb-12">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <span className="font-bold text-xl text-white block">SVMS Enterprise</span>
                <span className="text-slate-400 text-sm">Sistem Manajemen Pasar Terpadu</span>
              </div>
            </div>
            
            <div className="flex gap-6 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-amber-500 transition-colors">Bantuan</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
          
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>SVMS Version 6.0 © 2026 Dinas Pengelolaan Pasar. All rights reserved.</p>
            <p className="flex items-center gap-1">Dibuat dengan bangga di Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-slate-100 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex-1 flex flex-col items-center text-center px-4 w-full md:w-auto">
      <div className="w-24 h-24 rounded-full bg-white border-8 border-slate-50 flex items-center justify-center text-3xl font-bold text-amber-500 mb-6 shadow-sm z-10">
        {number}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
