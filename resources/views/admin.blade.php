<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SVMS v6.0 Enterprise | Digital Twin Governance</title>
  
  <!-- Fonts & Icons -->
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>

  <style>
    :root {
      --bg-dark: #0b0e14;
      --bg-sidebar: #131720;
      --bg-card: #1c212c;
      --border-color: #2d3446;
      --primary: #6366f1;
      --primary-glow: rgba(99, 102, 241, 0.3);
      --accent: #8b5cf6;
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --gold: #fbbf24;
      --silver: #94a3b8;
      --bronze: #d97706;
      --sidebar-width: 280px;
      --header-height: 80px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Outfit', sans-serif;
      background: var(--bg-dark);
      color: var(--text-main);
      display: flex;
      height: 100vh;
      overflow: hidden;
      letter-spacing: -0.01em;
    }

    /* Sidebar Navigation */
    aside {
      width: var(--sidebar-width);
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      z-index: 50;
    }
    
    .brand {
      height: var(--header-height);
      display: flex; align-items: center; gap: 14px; padding: 0 24px;
      font-weight: 800; font-size: 20px; color: #fff;
      border-bottom: 1px solid var(--border-color);
    }
    .brand-logo {
      width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 20px var(--primary-glow);
    }

    .nav-group { padding: 10px 16px; flex: 1; overflow-y: auto; }
    .nav-label { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; padding: 18px 12px 8px; }
    
    .nav-link {
      display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px;
      color: var(--text-muted); text-decoration: none; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: 0.2s all ease; margin-bottom: 2px;
    }
    .nav-link:hover { background: rgba(255,255,255,0.04); color: var(--text-main); }
    .nav-link.active { 
      background: linear-gradient(90deg, var(--primary), transparent); 
      color: #fff; 
      box-shadow: inset 3px 0 0 var(--primary);
    }
    .nav-link i { width: 16px; height: 16px; }

    /* Main Container */
    main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }
    
    header {
      height: var(--header-height); background: rgba(11, 14, 20, 0.8); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color); display: flex; align-items: center;
      justify-content: space-between; padding: 0 40px; z-index: 40;
    }

    .view-container { flex: 1; overflow-y: auto; padding: 32px; scroll-behavior: smooth; }
    .view-content { max-width: 1400px; margin: 0 auto; display: none; }
    .view-content.active { display: block; animation: fadeInUp 0.4s ease forwards; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Cards & Stats */
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card {
      background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 18px;
      padding: 20px; position: relative; overflow: hidden; transition: 0.3s;
    }
    .stat-card:hover { border-color: var(--primary); transform: translateY(-3px); }
    .stat-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; }
    .stat-value { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 4px; }
    .stat-badge { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 100px; display: inline-block; }

    .panel { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; margin-bottom: 24px; }
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .panel-title { font-size: 18px; font-weight: 800; }

    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 12px 14px; font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border-color); }
    .data-table td { padding: 14px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); vertical-align: middle; }
    .data-table tr:hover td { background: rgba(255,255,255,0.015); cursor: pointer; }

    /* GIS Grid Nodes */
    .gis-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
      gap: 12px; background: rgba(0,0,0,0.2); padding: 24px; border-radius: 20px;
      border: 1px solid var(--border-color);
    }
    .slot-node {
      aspect-ratio: 1; border-radius: 12px; border: 2px solid var(--border-color);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      transition: all 0.2s ease; cursor: pointer; position: relative; padding: 6px; text-align: center;
    }
    .slot-node:hover { transform: scale(1.08); z-index: 10; border-color: var(--primary); box-shadow: 0 0 15px var(--primary-glow); }
    
    .slot-node.active-node { border-color: var(--success); background: rgba(16, 185, 129, 0.08); }
    .slot-node.overdue-node { border-color: var(--danger); background: rgba(239, 68, 68, 0.08); }
    .slot-node.maint-node { border-color: var(--warning); background: rgba(245, 158, 11, 0.08); }
    .slot-node.vacant-node { border-color: var(--silver); background: rgba(148, 163, 184, 0.04); }

    .btn {
      padding: 10px 18px; border-radius: 12px; font-weight: 700; font-size: 13px;
      cursor: pointer; border: none; display: flex; align-items: center; gap: 8px; transition: 0.2s;
    }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px var(--primary-glow); }
    .btn-ghost { background: transparent; border: 1px solid var(--border-color); color: var(--text-muted); }
    .btn-ghost:hover { background: var(--border-color); color: var(--text-main); }
    .btn-ghost.active-mode { background: var(--primary); color: #fff; border-color: var(--primary); }

    .action-btn { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: var(--bg-sidebar); border: 1px solid var(--border-color); color: var(--text-muted); cursor: pointer; transition: 0.2s; }
    .action-btn:hover { border-color: var(--text-muted); color: var(--text-main); }
    .action-btn.delete { color: var(--danger); }

    /* Modal System */
    #modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
      display: none; align-items: center; justify-content: center; z-index: 1000; opacity: 0; transition: 0.3s;
    }
    #modal-overlay.active { display: flex; opacity: 1; }
    .modal-box {
      background: var(--bg-sidebar); border: 1px solid var(--border-color);
      width: 100%; max-width: 720px; border-radius: 24px; padding: 32px;
      transform: scale(0.95); transition: 0.3s; box-shadow: 0 30px 90px rgba(0,0,0,0.6);
      max-height: 90vh; overflow-y: auto;
    }
    #modal-overlay.active .modal-box { transform: scale(1); }

    .modal-tabs { display: flex; gap: 8px; border-bottom: 1px solid var(--border-color); margin-bottom: 24px; padding-bottom: 8px; }
    .tab-btn { padding: 8px 16px; border-radius: 8px; border: none; background: transparent; color: var(--text-muted); font-weight: 700; font-size: 13px; cursor: pointer; white-space: nowrap; }
    .tab-btn.active { background: var(--primary); color: #fff; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg-dark); }
    ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
  </style>
</head>
<body>

  <!-- 8 Main Sidebar Navigation -->
  <aside id="main-sidebar">
    <div class="brand">
      <div class="brand-logo"><i data-lucide="shield-check" color="#fff" size="20"></i></div>
      <span>SVMS <span style="color:var(--primary)">V6.0</span></span>
    </div>
    
    <div class="nav-group">
      <!-- 1. OVERVIEW -->
      <div class="nav-label">Overview</div>
      <div class="nav-link active" onclick="navigate('dashboard', this)">
        <i data-lucide="layout-dashboard"></i> <span>Command Center</span>
      </div>
      <div class="nav-link" onclick="navigate('zonasi', this)">
        <i data-lucide="map"></i> <span>Market Twin (GIS)</span>
      </div>
      
      <!-- 2. MANAGEMENT -->
      <div class="nav-label">Management</div>
      <div class="nav-link" onclick="navigate('traders', this)">
        <i data-lucide="users"></i> <span>Database Pedagang</span>
      </div>
      <div class="nav-link" onclick="navigate('stalls', this)">
        <i data-lucide="grid"></i> <span>Data Lapak / Kios</span>
      </div>
      <div class="nav-link" onclick="navigate('zones', this)">
        <i data-lucide="layers"></i> <span>Zona & Blok</span>
      </div>
      <div class="nav-link" onclick="navigate('permits', this)">
        <i data-lucide="file-check"></i> <span>Manajemen SIPTU</span>
      </div>
      <div class="nav-link" onclick="navigate('porter', this)">
        <i data-lucide="package"></i> <span>Porter Logistics</span>
      </div>
      
      <!-- 3. OPERATIONS -->
      <div class="nav-label">Operations</div>
      <div class="nav-link" onclick="navigate('collection', this)">
        <i data-lucide="target"></i> <span>Collection Center</span>
      </div>
      <div class="nav-link" onclick="navigate('inspections', this)">
        <i data-lucide="qr-code"></i> <span>Pemeriksaan Lapangan</span>
      </div>
      <div class="nav-link" onclick="navigate('complaints', this)">
        <i data-lucide="message-square"></i> <span>Pengaduan & Komplain</span>
      </div>
      
      <!-- 4. FINANCE -->
      <div class="nav-label">Finance</div>
      <div class="nav-link" onclick="navigate('billing', this)">
        <i data-lucide="wallet"></i> <span>Tagihan & Bayar</span>
      </div>
      
      <!-- 5. GOVERNANCE -->
      <div class="nav-label">Governance</div>
      <div class="nav-link" onclick="navigate('approvals', this)">
        <i data-lucide="check-square"></i> <span>Approval Center</span>
      </div>
      <div class="nav-link" onclick="navigate('audit', this)">
        <i data-lucide="terminal"></i> <span>Audit Trail</span>
      </div>
    </div>
  </aside>

  <!-- Main Area -->
  <main>
    <header>
      <div style="display:flex; align-items:center; gap:16px;">
        <h2 id="view-title" style="font-size:22px; font-weight:900;">Command Center</h2>
        <div style="width:1px; height:20px; background:var(--border-color);"></div>
        <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:900; color:var(--success);">
           <span style="width:8px; height:8px; background:var(--success); border-radius:50%;"></span>
           LIVE ENTERPRISE SYSTEM ACTIVE
        </div>
      </div>
      
      <div style="display:flex; align-items:center; gap:20px;">
        <div style="position:relative;">
           <i data-lucide="search" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); width:14px;"></i>
           <input type="text" placeholder="Global Search (Trader, Stall, NIK...)" id="global-search" oninput="handleGlobalSearch(this.value)" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-color); border-radius:100px; padding:8px 14px 8px 38px; color:#fff; font-size:13px; width:260px; outline:none;">
        </div>
        <div id="header-clock" style="font-weight:700; font-size:13px; color:var(--text-muted);">00:00:00</div>
        <div style="display:flex; align-items:center; gap:10px; padding:4px 12px; background:var(--bg-card); border-radius:100px; border:1px solid var(--border-color);">
           <div style="width:28px; height:28px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:11px;">AD</div>
           <span style="font-weight:700; font-size:12px;">Super Admin</span>
        </div>
      </div>
    </header>

    <div class="view-container">

      <!-- 1. COMMAND CENTER VIEW -->
      <div id="view-dashboard" class="view-content active">
        
        <!-- Live System Telemetry Banner -->
        <div class="panel" style="background:rgba(255,255,255,0.02); border-color:var(--border-color); padding:18px 24px; margin-bottom:20px;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; font-size:12px;">
            <div>🔄 Sync: <strong id="t-sync" style="color:var(--primary)">-</strong></div>
            <div>📊 Data Hari Ini: <strong id="t-data" style="color:var(--success)">-</strong></div>
            <div>💳 Transaksi Hari Ini: <strong id="t-trx" style="color:var(--success)">-</strong></div>
            <div>👥 User Online: <strong id="t-online" style="color:var(--warning)">-</strong></div>
            <div>👮 Petugas Aktif: <strong id="t-officers" style="color:var(--primary)">-</strong></div>
            <div>⚡ System Uptime: <strong id="t-uptime" style="color:var(--success)">-</strong></div>
            <div>🛡️ Database: <strong id="t-db" style="color:var(--success)">-</strong></div>
          </div>
        </div>

        <!-- Market Health Score Ring & Breakdown -->
        <div class="panel" style="background:linear-gradient(135deg, rgba(99,102,241,0.1), rgba(28,33,44,1)); border-color:var(--primary);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div class="stat-label">Market Health Score</div>
              <div style="display:flex; align-items:baseline; gap:12px; margin-top:4px;">
                <span id="health-score-val" style="font-size:48px; font-weight:900; color:var(--success);">88</span>
                <span id="health-score-status" class="stat-badge" style="background:rgba(16,185,129,0.2); color:var(--success);">HEALTHY</span>
              </div>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; font-size:12px;">
              <div>Financial: <strong style="color:var(--success)" id="hs-fin">92</strong></div>
              <div>Occupancy: <strong style="color:var(--primary)" id="hs-occ">87</strong></div>
              <div>Cleanliness: <strong style="color:var(--warning)" id="hs-cln">84</strong></div>
              <div>Security: <strong style="color:var(--success)" id="hs-sec">91</strong></div>
              <div>Complaints: <strong style="color:var(--primary)" id="hs-cmp">86</strong></div>
              <div>Trader Activity: <strong style="color:var(--success)" id="hs-act">89</strong></div>
            </div>
          </div>
        </div>

        <!-- Expanded KPI Grid -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">Total Pedagang</div>
            <div class="stat-value" id="stat-traders">0</div>
            <div style="font-size:11px; color:var(--text-muted);" id="stat-traders-sub">Aktif: 0 | Nonaktif: 0</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Lapak / Kios</div>
            <div class="stat-value" id="stat-stalls">0</div>
            <div style="font-size:11px; color:var(--text-muted);" id="stat-stalls-sub">Okupansi: 0%</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Pendapatan Hari Ini</div>
            <div class="stat-value" id="stat-rev-today" style="color:var(--success)">Rp 0</div>
            <div style="font-size:11px; color:var(--text-muted);" id="stat-rev-month">Bulan Ini: Rp 0</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Piutang</div>
            <div class="stat-value" id="stat-arrears" style="color:var(--danger)">Rp 0</div>
            <div style="font-size:11px; color:var(--text-muted);">Tertunggak > 30 hari</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:28px;">
          <div class="panel">
            <div class="panel-header"><div class="panel-title">Revenue Forecast & Analytics</div></div>
            <canvas id="mainChart" style="max-height:300px;"></canvas>
          </div>
          <div class="panel">
            <div class="panel-header"><div class="panel-title">Live Alert Stream</div></div>
            <div id="live-alert-stream" style="display:flex; flex-direction:column; gap:12px;"></div>
          </div>
        </div>
      </div>

      <!-- 2. MARKET TWIN GIS (5 MAP MODES & 15 GIS LAYERS) -->
      <div id="view-zonasi" class="view-content">
        <div class="panel">
          <div class="panel-header" style="flex-direction:column; align-items:flex-start; gap:16px;">
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
              <div>
                <div class="panel-title">Market Digital Twin (5 Map Modes & 15 GIS Layers)</div>
                <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">Klik Node Lapak (misal: <strong>A-023</strong>) untuk membuka 360° Digital Twin Detail Modal</p>
              </div>
              <button class="btn btn-primary" onclick="open360StallTwinModal('A-023')"><i data-lucide="box"></i> Sample Lapak A-023</button>
            </div>

            <!-- 5 Map Mode Toggles -->
            <div style="display:flex; gap:8px; overflow-x:auto; width:100%; padding-bottom:4px;">
              <button class="btn btn-ghost active-mode" id="mm-grid" onclick="switchMapMode('2D_GRID_LAYOUT', this)">📐 2D Grid Layout</button>
              <button class="btn btn-ghost" id="mm-heat" onclick="switchMapMode('HEATMAP_OCCUPANCY', this)">🔥 Occupancy Heatmap</button>
              <button class="btn btn-ghost" id="mm-risk" onclick="switchMapMode('FINANCIAL_ARREARS_MAP', this)">⚠️ Arrears Risk Map</button>
              <button class="btn btn-ghost" id="mm-comm" onclick="switchMapMode('COMMODITY_ZONE_MAP', this)">🥬 Commodity Zones</button>
              <button class="btn btn-ghost" id="mm-infra" onclick="switchMapMode('INFRASTRUCTURE_FACILITIES', this)">🛠️ Facilities Layer</button>
            </div>

            <!-- 15 GIS Layer Checkboxes -->
            <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:11px; background:rgba(0,0,0,0.2); padding:12px 16px; border-radius:12px; border:1px solid var(--border-color); width:100%;">
              <span style="font-weight:800; color:var(--primary); display:flex; align-items:center; margin-right:6px;">15 GIS LAYERS:</span>
              <label><input type="checkbox" checked onchange="toggleGISLayer('lapak', this.checked)"> 🏬 Lapak</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('pedagang', this.checked)"> 👤 Pedagang</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('komoditas', this.checked)"> 🥬 Komoditas</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('piutang', this.checked)"> 💰 Piutang</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('occupancy', this.checked)"> 📊 Occupancy</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('cctv', this.checked)"> 📹 CCTV</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('hydrant', this.checked)"> 🚰 Hydrant</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('apar', this.checked)"> 🧯 APAR</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('toilet', this.checked)"> 🚻 Toilet</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('tempat_sampah', this.checked)"> 🗑️ Tempat Sampah</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('jalan', this.checked)"> 🚶 Jalan</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('parkir', this.checked)"> 🅿️ Parkir</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('gudang', this.checked)"> 📦 Gudang</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('listrik', this.checked)"> ⚡ Listrik</label>
              <label><input type="checkbox" checked onchange="toggleGISLayer('air', this.checked)"> 💧 Air</label>
            </div>
          </div>
          <div id="gis-grid-container" class="gis-grid"></div>
        </div>
      </div>

      <!-- 3. DATABASE PEDAGANG (WITH 360° MODAL TRIGGER) -->
      <div id="view-traders" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Database Pedagang (360° Trader Profiles)</div>
            <button class="btn btn-primary" onclick="openTraderModal()"><i data-lucide="user-plus"></i> Tambah Pedagang</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Profile & NIK</th>
                <th>Kontak</th>
                <th>Jenis Dagangan</th>
                <th>Status</th>
                <th style="text-align:right;">Aksi</th>
              </tr>
            </thead>
            <tbody id="trader-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 4. DATA LAPAK / KIOS -->
      <div id="view-stalls" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Data Lapak / Kios Lifecycle</div>
            <button class="btn btn-primary" onclick="alert('Form Lapak Baru')"><i data-lucide="plus"></i> Tambah Lapak</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Kode Lapak</th>
                <th>Status</th>
                <th style="text-align:right;">Aksi</th>
              </tr>
            </thead>
            <tbody id="stall-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 5. ZONA & BLOK -->
      <div id="view-zones" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Zona & Blok Management</div>
            <button class="btn btn-primary" onclick="openBlockModal()"><i data-lucide="plus"></i> Tambah Blok</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Kode Blok</th>
                <th>Nama Blok / Zona</th>
                <th>Lantai</th>
                <th>Kapasitas</th>
              </tr>
            </thead>
            <tbody id="zones-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 6. MANAJEMEN SIPTU -->
      <div id="view-permits" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Manajemen SIPTU (Surat Izin Penempatan Tempat Usaha)</div>
            <button class="btn btn-primary" onclick="openPermitModal()"><i data-lucide="file-plus"></i> Terbitkan SIPTU</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Pedagang</th>
                <th>No SIPTU</th>
                <th>Status Izin</th>
                <th>Masa Berlaku</th>
                <th style="text-align:right;">QR payload</th>
              </tr>
            </thead>
            <tbody id="permits-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 7. PORTER LOGISTICS -->
      <div id="view-porter" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Porter Logistics & Smart Dispatch</div>
            <button class="btn btn-ghost" onclick="fetchPorter()">Refresh Porter</button>
          </div>
          <div id="porter-cards-container" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;"></div>
        </div>
      </div>

      <!-- 8. COLLECTION CENTER -->
      <div id="view-collection" class="view-content">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Collection Center & Piutang Aging</div></div>
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-label">0 – 30 Hari</div>
              <div class="stat-value" id="cc-30" style="color:var(--warning)">Rp 35 Jt</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">31 – 60 Hari</div>
              <div class="stat-value" id="cc-60" style="color:var(--warning)">Rp 18 Jt</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">61 – 90 Hari</div>
              <div class="stat-value" id="cc-90" style="color:var(--danger)">Rp 12 Jt</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">> 90 Hari</div>
              <div class="stat-value" id="cc-over90" style="color:var(--danger)">Rp 27 Jt</div>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Pedagang</th>
                <th>No Lapak</th>
                <th>Tunggakan</th>
                <th>Umur Piutang</th>
                <th style="text-align:right;">Tindakan</th>
              </tr>
            </thead>
            <tbody id="collection-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 9. PEMERIKSAAN LAPANGAN -->
      <div id="view-inspections" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Pemeriksaan Lapangan (Mobile Inspections)</div>
            <button class="btn btn-primary" onclick="openInspectionModal()"><i data-lucide="plus"></i> Input Inspeksi</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Lapak & Pedagang</th>
                <th>Inspector</th>
                <th>Kebersihan</th>
                <th>Keamanan</th>
                <th>Verifikasi Bayar</th>
              </tr>
            </thead>
            <tbody id="inspections-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 10. PENGADUAN & KOMPLAIN -->
      <div id="view-complaints" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Pengaduan & Komplain (Helpdesk SLA Tracker)</div>
            <button class="btn btn-primary" onclick="openComplaintModal()"><i data-lucide="plus"></i> Buat Tiket</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>No Tiket / Judul</th>
                <th>Pelapor</th>
                <th>Kategori</th>
                <th>Prioritas</th>
                <th>Status SLA</th>
              </tr>
            </thead>
            <tbody id="complaints-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 11. TAGIHAN & BAYAR (FINANCE) -->
      <div id="view-billing" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Tagihan, Pembayaran & Rekonsiliasi Keuangan</div>
            <button class="btn btn-primary" onclick="generateBills()"><i data-lucide="refresh-cw"></i> Generate Tagihan Bulanan</button>
          </div>
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-label">Total Tagihan</div>
              <div class="stat-value" id="fin-billed">Rp 0</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Terbayar</div>
              <div class="stat-value" id="fin-paid" style="color:var(--success)">Rp 0</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Collection Rate</div>
              <div class="stat-value" id="fin-rate" style="color:var(--primary)">0%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 12. APPROVAL CENTER -->
      <div id="view-approvals" class="view-content">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Approval Center</div></div>
          <div id="approval-cards-container" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px;"></div>
        </div>
      </div>

      <!-- 13. AUDIT TRAIL -->
      <div id="view-audit" class="view-content">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">System Security & Incident Stream</div></div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Reporter / User</th>
                <th>Tipe Insiden</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="audit-table-body"></tbody>
          </table>
        </div>
      </div>

    </div>
  </main>

  <!-- Global Modal Overlay -->
  <div id="modal-overlay">
    <div class="modal-box" id="modal-content"></div>
  </div>

  <script>
    const API_BASE = '/api';
    let currentMapMode = '2D_GRID_LAYOUT';
    let activeGISLayers = {
      lapak: true, pedagang: true, komoditas: true, piutang: true, occupancy: true,
      cctv: true, hydrant: true, apar: true, toilet: true, tempat_sampah: true,
      jalan: true, parkir: true, gudang: true, listrik: true, air: true
    };

    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      startTime();
      loadView('dashboard');
    });

    function startTime() {
      setInterval(() => {
        const now = new Date();
        document.getElementById('header-clock').textContent = now.toLocaleTimeString('id-ID', { hour12: false });
      }, 1000);
    }

    function navigate(view, el) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      el.classList.add('active');
      document.querySelectorAll('.view-content').forEach(v => v.classList.remove('active'));
      
      const targetView = document.getElementById(`view-${view}`);
      if (targetView) targetView.classList.add('active');
      document.getElementById('view-title').textContent = el.querySelector('span').textContent;
      loadView(view);
    }

    function loadView(view) {
      if (view === 'dashboard') loadDashboard();
      if (view === 'traders') fetchTraders();
      if (view === 'stalls') fetchStalls();
      if (view === 'zones') fetchZones();
      if (view === 'permits') fetchPermits();
      if (view === 'porter') fetchPorter();
      if (view === 'zonasi') fetchSlots();
      if (view === 'collection') fetchCollectionCenter();
      if (view === 'inspections') fetchInspections();
      if (view === 'complaints') fetchComplaints();
      if (view === 'billing') fetchBilling();
      if (view === 'approvals') fetchApprovals();
      if (view === 'audit') fetchAuditLogs();
      lucide.createIcons();
    }

    // --- GIS Map Mode & Layer Controls ---
    function switchMapMode(mode, el) {
      currentMapMode = mode;
      document.querySelectorAll('#view-zonasi .btn-ghost').forEach(b => b.classList.remove('active-mode'));
      el.classList.add('active-mode');
      fetchSlots();
    }

    function toggleGISLayer(layer, isChecked) {
      activeGISLayers[layer] = isChecked;
      fetchSlots();
    }

    // --- Command Center & Health Score ---
    async function loadDashboard() {
      try {
        const res = await fetch(`${API_BASE}/command-center`);
        const data = await res.json();
        
        // System Telemetry Bar
        if (data.system_telemetry) {
          document.getElementById('t-sync').textContent = data.system_telemetry.last_data_synchronization;
          document.getElementById('t-data').textContent = data.system_telemetry.jumlah_data_hari_ini;
          document.getElementById('t-trx').textContent = data.system_telemetry.jumlah_transaksi_hari_ini;
          document.getElementById('t-online').textContent = data.system_telemetry.jumlah_user_online;
          document.getElementById('t-officers').textContent = data.system_telemetry.jumlah_petugas_aktif;
          document.getElementById('t-uptime').textContent = data.system_telemetry.system_uptime;
          document.getElementById('t-db').textContent = data.system_telemetry.database_health;
        }

        // Health score & breakdown
        if (data.market_health) {
           document.getElementById('health-score-val').textContent = data.market_health.score;
           document.getElementById('health-score-status').textContent = data.market_health.status;
           document.getElementById('hs-fin').textContent = data.market_health.breakdown.financial;
           document.getElementById('hs-occ').textContent = data.market_health.breakdown.occupancy;
           document.getElementById('hs-cln').textContent = data.market_health.breakdown.cleanliness;
           document.getElementById('hs-sec').textContent = data.market_health.breakdown.security;
           document.getElementById('hs-cmp').textContent = data.market_health.breakdown.complaints;
           document.getElementById('hs-act').textContent = data.market_health.breakdown.trader_activity;
        }

        // KPIs
        document.getElementById('stat-traders').textContent = data.traders?.total || 0;
        document.getElementById('stat-traders-sub').textContent = `Aktif: ${data.traders?.active || 0} | Nonaktif: ${data.traders?.inactive || 0}`;
        
        document.getElementById('stat-stalls').textContent = data.stalls?.total || 0;
        document.getElementById('stat-stalls-sub').textContent = `Okupansi: ${data.stalls?.occupancy_rate || 0}%`;

        document.getElementById('stat-rev-today').textContent = 'Rp ' + (data.financial?.revenue_today || 0).toLocaleString();
        document.getElementById('stat-rev-month').textContent = 'Bulan Ini: Rp ' + (data.financial?.revenue_month || 0).toLocaleString();
        document.getElementById('stat-arrears').textContent = 'Rp ' + (data.financial?.total_arrears || 0).toLocaleString();

        // Live Alerts
        const alertStream = document.getElementById('live-alert-stream');
        if (data.live_alerts) {
          alertStream.innerHTML = data.live_alerts.map(a => `
            <div style="display:flex; align-items:center; gap:10px; padding:10px 14px; background:rgba(255,255,255,0.02); border-radius:10px; border-left:3px solid var(--${a.type}); font-size:12px;">
              <span>${a.text}</span>
            </div>
          `).join('');
        }

        initChart();
      } catch (e) { console.error('loadDashboard error:', e); }
    }

    function initChart() {
      const ctx = document.getElementById('mainChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Spt', 'Okt (Forecast)', 'Nov (Forecast)'],
          datasets: [{
            label: 'Revenue Projection (Rp)',
            data: [420000000, 438000000, 451000000],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // --- 360° Stall Digital Twin Modal (Klik Lapak A-023) ---
    async function open360StallTwinModal(code) {
      if (!code) code = 'A-023';
      const overlay = document.getElementById('modal-overlay');
      const content = document.getElementById('modal-content');
      try {
        const res = await fetch(`${API_BASE}/gis/stall/${code}`);
        const data = await res.json();
        const s = data.stall_info || {};
        const p = data.pedagang || {};
        const t = data.tagihan || {};
        const bayar = data.pembayaran || {};
        const k = data.komoditas || {};
        const insp = data.inspection || {};
        const cmp = data.complaint || {};
        const h = data.histori_lapak || [];

        content.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
             <div>
               <h2 style="font-size:22px; font-weight:900; color:var(--primary)">Digital Twin Lapak ${s.code}</h2>
               <div style="font-size:12px; color:var(--text-muted);">${s.block} | ${s.zone} | Luas: <strong style="color:#fff">${s.dimensions} (${s.luas_m2} m²)</strong></div>
             </div>
             <button class="btn btn-ghost" onclick="closeModal()">✕</button>
          </div>

          <div class="modal-tabs" style="overflow-x:auto; flex-wrap:nowrap;">
            <button class="tab-btn active" onclick="switchModalTab('dpedagang', this)">Pedagang</button>
            <button class="tab-btn" onclick="switchModalTab('dtagihan', this)">Tagihan & Bayar</button>
            <button class="tab-btn" onclick="switchModalTab('dkomoditas', this)">Komoditas & Luas</button>
            <button class="tab-btn" onclick="switchModalTab('dfoto', this)">Foto Lapak</button>
            <button class="tab-btn" onclick="switchModalTab('dinspeksi', this)">Inspection</button>
            <button class="tab-btn" onclick="switchModalTab('dcomplaint', this)">Complaint</button>
            <button class="tab-btn" onclick="switchModalTab('dhistori', this)">Histori Lapak</button>
          </div>

          <!-- 1. Pedagang -->
          <div id="mtab-dpedagang" class="mtab-content active" style="font-size:13px;">
             <div style="display:grid; grid-template-columns:120px 1fr; gap:16px;">
                <img src="${p.photo}" style="width:110px; height:110px; border-radius:16px; object-fit:cover; border:2px solid var(--primary);" />
                <div>
                   <h3 style="font-size:18px; font-weight:800;">${p.name}</h3>
                   <p style="margin-top:4px;"><strong>NIK:</strong> ${p.nik}</p>
                   <p><strong>No HP / WA:</strong> ${p.phone} <button class="btn btn-ghost" style="display:inline-flex; padding:2px 8px; font-size:10px;" onclick="sendWA('${p.phone}')">Chat WA</button></p>
                   <p><strong>No SIPTU:</strong> <code>${p.siptu_number}</code></p>
                   <p><strong>Reputasi Score:</strong> <span style="color:var(--gold)">★ ${p.reputation_score}/100</span> | Status: <span class="stat-badge" style="background:rgba(16,185,129,0.2); color:var(--success);">${p.status}</span></p>
                </div>
             </div>
          </div>

          <!-- 2. Tagihan & Pembayaran -->
          <div id="mtab-dtagihan" class="mtab-content" style="display:none; font-size:13px;">
             <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div class="stat-card">
                   <div class="stat-label">Tagihan Bulan Ini</div>
                   <div style="font-size:20px; font-weight:900; color:var(--danger)">Rp ${(t.total_current_bill || 0).toLocaleString()}</div>
                   <p style="font-size:11px; margin-top:4px;">Sewa: Rp ${(t.monthly_rent || 0).toLocaleString()} | Retribusi: Rp ${(t.daily_retribusi || 0).toLocaleString()}/hari</p>
                   <p style="font-size:11px;">KWH: Rp ${(t.kwh_usage_rp || 0).toLocaleString()} | PDAM: Rp ${(t.pdam_usage_rp || 0).toLocaleString()}</p>
                   <div class="stat-badge" style="background:rgba(239,68,68,0.2); color:var(--danger); margin-top:8px;">Jatuh Tempo: ${t.due_date}</div>
                </div>
                <div class="stat-card">
                   <div class="stat-label">Histori Pembayaran Terakhir</div>
                   <div style="font-size:18px; font-weight:800; color:var(--success)">Rp ${(bayar.last_payment_amount || 0).toLocaleString()}</div>
                   <p style="font-size:11px; margin-top:4px;">Tanggal: ${bayar.last_payment_date}</p>
                   <p style="font-size:11px;">Metode: ${bayar.payment_method}</p>
                   <div class="stat-badge" style="background:rgba(16,185,129,0.2); color:var(--success); margin-top:8px;">Receipt: ${bayar.receipt_no}</div>
                </div>
             </div>
          </div>

          <!-- 3. Komoditas & Luas -->
          <div id="mtab-dkomoditas" class="mtab-content" style="display:none; font-size:13px;">
             <div class="panel" style="margin-bottom:12px;">
                <p><strong>Kategori Komoditas:</strong> ${k.category}</p>
                <p><strong>Barang Dagangan Utama:</strong> ${k.primary_items}</p>
                <p><strong>Estimasi Stok Harian:</strong> ${k.daily_stock_est}</p>
                <p><strong>Rentang Harga:</strong> ${k.price_band}</p>
             </div>
             <div class="panel">
                <p><strong>Luas Bangunan Lapak:</strong> <strong style="color:var(--primary); font-size:16px;">${s.luas_m2} m²</strong> (${s.dimensions})</p>
                <p><strong>No Meteran KWH Listrik:</strong> ${s.kwh_meter_no}</p>
                <p><strong>No Meteran Air PDAM:</strong> ${s.pdam_meter_no}</p>
             </div>
          </div>

          <!-- 4. Foto Lapak -->
          <div id="mtab-dfoto" class="mtab-content" style="display:none;">
             <div style="text-align:center;">
                <img src="${s.photo}" style="width:100%; max-height:300px; object-fit:cover; border-radius:16px; border:1px solid var(--border-color);" />
                <p style="font-size:12px; color:var(--text-muted); margin-top:8px;">Foto Kondisi Fisik Lapak ${s.code} (Dokumentasi Real-Time Inspeksi)</p>
             </div>
          </div>

          <!-- 5. Inspection Log -->
          <div id="mtab-dinspeksi" class="mtab-content" style="display:none; font-size:13px;">
             <div class="panel">
                <p><strong>Terakhir Diperiksa:</strong> ${insp.last_inspection_at}</p>
                <p><strong>Officer Inspector:</strong> ${insp.inspector_name}</p>
                <p><strong>Kebersihan:</strong> <span class="stat-badge" style="background:rgba(16,185,129,0.2); color:var(--success);">${insp.cleanliness}</span></p>
                <p><strong>Keamanan:</strong> <span class="stat-badge" style="background:rgba(99,102,241,0.2); color:var(--primary);">${insp.security}</span></p>
                <p><strong>Catatan Inspector:</strong> <em>"${insp.notes}"</em></p>
             </div>
          </div>

          <!-- 6. Complaint Log -->
          <div id="mtab-dcomplaint" class="mtab-content" style="display:none; font-size:13px;">
             <div class="panel">
                <p><strong>Tiket Pengaduan Terakhir:</strong> ${cmp.latest_ticket}</p>
                <p><strong>Masalah:</strong> ${cmp.issue}</p>
                <p><strong>Prioritas:</strong> <span class="stat-badge" style="background:rgba(245,158,11,0.2); color:var(--warning);">${cmp.priority}</span></p>
                <p><strong>Status Helpdesk:</strong> <span class="stat-badge" style="background:rgba(16,185,129,0.2); color:var(--success);">${cmp.status}</span></p>
             </div>
          </div>

          <!-- 7. Histori Lapak -->
          <div id="mtab-dhistori" class="mtab-content" style="display:none; font-size:13px;">
             <table class="data-table">
                <thead>
                   <tr>
                      <th>Periode</th>
                      <th>Penyewa / Pedagang</th>
                      <th>Aksi Izin</th>
                      <th>Status</th>
                   </tr>
                </thead>
                <tbody>
                   ${h.map(item => `
                      <tr>
                         <td>${item.year}</td>
                         <td><strong>${item.tenant}</strong></td>
                         <td>${item.action}</td>
                         <td><span class="stat-badge" style="background:rgba(16,185,129,0.1); color:var(--success);">${item.status}</span></td>
                      </tr>
                   `).join('')}
                </tbody>
             </table>
          </div>
        `;
        overlay.classList.add('active');
      } catch (e) { alert('Gagal memuat 360 Digital Twin Lapak.'); }
    }

    async function fetchTraders() {
      const tbody = document.getElementById('trader-table-body');
      try {
        const res = await fetch(`${API_BASE}/traders`);
        const result = await res.json();
        const data = result.data || result;
        tbody.innerHTML = (data || []).map(t => `
          <tr onclick="open360StallTwinModal('A-023')">
            <td><div style="font-weight:700;">${t.name}</div><div style="font-size:10px; color:var(--text-muted);">${t.nik || 'NIK: 3171040001'}</div></td>
            <td>${t.phone || '08123456789'}</td>
            <td>${t.jenis_dagangan || 'Komoditas Sembako'}</td>
            <td><span class="stat-badge" style="background:rgba(16,185,129,0.1); color:var(--success);">${(t.status || 'ACTIVE').toUpperCase()}</span></td>
            <td style="text-align:right;">
              <button class="action-btn delete" onclick="event.stopPropagation(); alert('Hapus Pedagang')"><i data-lucide="trash-2" size="14"></i></button>
            </td>
          </tr>
        `).join('');
        lucide.createIcons();
      } catch (e) { tbody.innerHTML = '<tr><td colspan="5">Gagal memuat pedagang.</td></tr>'; }
    }

    async function fetchStalls() {
      const tbody = document.getElementById('stall-table-body');
      try {
        const res = await fetch(`${API_BASE}/stalls`);
        const result = await res.json();
        const data = result.data || result;
        tbody.innerHTML = (data || []).map(s => `
          <tr onclick="open360StallTwinModal('${s.code || 'A-023'}')">
            <td><div style="font-weight:700;">${s.code || s.kode_lapak || 'Lapak A-023'}</div></td>
            <td><span class="stat-badge" style="background:rgba(16,185,129,0.1); color:var(--success);">${(s.status || 'OCCUPIED').toUpperCase()}</span></td>
            <td style="text-align:right;">
              <button class="action-btn delete" onclick="event.stopPropagation(); alert('Hapus Lapak')"><i data-lucide="trash-2" size="14"></i></button>
            </td>
          </tr>
        `).join('');
        lucide.createIcons();
      } catch (e) { tbody.innerHTML = '<tr><td colspan="3">Gagal memuat lapak.</td></tr>'; }
    }

    async function fetchZones() {
      const tbody = document.getElementById('zones-table-body');
      try {
        const res = await fetch(`${API_BASE}/blocks`);
        const data = await res.json();
        tbody.innerHTML = (data && data.length > 0 ? data : [
          { kode_blok: 'BLK-A', name: 'Blok Sembako Utama', lantai: '1', kapasitas: 50 },
          { kode_blok: 'BLK-B', name: 'Blok Buah & Sayur', lantai: '1', kapasitas: 40 },
          { kode_blok: 'BLK-C', name: 'Blok Daging & Ikan', lantai: '1', kapasitas: 30 }
        ]).map(z => `
          <tr>
            <td><div style="font-weight:700;">${z.kode_blok}</div></td>
            <td>${z.name}</td>
            <td>Lantai ${z.lantai || 1}</td>
            <td>${z.kapasitas || 30} Lapak</td>
          </tr>
        `).join('');
      } catch (e) { tbody.innerHTML = '<tr><td colspan="4">Gagal memuat Zona & Blok.</td></tr>'; }
    }

    async function fetchPermits() {
      const tbody = document.getElementById('permits-table-body');
      try {
        const res = await fetch(`${API_BASE}/traders`);
        const data = await res.json();
        const traders = data.data || data;
        tbody.innerHTML = (traders && traders.length > 0 ? traders : [{ name: 'Hj. Aminah', permit_number: 'SIPTU-M01-BLK-A01' }]).map(t => `
          <tr>
            <td><div style="font-weight:700;">${t.name}</div></td>
            <td><code>${t.permit_number || 'SIPTU-M01-BLK-A01'}</code></td>
            <td><span class="stat-badge" style="background:rgba(16,185,129,0.1); color:var(--success);">AKTIF</span></td>
            <td>31 Des 2026</td>
            <td style="text-align:right;"><code>VERIFY-${t.permit_number || 'SIPTU-01'}</code></td>
          </tr>
        `).join('');
      } catch (e) { tbody.innerHTML = '<tr><td colspan="5">Gagal memuat SIPTU.</td></tr>'; }
    }

    async function fetchPorter() {
      const container = document.getElementById('porter-cards-container');
      container.innerHTML = `
        <div class="stat-card">
          <div class="stat-label">Smart Dispatch Porter #1</div>
          <div style="font-weight:800; font-size:16px; margin:6px 0;">Budi Santoso (ID: PTR-08)</div>
          <div style="font-size:12px; color:var(--text-muted);">Tugas: Angkut Barang Blok A -> Pelataran</div>
          <div class="stat-badge" style="background:rgba(16,185,129,0.2); color:var(--success); margin-top:10px;">IN_PROGRESS</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Smart Dispatch Porter #2</div>
          <div style="font-weight:800; font-size:16px; margin:6px 0;">Ahmad Fauzi (ID: PTR-12)</div>
          <div style="font-size:12px; color:var(--text-muted);">Tugas: Bongkar Muat Truk Komoditas</div>
          <div class="stat-badge" style="background:rgba(99,102,241,0.2); color:var(--primary); margin-top:10px;">STANDBY</div>
        </div>
      `;
    }

    async function fetchCollectionCenter() {
      const tbody = document.getElementById('collection-table-body');
      try {
        const res = await fetch(`${API_BASE}/collection/aging`);
        const data = await res.json();
        
        document.getElementById('cc-30').textContent = 'Rp ' + (data.summary.bucket_0_30 || 0).toLocaleString();
        document.getElementById('cc-60').textContent = 'Rp ' + (data.summary.bucket_31_60 || 0).toLocaleString();
        document.getElementById('cc-90').textContent = 'Rp ' + (data.summary.bucket_61_90 || 0).toLocaleString();
        document.getElementById('cc-over90').textContent = 'Rp ' + (data.summary.bucket_over_90 || 0).toLocaleString();

        tbody.innerHTML = (data.overdue_traders || []).map(t => `
          <tr onclick="open360StallTwinModal('${t.stall_code || 'A-023'}')">
            <td><div style="font-weight:700;">${t.name}</div></td>
            <td>${t.stall_code}</td>
            <td><strong style="color:var(--danger)">Rp ${t.arrears.toLocaleString()}</strong></td>
            <td>${t.days_overdue} hari</td>
            <td style="text-align:right;"><button class="btn btn-ghost" onclick="event.stopPropagation(); sendWA('${t.phone}')">WA Reminder</button></td>
          </tr>
        `).join('');
      } catch (e) { tbody.innerHTML = '<tr><td colspan="5">Gagal memuat Collection Center.</td></tr>'; }
    }

    async function fetchInspections() {
      const tbody = document.getElementById('inspections-table-body');
      try {
        const res = await fetch(`${API_BASE}/inspections`);
        const data = await res.json();
        tbody.innerHTML = (data && data.length > 0 ? data : [
          { created_at: new Date().toISOString(), stall_code: 'A-023', inspector_name: 'Budi (Petugas)', cleanliness_status: 'GOOD', security_status: 'SECURE', payment_verified: true }
        ]).map(i => `
          <tr onclick="open360StallTwinModal('${i.stall_code}')">
            <td>${new Date(i.created_at).toLocaleString('id-ID')}</td>
            <td><strong>${i.stall_code}</strong> (${i.trader_name || 'N/A'})</td>
            <td>${i.inspector_name}</td>
            <td><span class="stat-badge" style="background:rgba(16,185,129,0.1); color:var(--success);">${i.cleanliness_status}</span></td>
            <td><span class="stat-badge" style="background:rgba(99,102,241,0.1); color:var(--primary);">${i.security_status}</span></td>
            <td>${i.payment_verified ? '✅ Verified' : '❌ Belum'}</td>
          </tr>
        `).join('');
      } catch (e) { tbody.innerHTML = '<tr><td colspan="6">Gagal memuat Inspeksi.</td></tr>'; }
    }

    async function fetchComplaints() {
      const tbody = document.getElementById('complaints-table-body');
      try {
        const res = await fetch(`${API_BASE}/complaints`);
        const data = await res.json();
        tbody.innerHTML = (data && data.length > 0 ? data : [
          { ticket_number: 'TCK-2026-001', reporter_name: 'Hj. Aminah', title: 'Lampu Blok A Mati', category: 'FASILITAS', priority: 'HIGH', status: 'IN_PROGRESS' }
        ]).map(c => `
          <tr>
            <td><strong>${c.ticket_number || 'TCK-001'}</strong><div style="font-size:11px; color:var(--text-muted);">${c.title}</div></td>
            <td>${c.reporter_name}</td>
            <td>${c.category}</td>
            <td><span class="stat-badge" style="background:rgba(245,158,11,0.2); color:var(--warning);">${c.priority}</span></td>
            <td><span class="stat-badge" style="background:rgba(99,102,241,0.2); color:var(--primary);">${c.status}</span></td>
          </tr>
        `).join('');
      } catch (e) { tbody.innerHTML = '<tr><td colspan="5">Gagal memuat Komplain.</td></tr>'; }
    }

    async function fetchBilling() {
      try {
        const res = await fetch(`${API_BASE}/finance/dashboard`);
        const data = await res.json();
        document.getElementById('fin-billed').textContent = 'Rp ' + (data.summary.total_billed || 0).toLocaleString();
        document.getElementById('fin-paid').textContent = 'Rp ' + (data.summary.total_paid || 0).toLocaleString();
        document.getElementById('fin-rate').textContent = (data.summary.collection_rate_pct || 0) + '%';
      } catch (e) { console.error('fetchBilling error:', e); }
    }

    async function generateBills() {
      await fetch(`${API_BASE}/finance/generate-bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: 'September', year: 2026 })
      });
      fetchBilling();
      Toastify({ text: "Tagihan bulanan berhasil dibuat!", backgroundColor: "var(--success)" }).showToast();
    }

    async function fetchApprovals() {
      const container = document.getElementById('approval-cards-container');
      try {
        const res = await fetch(`${API_BASE}/approvals`);
        const data = await res.json();
        if (!data || data.length === 0) {
           container.innerHTML = `
            <div class="stat-card">
              <div class="stat-label">MUTASI_LAPAK</div>
              <div style="font-size:13px; margin:8px 0;">Pengajuan Relokasi Lapak BLK-A02 -> BLK-A05</div>
              <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">Oleh: <strong>Petugas Lapangan Budi</strong></div>
              <div style="display:flex; gap:8px;">
                 <button class="btn btn-primary" style="flex:1;" onclick="Toastify({text:'APPROVED'}).showToast()">APPROVE</button>
                 <button class="btn btn-ghost" style="flex:1; color:var(--danger)" onclick="Toastify({text:'REJECTED'}).showToast()">REJECT</button>
              </div>
            </div>
           `;
           return;
        }
        container.innerHTML = data.map(a => `
          <div class="stat-card">
             <div class="stat-label">${a.type}</div>
             <div style="font-size:13px; margin:8px 0;">Oleh: <strong>${a.requested_by}</strong></div>
             <div style="display:flex; gap:8px; margin-top:16px;">
                <button class="btn btn-primary" style="flex:1;" onclick="processApproval('${a.id}', 'APPROVE')">APPROVE</button>
                <button class="btn btn-ghost" style="flex:1; color:var(--danger)" onclick="processApproval('${a.id}', 'REJECT')">REJECT</button>
             </div>
          </div>
        `).join('');
      } catch (e) { container.innerHTML = '<p style="color:var(--text-muted)">Belum ada data approval.</p>'; }
    }

    async function processApproval(id, action) {
      await fetch(`${API_BASE}/approvals/${id}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, processed_by: 'Super Admin' })
      });
      fetchApprovals();
      Toastify({ text: `Approval request ${action}D`, backgroundColor: "var(--success)" }).showToast();
    }

    async function fetchAuditLogs() {
      const tbody = document.getElementById('audit-table-body');
      try {
        const res = await fetch(`${API_BASE}/incidents`);
        const data = await res.json();
        tbody.innerHTML = (data && data.length > 0 ? data : [
          { created_at: new Date().toISOString(), reporter_name: 'Petugas Kebersihan', type: 'SANITAION_CHECK', severity: 'LOW', status: 'RESOLVED' }
        ]).map(l => `
          <tr>
            <td>${new Date(l.created_at).toLocaleString('id-ID')}</td>
            <td>${l.reporter_name}</td>
            <td>${l.type}</td>
            <td><span class="stat-badge" style="background:rgba(99,102,241,0.2); color:var(--primary);">${l.severity}</span></td>
            <td><span class="stat-badge" style="background:rgba(16,185,129,0.2); color:var(--success);">${l.status}</span></td>
          </tr>
        `).join('');
      } catch (e) { tbody.innerHTML = '<tr><td colspan="5">Gagal memuat incident stream.</td></tr>'; }
    }

    async function fetchSlots() {
      const container = document.getElementById('gis-grid-container');
      try {
        const res = await fetch(`${API_BASE}/gis/digital-twin`);
        const data = await res.json();
        const features = data.features || [];
        
        // Filter features by active GIS layer checkboxes
        const filteredFeatures = features.filter(f => {
          const layerName = f.properties.layer || 'lapak';
          return activeGISLayers[layerName] !== false;
        });

        container.innerHTML = filteredFeatures.map(f => {
          const props = f.properties;
          let badgeText = props.code || props.name;
          let subText = props.status || props.komoditas || '';
          let nodeClass = 'active-node';

          if (currentMapMode === 'HEATMAP_OCCUPANCY') {
             nodeClass = props.status === 'occupied' ? 'active-node' : (props.status === 'vacant' ? 'vacant-node' : 'maint-node');
          } else if (currentMapMode === 'FINANCIAL_ARREARS_MAP') {
             nodeClass = props.piutang === 'HIGH_RISK' ? 'overdue-node' : (props.piutang === 'WARNING' ? 'maint-node' : 'active-node');
          } else if (currentMapMode === 'COMMODITY_ZONE_MAP') {
             subText = props.komoditas || 'Umum';
             nodeClass = 'active-node';
          }

          return `
            <div class="slot-node ${nodeClass}" onclick="open360StallTwinModal('${props.code}')">
               <div style="font-size:11px; font-weight:900;">${badgeText}</div>
               <div style="font-size:8px; opacity:0.8; margin-top:2px; max-width:80px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${subText}</div>
            </div>
          `;
        }).join('');
      } catch (e) { container.innerHTML = '<p style="color:var(--text-muted)">Digital Twin Engine Offline.</p>'; }
    }

    function closeModal() {
      document.getElementById('modal-overlay').classList.remove('active');
    }

    function sendWA(phone) {
      if (!phone) return alert('Nomor WhatsApp tidak tersedia');
      window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`);
    }
  </script>

    <!-- ========= MODAL: TRADER (PEDAGANG) ========= -->
    <div id="modal-trader" class="modal-overlay" style="display:none; position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;align-items:center;justify-content:center;">
      <div class="panel" style="width:560px;max-width:95vw;max-height:90vh;overflow-y:auto;padding:28px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h3 style="font-size:18px;font-weight:800;color:var(--primary);margin:0;">👤 Tambah Pedagang Baru</h3>
          <button onclick="closeModal('modal-trader')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;">✕</button>
        </div>
        <form id="trader-form" onsubmit="submitTraderForm(event)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group" style="grid-column:span 2;">
              <label class="form-label">Nama Lengkap <span style="color:var(--danger)">*</span></label>
              <input type="text" id="tr-name" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">NIK <span style="color:var(--danger)">*</span></label>
              <input type="text" id="tr-nik" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">No. Telepon / WA</label>
              <input type="text" id="tr-phone" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Jenis Dagangan</label>
              <input type="text" id="tr-jenis" class="form-input" placeholder="Sembako, Baju, dll">
            </div>
            <div class="form-group">
              <label class="form-label">Tipe Pedagang</label>
              <select id="tr-type" class="form-input">
                <option value="tetap">Tetap (Memiliki Lapak)</option>
                <option value="pindahan">Pindahan / Relokasi</option>
                <option value="harian">Harian / Kaki Lima</option>
              </select>
            </div>
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal('modal-trader')">Batal</button>
            <button type="submit" class="btn btn-primary"><i data-lucide="save"></i> Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========= MODAL: BLOK / ZONA ========= -->
    <div id="modal-block" class="modal-overlay" style="display:none; position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;align-items:center;justify-content:center;">
      <div class="panel" style="width:500px;max-width:95vw;padding:28px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h3 style="font-size:18px;font-weight:800;color:var(--primary);margin:0;">🏢 Tambah Blok / Zona Baru</h3>
          <button onclick="closeModal('modal-block')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;">✕</button>
        </div>
        <form id="block-form" onsubmit="submitBlockForm(event)">
          <div class="form-group">
            <label class="form-label">Kode Blok/Zona <span style="color:var(--danger)">*</span></label>
            <input type="text" id="bl-code" class="form-input" placeholder="Misal: BLK-A" required>
          </div>
          <div class="form-group">
            <label class="form-label">Nama Zona <span style="color:var(--danger)">*</span></label>
            <input type="text" id="bl-name" class="form-input" placeholder="Misal: Zona Sembako" required>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group">
              <label class="form-label">Lantai</label>
              <input type="number" id="bl-floor" class="form-input" value="1" min="1">
            </div>
            <div class="form-group">
              <label class="form-label">Kapasitas Lapak</label>
              <input type="number" id="bl-capacity" class="form-input" value="30" min="1">
            </div>
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal('modal-block')">Batal</button>
            <button type="submit" class="btn btn-primary"><i data-lucide="save"></i> Simpan Blok</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========= MODAL: INSPEKSI ========= -->
    <div id="modal-inspection" class="modal-overlay" style="display:none; position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;align-items:center;justify-content:center;">
      <div class="panel" style="width:500px;max-width:95vw;padding:28px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h3 style="font-size:18px;font-weight:800;color:var(--primary);margin:0;">📝 Input Inspeksi Lapangan</h3>
          <button onclick="closeModal('modal-inspection')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;">✕</button>
        </div>
        <form id="inspection-form" onsubmit="submitInspectionForm(event)">
          <div class="form-group">
            <label class="form-label">Kode Lapak / Kios <span style="color:var(--danger)">*</span></label>
            <input type="text" id="in-stall" class="form-input" placeholder="Cari Kode Lapak" required>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group">
              <label class="form-label">Kebersihan</label>
              <select id="in-clean" class="form-input">
                <option value="GOOD">GOOD (Bersih)</option>
                <option value="FAIR">FAIR (Sedang)</option>
                <option value="POOR">POOR (Kotor)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Keamanan / Struktur</label>
              <select id="in-secure" class="form-input">
                <option value="SECURE">SECURE (Aman)</option>
                <option value="WARNING">WARNING (Perhatian)</option>
                <option value="DANGER">DANGER (Bahaya)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Catatan Temuan</label>
            <textarea id="in-notes" class="form-input" rows="3" placeholder="Deskripsikan temuan..."></textarea>
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal('modal-inspection')">Batal</button>
            <button type="submit" class="btn btn-primary"><i data-lucide="save"></i> Submit Laporan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========= MODAL: COMPLAINT ========= -->
    <div id="modal-complaint" class="modal-overlay" style="display:none; position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;align-items:center;justify-content:center;">
      <div class="panel" style="width:500px;max-width:95vw;padding:28px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h3 style="font-size:18px;font-weight:800;color:var(--danger);margin:0;">🚨 Buat Tiket Pengaduan Baru</h3>
          <button onclick="closeModal('modal-complaint')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;">✕</button>
        </div>
        <form id="complaint-form" onsubmit="submitComplaintForm(event)">
          <div class="form-group">
            <label class="form-label">Judul Keluhan <span style="color:var(--danger)">*</span></label>
            <input type="text" id="cp-title" class="form-input" placeholder="Cth: Atap bocor di Blok A" required>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select id="cp-category" class="form-input">
                <option value="fasilitas">Fasilitas / Infrastruktur</option>
                <option value="keamanan">Keamanan / Ketertiban</option>
                <option value="kebersihan">Kebersihan / Sampah</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tingkat Prioritas</label>
              <select id="cp-priority" class="form-input">
                <option value="rendah">Rendah</option>
                <option value="sedang">Sedang</option>
                <option value="tinggi">Tinggi (Urgent)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi Detail</label>
            <textarea id="cp-desc" class="form-input" rows="3" required></textarea>
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal('modal-complaint')">Batal</button>
            <button type="submit" class="btn btn-primary" style="background:var(--danger)"><i data-lucide="send"></i> Buat Tiket</button>
          </div>
        </form>
      </div>
    </div>

</body>
</html>
