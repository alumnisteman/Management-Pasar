<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SMOS – Smart Market Operating System | Future of Market Governance</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" />
  <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
  <style>
    :root {
      --primary: #6366f1; --accent: #d946ef; --bg: #020617; --card: rgba(15, 23, 42, 0.7);
      --border: rgba(51, 65, 85, 0.5); --text: #f8fafc; --muted: #94a3b8;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

    /* Animated Gradient Background */
    .bg-glow {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%);
      z-index: -1;
    }
    .glow-sphere {
      position: absolute; width: 600px; height: 600px; border-radius: 50%;
      background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
      filter: blur(100px); opacity: 0.15; animation: drift 20s infinite alternate;
    }

    @keyframes drift {
      from { transform: translate(-10%, -10%); }
      to { transform: translate(10%, 10%); }
    }

    nav {
      display: flex; justify-content: space-between; align-items: center;
      padding: 24px 8%; position: fixed; width: 100%; z-index: 1000;
      backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);
    }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: -1px; display: flex; align-items: center; gap: 10px; }
    .logo-box { width: 32px; height: 32px; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 8px; }

    .nav-links { display: flex; gap: 32px; font-size: 14px; font-weight: 500; }
    .nav-links a { color: var(--muted); text-decoration: none; transition: 0.3s; }
    .nav-links a:hover { color: var(--text); }

    .btn-login {
      background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border);
      padding: 10px 24px; border-radius: 12px; color: #fff; font-weight: 600;
      text-decoration: none; transition: 0.3s;
    }
    .btn-login:hover { background: var(--primary); border-color: var(--primary); }

    .hero {
      padding: 180px 8% 100px; text-align: center; max-width: 1000px; margin: 0 auto;
    }
    .hero h1 { font-size: 72px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; letter-spacing: -2px; }
    .hero h1 span { background: linear-gradient(to right, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { font-size: 18px; color: var(--muted); margin-bottom: 40px; line-height: 1.6; }

    .stats-container {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding: 0 8%;
      margin-bottom: 100px;
    }
    .stat-card {
      background: var(--card); border: 1px solid var(--border); padding: 32px;
      border-radius: 24px; backdrop-filter: blur(10px); text-align: center;
      transition: 0.3s;
    }
    .stat-card:hover { transform: translateY(-10px); border-color: var(--primary); }
    .stat-val { font-size: 36px; font-weight: 800; margin-bottom: 8px; color: #fff; }
    .stat-lbl { font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

    .section-title { text-align: center; margin-bottom: 60px; }
    .section-title h2 { font-size: 48px; font-weight: 800; letter-spacing: -1px; }
    .section-title p { color: var(--muted); margin-top: 10px; }

    #map-section { height: 600px; margin: 0 8% 100px; border-radius: 32px; overflow: hidden; border: 1px solid var(--border); }

    .verify-section {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(217, 70, 239, 0.1));
      margin: 0 8% 100px; padding: 80px; border-radius: 40px; border: 1px solid var(--border);
      display: flex; align-items: center; gap: 60px;
    }
    .verify-content { flex: 1; }
    .verify-box {
      flex: 1; background: var(--card); padding: 40px; border-radius: 24px; border: 1px solid var(--border);
    }
    .verify-input {
      width: 100%; padding: 18px; background: rgba(0,0,0,0.3); border: 1px solid var(--border);
      border-radius: 14px; color: #fff; font-size: 16px; margin-bottom: 20px; outline: none;
    }
    .btn-verify {
      width: 100%; padding: 18px; background: var(--primary); border: none; border-radius: 14px;
      color: #fff; font-weight: 700; font-size: 16px; cursor: pointer; transition: 0.3s;
    }
    .btn-verify:hover { transform: scale(1.02); box-shadow: 0 0 30px rgba(99, 102, 241, 0.4); }

    .result-card {
      margin-top: 24px; padding: 20px; border-radius: 16px; background: rgba(16, 185, 129, 0.1);
      border: 1px solid #10b981; display: none;
    }

    footer { padding: 60px 8%; border-top: 1px solid var(--border); text-align: center; color: var(--muted); font-size: 14px; }

    @media (max-width: 768px) {
      .hero h1 { font-size: 40px; }
      .stats-container { grid-template-columns: repeat(2, 1fr); }
      .verify-section { flex-direction: column; padding: 40px; }
    }
  </style>
</head>
<body>
  <div class="bg-glow">
    <div class="glow-sphere" style="top: 10%; left: 20%;"></div>
    <div class="glow-sphere" style="bottom: 10%; right: 10%; background: var(--accent);"></div>
  </div>

  <nav>
    <div class="logo"><div class="logo-box"></div>SM<span>OS</span></div>
    <div class="nav-links">
      <a href="#stats">Statistik</a>
      <a href="#map">GIS Peta</a>
      <a href="#verify">Verifikasi</a>
      <a href="/porter">Pesan Kuli</a>
      <a href="#about">Tentang</a>
    </div>
    <button onclick="openLoginModal()" class="btn-login" style="cursor:pointer;">ADMIN PORTAL</button>
  </nav>

  <!-- LOGIN MODAL -->
  <div id="login-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); z-index:9999; align-items:center; justify-content:center;">
    <div style="background:var(--card); border:1px solid var(--border); padding:40px; border-radius:24px; width:400px; max-width:90%; position:relative;">
      <h3 style="font-size:24px; font-weight:800; margin-bottom:8px; color:#fff;">Admin Login</h3>
      <p style="color:var(--muted); font-size:14px; margin-bottom:24px;">Masukkan kredensial Anda untuk mengakses Command Center.</p>
      
      <div style="margin-bottom:16px;">
        <label style="display:block; font-size:12px; font-weight:700; color:var(--muted); margin-bottom:8px;">EMAIL</label>
        <input type="email" id="login-email" class="verify-input" style="padding:14px; margin-bottom:0;" placeholder="admin@svms.com">
      </div>
      <div style="margin-bottom:24px;">
        <label style="display:block; font-size:12px; font-weight:700; color:var(--muted); margin-bottom:8px;">PASSWORD</label>
        <input type="password" id="login-password" class="verify-input" style="padding:14px; margin-bottom:0;" placeholder="••••••••">
      </div>
      
      <button onclick="handleLogin()" class="btn-verify" id="btn-submit-login" style="padding:14px;">MASUK</button>
      <button onclick="closeLoginModal()" style="width:100%; padding:14px; background:transparent; border:none; color:var(--muted); cursor:pointer; font-weight:600; margin-top:8px;">BATAL</button>
      <div id="login-error" style="color:var(--danger); font-size:12px; margin-top:12px; text-align:center; display:none;">Email atau Password salah!</div>
    </div>
  </div>

  <section class="hero">
    <h1>Smart Market <span>Operating System</span></h1>
    <p>Infrastruktur intelijen masa depan untuk tata kelola pasar modern. Mengintegrasikan GIS, AI, dan data real-time untuk transparansi ekonomi pasar.</p>
    <div style="display:flex; justify-content:center; gap:20px;">
      <a href="/porter" class="btn-verify" style="padding: 16px 40px; text-decoration: none; background: #fff; color: var(--primary);">Pesan Kuli Panggul</a>
      <a href="#verify" class="btn-verify" style="padding: 16px 40px; text-decoration: none;">Cek Validitas Izin</a>
    </div>
  </section>

  <section class="stats-container" id="stats">
    <div class="stat-card">
      <div class="stat-lbl">Tingkat Okupansi</div>
      <div class="stat-val" id="l-occupancy">0%</div>
      <div style="font-size: 10px; color: var(--success);">Real-time Live</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Pasar Terintegrasi</div>
      <div class="stat-val" id="l-markets">0</div>
      <div style="font-size: 10px; color: var(--muted);">Kota Ternate & Sekitarnya</div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Total Pedagang</div>
      <div class="stat-val" id="l-traders">0</div>
      <div style="font-size: 10px; color: var(--primary); display:flex; justify-content:space-between; margin-top:8px;">
        <span id="l-kios">Memuat Kios...</span>
        <span id="l-pelataran">Memuat Pelataran...</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-lbl">Volume Ekonomi</div>
      <div class="stat-val" id="l-revenue">Rp 0</div>
      <div style="font-size: 10px; color: var(--accent);">Transaksi Digital Today</div>
    </div>
  </section>

  <div class="section-title" id="map">
    <h2>Digital Twin <span>GIS Preview</span></h2>
    <p>Monitoring kepadatan dan okupansi lapak secara visual berbasis spasial.</p>
    <div style="display:inline-block; margin-top:15px; padding:8px 16px; background:rgba(99,102,241,0.1); border:1px solid var(--primary); border-radius:20px; font-size:12px; font-weight:600; color:var(--primary);">
      🕒 Beroperasi 24 Jam dengan Sistem 3 Shift (Pagi, Siang, Malam)
    </div>
  </div>

  <section id="map-section"></section>

  <section class="verify-section" id="verify">
    <div class="verify-content">
      <h2 style="font-size: 40px; font-weight: 800; margin-bottom: 20px;">Verifikasi <span>SIPTU Digital</span></h2>
      <p style="color: var(--muted); line-height: 1.6;">Pastikan pedagang yang Anda temui memiliki izin resmi yang valid. Masukkan nomor izin (SIPTU) atau scan QR Code pada kartu identitas pedagang.</p>
      <div style="margin-top: 32px; display: flex; gap: 20px; align-items: center;">
        <div style="padding: 20px; background: rgba(255,255,255,0.05); border-radius: 20px; border: 1px solid var(--border);">
          <div style="font-size: 24px;">🛡️</div>
          <div style="font-size: 11px; font-weight: 700; margin-top: 10px;">ANTI-PUNGLI</div>
        </div>
        <div style="padding: 20px; background: rgba(255,255,255,0.05); border-radius: 20px; border: 1px solid var(--border);">
          <div style="font-size: 24px;">🔒</div>
          <div style="font-size: 11px; font-weight: 700; margin-top: 10px;">DATA AMAN</div>
        </div>
      </div>
    </div>
    <div class="verify-box">
      <div class="stat-lbl" style="margin-bottom: 20px;">Cek Nomor Izin</div>
      <input type="text" class="verify-input" id="v-permit" placeholder="Contoh: SIPTU-2026-XXXX">
      <button class="btn-verify" onclick="verifyPermit()">VERIFIKASI SEKARANG</button>
      
      <div id="v-result" class="result-card">
        <div style="font-weight: 800; font-size: 18px;" id="v-name">Pedagang Valid</div>
        <div style="font-size: 13px; margin-top: 4px;" id="v-detail">Pasar Gamalama - Blok A1</div>
        <div style="font-size: 10px; font-weight: 700; margin-top: 10px; color: var(--success);" id="v-status">STATUS: AKTIF</div>
      </div>
      <div id="v-error" class="result-card" style="background: rgba(239, 68, 68, 0.1); border-color: var(--danger); color: var(--danger); font-weight: 700;">
        Izin Tidak Ditemukan atau Tidak Valid!
      </div>
    </div>
  </section>

  <footer>
    <div style="margin-bottom: 20px;"><div class="logo" style="justify-content:center;"><div class="logo-box"></div>SM<span>OS</span></div></div>
    <p>&copy; 2026 Smart Market Operating System. All Rights Reserved.</p>
    <p style="margin-top: 10px; font-size: 11px;">Powered by SVMS Enterprise v6.0</p>
  </footer>

  <script>
    const API = 'http://103.175.219.57:8001/api';

    async function initLanding() {
      // Fetch Occupancy & Stats
      try {
        const rOcc = await fetch(`${API}/market/occupancy`);
        const dOcc = await rOcc.json();
        document.getElementById('l-occupancy').textContent = dOcc.occupancy_rate + '%';
        document.getElementById('l-traders').textContent = dOcc.active.toLocaleString();
      } catch(e) {}

      try {
        const rVendors = await fetch(`${API}/vendors`);
        const dVendors = await rVendors.json();
        let kios = 0, pelataran = 0;
        const vArray = Array.isArray(dVendors) ? dVendors : (dVendors.data || []);
        vArray.forEach(v => {
          if (v.location_type === 'kios') kios++;
          else pelataran++;
        });
        document.getElementById('l-kios').innerHTML = `🏪 <b>${kios}</b> Kios`;
        document.getElementById('l-pelataran').innerHTML = `🎪 <b>${pelataran}</b> Pelataran`;
      } catch(e) {}

      try {
        const rMkt = await fetch(`${API}/market/all`);
        const dMkt = await rMkt.json();
        document.getElementById('l-markets').textContent = dMkt.length;
      } catch(e) {}

      try {
        const rPay = await fetch(`${API}/market/payments`);
        const dPay = await rPay.json();
        let total = 0; dPay.forEach(p => total += parseFloat(p.amount_paid));
        document.getElementById('l-revenue').textContent = 'Rp ' + total.toLocaleString();
      } catch(e) {}

      // Init GIS Map
      const map = new maplibregl.Map({
        container: 'map-section',
        style: {
          version: 8,
          sources: { osm: { type: 'raster', tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256 } },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
        },
        center: [127.385, 0.793], zoom: 14
      });

      map.on('load', async () => {
        const rGis = await fetch(`${API}/gis/stalls`);
        const data = await rGis.json();
        
        map.addSource('stalls', { type: 'geojson', data: data });
        map.addLayer({
          id: 'stalls-heat',
          type: 'heatmap',
          source: 'stalls',
          paint: {
            'heatmap-weight': 1,
            'heatmap-intensity': 1,
            'heatmap-radius': 20,
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(0,0,255,0)',
              0.5, 'cyan',
              1, 'lime'
            ]
          }
        });
      });
    }

    async function verifyPermit() {
      const permit = document.getElementById('v-permit').value;
      if(!permit) return;
      
      const res = await fetch(`${API}/verify-smos/${permit}`);
      const data = await res.json();
      
      const card = document.getElementById('v-result');
      const err = document.getElementById('v-error');
      
      if(res.ok) {
        card.style.display = 'block';
        err.style.display = 'none';
        document.getElementById('v-name').textContent = data.data.name;
        document.getElementById('v-detail').textContent = `${data.data.market} - Lapak ${data.data.stall}`;
        document.getElementById('v-status').textContent = `STATUS: ${data.data.status.toUpperCase()}`;
      } else {
        card.style.display = 'none';
        err.style.display = 'block';
      }
    }

    // Login Logic
    function openLoginModal() {
      // If already logged in, skip modal and go to admin
      if (localStorage.getItem('token')) {
          window.location.href = '/admin';
          return;
      }
      document.getElementById('login-modal').style.display = 'flex';
      document.getElementById('login-error').style.display = 'none';
    }

    function closeLoginModal() {
      document.getElementById('login-modal').style.display = 'none';
    }

    async function handleLogin() {
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const btn = document.getElementById('btn-submit-login');
      const err = document.getElementById('login-error');
      
      if(!email || !pass) return;
      
      btn.textContent = 'MEMVERIFIKASI...';
      err.style.display = 'none';
      
      try {
        const res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: pass })
        });
        
        const data = await res.json();
        
        const token = data.token || data.access_token;
        if (res.ok && token) {
          localStorage.setItem('token', token);
          window.location.href = '/admin';
        } else {
          err.style.display = 'block';
          btn.textContent = 'MASUK';
        }
      } catch (e) {
        err.style.display = 'block';
        err.textContent = 'Koneksi ke server gagal.';
        btn.textContent = 'MASUK';
      }
    }

    initLanding();
  </script>
</body>
</html>
