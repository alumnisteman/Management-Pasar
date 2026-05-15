<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pesan Kuli Panggul | SVMS Market Services</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
  <script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(226, 232, 240, 0.8); }
    .btn-primary { background: #6366f1; transition: all 0.2s; }
    .btn-primary:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
  </style>
</head>
<body class="text-slate-900 min-h-screen">

  <nav class="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
        <span class="font-extrabold text-xl tracking-tight">Porter<span class="text-indigo-600">Portal</span></span>
      </div>
      <a href="/" class="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Kembali ke Beranda</a>
    </div>
  </nav>

  <main class="max-w-5xl mx-auto px-6 py-10">
    <!-- Hero Section -->
    <div class="mb-12 text-center md:text-left md:flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-3">Butuh Bantuan Membawa Barang?</h1>
        <p class="text-slate-500 max-w-xl">Layanan Kuli Panggul resmi Pasar Modern. Cepat, aman, dan tarif transparan sesuai standar manajemen.</p>
      </div>
      <button onclick="openBookingModal()" class="mt-6 md:mt-0 btn-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg">Pesan Kuli Sekarang</button>
    </div>

    <!-- Porter Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="glass-card p-6 rounded-2xl shadow-sm">
        <div class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Kuli Standby</div>
        <div class="text-3xl font-black text-slate-900" id="stat-available">0</div>
        <div class="text-xs text-green-600 font-medium mt-2">● Siap Melayani</div>
      </div>
      <div class="glass-card p-6 rounded-2xl shadow-sm">
        <div class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Tarif Mulai Dari</div>
        <div class="text-3xl font-black text-slate-900">Rp 10.000</div>
        <div class="text-xs text-slate-500 font-medium mt-2">Sesuai Kategori Berat</div>
      </div>
      <div class="glass-card p-6 rounded-2xl shadow-sm">
        <div class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Rating Kepuasan</div>
        <div class="text-3xl font-black text-slate-900">⭐ 4.9/5.0</div>
        <div class="text-xs text-indigo-600 font-medium mt-2">Kualitas Pelayanan Terjamin</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- List Column -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Personel Kuli Tersedia</h2>
          <span class="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">Real-time Update</span>
        </div>
        
        <div id="porter-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Porters injected here -->
          <div class="p-8 text-center text-slate-400 col-span-2">Memuat daftar personel...</div>
        </div>
      </div>

      <!-- Instructions Column -->
      <div class="space-y-6">
        <div class="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="text-xl font-bold mb-4">Cara Pesan Kuli</h3>
            <ul class="space-y-4">
              <li class="flex gap-3">
                <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                <p class="text-sm opacity-90">Klik tombol <b>Pesan Kuli Sekarang</b> di atas.</p>
              </li>
              <li class="flex gap-3">
                <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                <p class="text-sm opacity-90">Pilih kuli yang tersedia dan masukkan lokasi tujuan belanja Anda.</p>
              </li>
              <li class="flex gap-3">
                <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                <p class="text-sm opacity-90">Bayar sesuai tarif yang tertera setelah pekerjaan selesai.</p>
              </li>
            </ul>
          </div>
          <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        </div>

        <div class="glass-card p-6 rounded-2xl border-dashed border-2 border-slate-200">
          <h4 class="font-bold text-slate-900 mb-2 italic">Kenapa Harus Kuli Resmi?</h4>
          <p class="text-xs text-slate-500 leading-relaxed">Seluruh personel kuli panggul terdaftar di database manajemen, memiliki ID resmi, dan tarifnya diawasi untuk mencegah pungutan liar (pungli) dan menjamin keamanan barang Anda.</p>
        </div>
      </div>
    </div>
  </main>

  <!-- Modal Booking -->
  <div id="booking-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      <div class="p-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-2xl font-black text-slate-900 tracking-tight">Pesan Kuli</h3>
            <p class="text-sm text-slate-500">Tentukan lokasi tujuan Anda.</p>
          </div>
          <button onclick="closeModal()" class="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Kuli Tersedia</label>
            <select id="porter-id" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all">
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Tujuan (Toko/Blok)</label>
            <input type="text" id="target-loc" placeholder="Misal: Blok B-12 / Parkir Timur" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Kategori Berat</label>
              <select id="porter-weight" onchange="updateFee()" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all">
                <option value="Light">Ringan (< 10kg)</option>
                <option value="Medium" selected>Sedang (11-25kg)</option>
                <option value="Heavy">Berat (> 25kg)</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Ongkos (Est.)</label>
              <div class="text-xl font-black text-indigo-600 pt-2" id="porter-fee-label">Rp 15.000</div>
              <input type="hidden" id="porter-fee" value="15000">
            </div>
          </div>
          <button onclick="submitBooking()" class="w-full btn-primary text-white py-4 rounded-2xl font-bold text-lg mt-4 shadow-lg">Konfirmasi Pesanan</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const API = 'http://103.175.219.57:8001/api';
    let availablePorters = [];

    async function fetchPorters() {
      try {
        const res = await fetch(`${API}/porters`);
        const porters = await res.json();
        availablePorters = porters.filter(p => p.status === 'available');
        
        document.getElementById('stat-available').textContent = availablePorters.length;
        
        const list = document.getElementById('porter-list');
        if (availablePorters.length === 0) {
          list.innerHTML = '<div class="p-8 text-center text-slate-400 col-span-2 bg-white rounded-2xl border border-slate-100 italic text-sm">Maaf, saat ini tidak ada kuli yang tersedia. Mohon tunggu beberapa saat.</div>';
          return;
        }

        list.innerHTML = availablePorters.map(p => `
          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-xl">👤</div>
              <div>
                <div class="font-bold text-slate-900">${p.name}</div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: ${p.id_number}</div>
                <div class="text-xs text-yellow-500 font-bold mt-1">⭐ ${parseFloat(p.rating).toFixed(1)}</div>
              </div>
            </div>
            <button onclick="openBookingWithPorter(${p.id})" class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors">PILIH</button>
          </div>
        `).join('');

        const sel = document.getElementById('porter-id');
        sel.innerHTML = availablePorters.map(p => `<option value="${p.id}">${p.name} (${p.id_number})</option>`).join('');
      } catch(e) {
        console.error(e);
      }
    }

    function openBookingModal() {
      if (availablePorters.length === 0) {
        Toastify({ text: "Maaf, tidak ada kuli tersedia saat ini.", backgroundColor: "#ef4444" }).showToast();
        return;
      }
      document.getElementById('booking-modal').style.display = 'flex';
    }

    function openBookingWithPorter(id) {
      document.getElementById('porter-id').value = id;
      openBookingModal();
    }

    function closeModal() {
      document.getElementById('booking-modal').style.display = 'none';
    }

    function updateFee() {
      const wt = document.getElementById('porter-weight').value;
      let fee = 15000;
      if (wt === 'Light') fee = 10000;
      if (wt === 'Heavy') fee = 25000;
      document.getElementById('porter-fee').value = fee;
      document.getElementById('porter-fee-label').textContent = 'Rp ' + fee.toLocaleString('id-ID');
    }

    async function submitBooking() {
      const target = document.getElementById('target-loc').value;
      if (!target) {
        Toastify({ text: "Masukkan lokasi tujuan Anda!", backgroundColor: "#f59e0b" }).showToast();
        return;
      }

      const data = {
        porter_id: document.getElementById('porter-id').value,
        location_to: target,
        weight_category: document.getElementById('porter-weight').value,
        fee: document.getElementById('porter-fee').value,
        status: 'in_progress',
        customer_name: 'Pelanggan Umum'
      };

      try {
        const res = await fetch(`${API}/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (res.ok) {
          Toastify({ text: "Pesanan berhasil! Kuli akan segera menemui Anda.", backgroundColor: "#10b981" }).showToast();
          closeModal();
          fetchPorters();
        }
      } catch(e) {
        Toastify({ text: "Terjadi kesalahan koneksi.", backgroundColor: "#ef4444" }).showToast();
      }
    }

    fetchPorters();
    setInterval(fetchPorters, 30000);
  </script>
</body>
</html>
