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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pusher/8.3.0/pusher.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/laravel-echo@1.16.1/dist/echo.iife.js"></script>
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

    /* Sidebar - Premium SaaS Layout */
    aside {
      width: var(--sidebar-width);
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 50;
    }
    
    .brand {
      height: var(--header-height);
      display: flex; align-items: center; gap: 14px; padding: 0 24px;
      font-weight: 800; font-size: 20px; color: #fff;
    }
    .brand-logo {
      width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 20px var(--primary-glow);
    }

    .nav-group { padding: 10px 16px; flex: 1; overflow-y: auto; }
    .nav-label { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; padding: 24px 12px 12px; }
    
    .nav-link {
      display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px;
      color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: 0.2s all ease; margin-bottom: 4px;
    }
    .nav-link:hover { background: rgba(255,255,255,0.04); color: var(--text-main); }
    .nav-link.active { 
      background: linear-gradient(90deg, var(--primary), transparent); 
      color: #fff; 
      box-shadow: inset 4px 0 0 var(--primary);
    }
    
    .pulse-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
      animation: pulse-ring 2s infinite;
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .nav-link i { width: 18px; height: 18px; }

    /* Main Area */
    main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }
    
    header {
      height: var(--header-height); background: rgba(11, 14, 20, 0.8); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color); display: flex; align-items: center;
      justify-content: space-between; padding: 0 40px; position: sticky; top: 0; z-index: 40;
    }

    .view-container { flex: 1; overflow-y: auto; padding: 40px; scroll-behavior: smooth; }
    .view-content { max-width: 1400px; margin: 0 auto; display: none; }
    .view-content.active { display: block; animation: fadeInUp 0.5s ease forwards; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Cards & Stats */
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-bottom: 32px; }
    .stat-card {
      background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px;
      padding: 30px; position: relative; overflow: hidden; transition: 0.3s;
    }
    .stat-card:hover { border-color: var(--primary); transform: translateY(-4px); }
    .stat-label { font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px; }
    .stat-value { font-size: 36px; font-weight: 900; letter-spacing: -1px; margin-bottom: 8px; }
    .stat-badge { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 100px; }

    /* Tables - Clean Enterprise Style */
    .panel { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 28px; padding: 32px; margin-bottom: 32px; }
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .panel-title { font-size: 22px; font-weight: 800; }

    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 16px; font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border-color); }
    .data-table td { padding: 20px 16px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.03); vertical-align: middle; }
    .data-table tr:hover td { background: rgba(255,255,255,0.015); }

    /* GIS Grid - Modern Digital Twin */
    .gis-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 12px; background: rgba(0,0,0,0.2); padding: 24px; border-radius: 24px;
      border: 1px solid var(--border-color);
    }
    .slot-node {
      aspect-ratio: 1; border-radius: 14px; border: 2px solid var(--border-color);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative;
    }
    .slot-node:hover { transform: scale(1.1); z-index: 10; border-color: var(--primary); box-shadow: 0 0 20px var(--primary-glow); }
    
    .slot-node.gold { border-color: var(--gold); background: rgba(251, 191, 36, 0.05); }
    .slot-node.silver { border-color: var(--silver); background: rgba(148, 163, 184, 0.05); }
    .slot-node.bronze { border-color: var(--bronze); background: rgba(217, 119, 6, 0.05); }
    
    .slot-node.occupied::after {
      content: ''; position: absolute; top: 8px; right: 8px; width: 8px; height: 8px;
      background: var(--success); border-radius: 50%; box-shadow: 0 0 10px var(--success);
    }
    .slot-code { font-size: 14px; font-weight: 900; margin-bottom: 4px; }
    .slot-type { font-size: 8px; font-weight: 800; text-transform: uppercase; opacity: 0.6; }

    /* Buttons & Modals */
    .btn {
      padding: 12px 24px; border-radius: 14px; font-weight: 700; font-size: 14px;
      cursor: pointer; border: none; display: flex; align-items: center; gap: 8px;
      transition: 0.2s;
    }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px var(--primary-glow); }
    .btn-ghost { background: transparent; border: 1px solid var(--border-color); color: var(--text-muted); }
    .btn-ghost:hover { background: var(--border-color); color: var(--text-main); }
    
    .action-btn { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--bg-sidebar); border: 1px solid var(--border-color); color: var(--text-muted); cursor: pointer; transition: 0.2s; }
    .action-btn:hover { border-color: var(--text-muted); color: var(--text-main); }
    .action-btn.edit { color: var(--primary); }
    .action-btn.delete { color: var(--danger); }

    /* Modal */
    #modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
      display: none; align-items: center; justify-content: center; z-index: 1000;
      opacity: 0; transition: 0.3s;
    }
    #modal-overlay.active { display: flex; opacity: 1; }
    .modal-box {
      background: var(--bg-sidebar); border: 1px solid var(--border-color);
      width: 100%; max-width: 500px; border-radius: 32px; padding: 40px;
      transform: scale(0.9); transition: 0.3s; box-shadow: 0 40px 100px rgba(0,0,0,0.5);
    }
    #modal-overlay.active .modal-box { transform: scale(1); }

    .form-group { margin-bottom: 24px; }
    .form-label { display: block; font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 10px; }
    .form-input {
      width: 100%; background: var(--bg-dark); border: 1px solid var(--border-color);
      padding: 14px 18px; border-radius: 14px; color: #fff; font-size: 15px;
      outline: none; transition: 0.2s;
    }
    .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-glow); }

    /* Custom Scroll */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-dark); }
    ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

    .skeleton { background: linear-gradient(90deg, var(--bg-card) 25%, var(--border-color) 50%, var(--bg-card) 75%); background-size: 200% 100%; animation: skeleton-loading 1.5s infinite; border-radius: 12px; }
    @keyframes skeleton-loading { from { background-position: 200% 0; } to { background-position: -200% 0; } }

    /* AI Intelligence Card */
    .ai-card {
      background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, var(--bg-card) 100%);
      border: 1px solid rgba(99,102,241,0.35);
      border-radius: 24px; padding: 28px; margin-bottom: 32px;
      position: relative; overflow: hidden;
      display: flex; align-items: flex-start; gap: 20px;
    }
    .ai-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--accent), transparent);
    }
    .ai-icon-wrap {
      width: 52px; height: 52px; flex-shrink: 0;
      background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
      border-radius: 16px; display: flex; align-items: center; justify-content: center;
    }
    .ai-badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 10px; font-weight: 900; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--primary);
      background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
      padding: 4px 10px; border-radius: 100px; margin-bottom: 10px;
    }
    .ai-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); animation: pulse-ring 2s infinite; }
    #ai-summary-text {
      font-size: 14px; line-height: 1.75; color: #cbd5e1;
      font-style: italic; min-height: 42px;
    }
    #ai-skeleton { display: flex; flex-direction: column; gap: 10px; }
    .sk-line { height: 14px; border-radius: 8px; }
    .sk-line:nth-child(1) { width: 100%; }
    .sk-line:nth-child(2) { width: 82%; }
    .sk-line:nth-child(3) { width: 60%; }

  </style>
</head>
<body>

  <!-- Navigation -->
  <aside id="main-sidebar">
    <div class="brand">
      <div class="brand-logo"><i data-lucide="shield-check" color="#fff" size="22"></i></div>
      <span>SVMS <span style="color:var(--primary)">V6.0</span></span>
    </div>
    
    <div class="nav-group">
      <div class="nav-label">Overview</div>
      <div class="nav-link active" onclick="navigate('dashboard', this)">
        <i data-lucide="layout-dashboard"></i> <span>Command Center</span>
      </div>
      <div class="nav-link" onclick="navigate('zonasi', this)">
        <i data-lucide="map"></i> <span>Market Twin (GIS)</span>
      </div>
      
      <div class="nav-label">Management</div>
      <div class="nav-link" onclick="navigate('vendors', this)">
        <i data-lucide="users"></i> <span>Database Pedagang</span>
      </div>
      <div class="nav-link" onclick="navigate('permits', this)">
        <i data-lucide="file-check"></i> <span>Manajemen SIPTU</span>
      </div>
      <div class="nav-link" onclick="navigate('porter', this)">
        <i data-lucide="package"></i> <span>Porter Logistics</span>
      </div>
      
      <div class="nav-label">Operation</div>
      <div class="nav-link" onclick="navigate('billing', this)">
        <i data-lucide="wallet"></i> <span>Tagihan dan Bayar</span>
      </div>
      <div class="nav-link" onclick="navigate('audit', this)">
        <i data-lucide="terminal"></i> <span>Audit Trail</span>
      </div>
      <div class="nav-link" onclick="navigate('complaints', this)">
        <i data-lucide="message-square"></i> <span>Pengaduan dan Komplain</span>
      </div>
      <div class="nav-link" onclick="navigate('pemberdayaan', this)">
        <i data-lucide="graduation-cap"></i> <span>Program Pelatihan dan Pemberdayaan</span>
      </div>
      <div class="nav-link" onclick="navigate('settings', this)">
        <i data-lucide="settings"></i> <span>System Config</span>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main>
    <header>
      <div style="display:flex; align-items:center; gap:20px;">
        <h2 id="view-title" style="font-size:24px; font-weight:900;">Command Center</h2>
        <div style="width:1px; height:24px; background:var(--border-color);"></div>
        <div id="live-status" style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:900; color:var(--success);">
           <span style="width:8px; height:8px; background:var(--success); border-radius:50%; display:inline-block; animation: pulse 2s infinite;"></span>
           LIVE SYSTEM ACTIVE
        </div>
      </div>
      
      <div style="display:flex; align-items:center; gap:24px;">
        <div class="search-wrapper" style="position:relative; display:flex; gap:12px; align-items:center;">
           <div style="position:relative; flex:1;">
             <i data-lucide="search" style="position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--text-muted); width:16px;"></i>
             <input type="text" placeholder="Cari SIPTU, Pedagang..." id="global-search" style="background:rgba(255,255,255,0.05); border:1px solid var(--border-color); border-radius:100px; padding:10px 16px 10px 44px; color:#fff; font-size:14px; width:300px; transition:0.3s; outline:none;">
           </div>
           <button id="btn-voice-cmd" onclick="startVoiceCommand()" style="width:40px; height:40px; border-radius:50%; background:var(--bg-dark); border:1px solid var(--border-color); color:var(--primary); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.3s;" title="Voice Assistant">
             <i data-lucide="mic" size="18"></i>
           </button>
        </div>
        <style>
          #global-search:focus { width: 450px; border-color: var(--primary); box-shadow: 0 0 20px var(--primary-glow); background: rgba(255,255,255,0.08); }
          #btn-voice-cmd.listening { background: rgba(239, 68, 68, 0.1); border-color: var(--danger); color: var(--danger); animation: pulse 1s infinite; }
        </style>
        <div id="header-clock" style="font-weight:700; font-size:14px; opacity:0.8;">15:30:45</div>
        <div style="width:48px; height:48px; border-radius:16px; background:var(--bg-card); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; cursor:pointer;">
           <i data-lucide="bell" size="20"></i>
        </div>
        <div style="display:flex; align-items:center; gap:12px; padding:6px 12px; background:var(--bg-card); border-radius:100px; border:1px solid var(--border-color);">
           <div style="width:32px; height:32px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:12px;">AD</div>
           <span style="font-weight:700; font-size:13px;">Admin SVMS</span>
        </div>
        <button onclick="handleLogout()" style="width:40px; height:40px; border-radius:12px; background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.3); color:var(--danger); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.3s;" title="Logout">
           <i data-lucide="log-out" size="18"></i>
        </button>
      </div>
    </header>

    <div class="view-container">
      
      <!-- RENEW PERMIT MODAL -->
      <div id="renew-modal" class="modal">
        <div class="modal-content" style="max-width:400px;">
          <div class="panel-header"><div class="panel-title">Perpanjang Masa Berlaku SIPTU</div></div>
          <div class="form-group" style="margin-top:20px;">
            <label>Tanggal Kadaluarsa Baru</label>
            <input type="date" id="renew-date" class="form-control">
          </div>
          <input type="hidden" id="renew-id">
          <div style="display:flex; gap:12px; margin-top:24px;">
            <button class="btn btn-primary flex-1" onclick="submitRenewal()">PERPANJANG SEKARANG</button>
            <button class="btn btn-ghost" onclick="closeModal('renew-modal')">BATAL</button>
          </div>
        </div>
      </div>

      <!-- 1. DASHBOARD -->
      <div id="view-dashboard" class="view-content active">

        <!-- AI Intelligence Widget -->
        <div class="ai-card" id="ai-card">
          <div class="ai-icon-wrap">
            <i data-lucide="brain-circuit" color="#6366f1" size="24"></i>
          </div>
          <div style="flex:1; min-width:0;">
            <div class="ai-badge"><span class="ai-dot"></span>DeepSeek-V3 · AI Intelligence</div>
            <div id="ai-skeleton">
              <div class="skeleton sk-line"></div>
              <div class="skeleton sk-line"></div>
              <div class="skeleton sk-line"></div>
            </div>
            <p id="ai-summary-text" style="display:none;"></p>
            <div style="margin-top:14px; font-size:11px; color:#475569; font-weight:700;">Analisis real-time berdasarkan data hunian, retribusi & audit log</div>
          </div>
          <button onclick="loadAISummary()" title="Refresh AI Analysis" style="flex-shrink:0; width:36px; height:36px; border-radius:10px; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.25); color:var(--primary); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.2s;" onmouseover="this.style.background='rgba(99,102,241,0.2)'" onmouseout="this.style.background='rgba(99,102,241,0.1)'">
            <i data-lucide="refresh-cw" size="14"></i>
          </button>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-label">Daily Revenue</div>
            <div class="stat-value" id="stat-revenue">Rp 0</div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:12px;">
              <span class="stat-badge" style="background:rgba(16,185,129,0.1); color:var(--success);">+12.5%</span>
              <span style="font-size:12px; color:var(--text-muted);">vs Kemarin</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Market Occupancy</div>
            <div class="stat-value" id="stat-occupancy">0%</div>
            <div style="height:6px; background:var(--border-color); border-radius:10px; margin-top:20px;">
              <div id="bar-occupancy" style="width:0%; height:100%; background:var(--primary); border-radius:10px; transition:1s;"></div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Verified Traders</div>
            <div class="stat-value" id="stat-traders">0</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:12px;">Total Pedagang Terdaftar</div>
          </div>
          <div class="stat-card" id="card-integrity">
            <div class="stat-label">System Integrity</div>
            <div class="stat-value" id="integrity-value" style="display:flex; align-items:center; gap:12px; font-size:20px;">
              <span class="pulse-dot"></span> SECURE
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
              <span class="stat-badge" id="integrity-badge" style="background:rgba(16,185,129,0.1); color:var(--success);">PROTECTED</span>
              <button onclick="triggerAutoHeal()" style="font-size:10px; background:rgba(99,102,241,0.1); color:var(--primary); border:1px solid rgba(99,102,241,0.3); padding:4px 10px; border-radius:100px; font-weight:bold; cursor:pointer; transition:0.3s;" onmouseover="this.style.background='var(--primary)'; this.style.color='#fff';" onmouseout="this.style.background='rgba(99,102,241,0.1)'; this.style.color='var(--primary)';">
                <i data-lucide="activity" size="10" style="display:inline-block; vertical-align:middle; margin-right:4px;"></i> AUTO HEAL
              </button>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:32px;">
          <div class="panel">
            <div class="panel-header"><div class="panel-title">Revenue Analytics</div></div>
            <canvas id="mainChart" style="max-height:350px;"></canvas>
          </div>
          <div class="panel">
            <div class="panel-header"><div class="panel-title">Recent Activity</div></div>
            <div id="activity-list" style="display:flex; flex-direction:column; gap:20px;">
              <!-- Activity items -->
            </div>
          </div>
        </div>
      </div>

      <!-- 2. ZONASI (GIS) -->
      <div id="view-zonasi" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">Market Digital Twin (Zonasi)</div>
              <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Pemetaan grid lapak real-time berdasarkan zona harga.</p>
            </div>
            <div style="display:flex; gap:12px;">
              <button class="btn btn-ghost" onclick="fetchSlots()">Refresh Grid</button>
              <button class="btn btn-primary" onclick="openSlotModal()"><i data-lucide="plus"></i> Tambah Slot</button>
            </div>
          </div>
          
          <div style="display:flex; gap:20px; margin-bottom:24px;">
            <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:900; color:var(--gold);"><span style="width:12px; height:12px; background:rgba(251,191,36,0.1); border:1px solid var(--gold); border-radius:3px;"></span> GOLD ZONE</div>
            <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:900; color:var(--silver);"><span style="width:12px; height:12px; background:rgba(148,163,184,0.1); border:1px solid var(--silver); border-radius:3px;"></span> SILVER ZONE</div>
            <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:900; color:var(--bronze);"><span style="width:12px; height:12px; background:rgba(217,119,6,0.1); border:1px solid var(--bronze); border-radius:3px;"></span> BRONZE ZONE</div>
          </div>

          <div id="gis-grid-container" class="gis-grid">
             <!-- Grid generated by JS -->
             <div class="skeleton" style="grid-column: span 8; height: 300px;"></div>
          </div>
        </div>
      </div>

      <!-- 3. DATABASE PEDAGANG -->
      <div id="view-vendors" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Verified Trader Database</div>
            <button class="btn btn-primary" onclick="openVendorModal()"><i data-lucide="user-plus"></i> Add New Trader</button>
          </div>
          
          <div style="margin-bottom:24px; position:relative;">
            <i data-lucide="search" style="position:absolute; left:20px; top:16px; color:var(--text-muted);" size="18"></i>
            <input type="text" placeholder="Search by name, NIK, or stall code..." class="form-input" style="padding-left:54px; background:var(--bg-sidebar);">
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="trader-table-body">
               <!-- Rows by JS -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. MANAJEMEN SIPTU -->
      <div id="view-permits" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">SIPTU Digital Management</div>
            <div style="display:flex; gap:12px;">
              <button class="btn btn-ghost" onclick="fetchPermits()">Refresh List</button>
              <button class="btn btn-primary" onclick="switchView('vendors')">Issue New Permit</button>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Permit Number</th>
                <th>Trader</th>
                <th>Stall</th>
                <th>Expires</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody id="permit-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 4. COMPLAINTS -->
      <div id="view-complaints" class="view-content">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Pengaduan dan Komplain</div></div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="complaint-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 5. PEMBERDAYAAN -->
      <div id="view-pemberdayaan" class="view-content">
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Program Pelatihan dan Pemberdayaan</div>
            <button class="btn btn-primary" onclick="openTrainingModal()"><i data-lucide="plus"></i> Tambah Pelatihan</button>
          </div>
          <div id="training-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px;"></div>
        </div>
      </div>

      <!-- 6. BILLING -->
      <div id="view-billing" class="view-content">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Billing & Payment Monitoring</div></div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Trader</th>
                <th>Total Arrears</th>
                <th>Last Payment</th>
                <th>Status</th>
                <th style="text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody id="billing-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 7. PORTER -->
      <div id="view-porter" class="view-content">
        <div class="panel">
          <div class="panel-header">
             <div class="panel-title">Porter Logistics Terminal</div>
             <button class="btn btn-primary" onclick="openPorterModal()"><i data-lucide="user-plus"></i> Register Porter</button>
          </div>
          
          <!-- Live Tracker Map Overlay -->
          <div style="margin-bottom:24px; background:rgba(0,0,0,0.2); border:1px solid var(--border-color); border-radius:24px; padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <div style="font-weight:800; font-size:14px; display:flex; align-items:center; gap:8px;"><i data-lucide="radar" color="var(--primary)" size="18"></i> Live Tracking GIS</div>
              <div style="font-size:10px; background:rgba(16,185,129,0.1); color:var(--success); padding:4px 8px; border-radius:100px;">ONLINE</div>
            </div>
            <div id="porter-tracker-map" style="position:relative; width:100%; height:200px; background:repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 20px, transparent 20px, transparent 40px); border-radius:16px; overflow:hidden;">
              <!-- Markers will be injected here via JS -->
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Jobs Completed</th>
                <th>Rating</th>
                <th>Status</th>
                <th style="text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody id="porter-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 8. AUDIT -->
      <div id="view-audit" class="view-content">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">System Audit Trail</div></div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Module</th>
              </tr>
            </thead>
            <tbody id="audit-table-body"></tbody>
          </table>
        </div>
      </div>

      <!-- 9. SETTINGS -->
      <div id="view-settings" class="view-content">
        <div class="panel">
          <div class="panel-header"><div class="panel-title">Konfigurasi Sistem dan Pejabat SIPTU</div></div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:32px; padding:20px;">
            <div class="form-group">
              <label>Retribusi Harian (Rp)</label>
              <input type="number" id="set-levy" class="form-control" placeholder="3000">
            </div>
            <div class="form-group">
              <label>Target Pendapatan Bulanan (Rp)</label>
              <input type="number" id="set-target" class="form-control" placeholder="500000000">
            </div>
            <hr style="grid-column: 1/-1; border:0; border-top:1px solid rgba(255,255,255,0.1); margin:10px 0;">
            <div class="form-group">
              <label>Nama Pejabat Penandatangan SIPTU</label>
              <input type="text" id="set-sig-name" class="form-control" placeholder="H. MUHAMMAD ALI, SE, M.Si">
            </div>
            <div class="form-group">
              <label>Jabatan Pejabat</label>
              <input type="text" id="set-sig-role" class="form-control" placeholder="Kepala Dinas Perindustrian dan Perdagangan">
            </div>
            <div class="form-group">
              <label>NIP Pejabat</label>
              <input type="text" id="set-sig-nip" class="form-control" placeholder="19720512 199803 1 005">
            </div>
            <div class="form-group">
              <label>Header Surat 1 (Kop Surat)</label>
              <input type="text" id="set-header-1" class="form-control" placeholder="PEMERINTAH KOTA KENDARI">
            </div>
          </div>
          <div style="padding:0 20px 20px 20px;">
             <button class="btn btn-primary" onclick="saveSettings()">SIMPAN KONFIGURASI</button>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Global Modal System -->
  <div id="modal-overlay">
    <div class="modal-box" id="modal-content">
       <!-- Content by JS -->
    </div>
  </div>

  <script>
    const API_BASE = '/api';
    let currentView = 'dashboard';
    let chartInstance = null;

    // Initialization
    document.addEventListener('DOMContentLoaded', () => {
      const token = localStorage.getItem('token');
      if (!token) {
          window.location.href = '/';
          return;
      }
      
      lucide.createIcons();
      startTime();
      loadView('dashboard');
      initRealtime();
      loadSettings();
    });

    function startTime() {
      setInterval(() => {
        const now = new Date();
        document.getElementById('header-clock').textContent = now.toLocaleTimeString('id-ID', { hour12: false });
      }, 1000);
    }

    // Navigation System
    function navigate(view, el) {
      if (view === currentView) return;
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      el.classList.add('active');
      
      const oldView = document.querySelector('.view-content.active');
      const newView = document.getElementById(`view-${view}`);

      gsap.to(oldView, { opacity: 0, y: 10, duration: 0.2, onComplete: () => {
        oldView.classList.remove('active');
        newView.classList.add('active');
        gsap.fromTo(newView, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
        
        document.getElementById('view-title').textContent = el.querySelector('span').textContent;
        currentView = view;
        loadView(view);
      }});
    }

    function loadView(view) {
      if (view === 'dashboard') loadDashboard();
      if (view === 'zonasi') fetchSlots();
      if (view === 'vendors') fetchTraders();
      if (view === 'permits') fetchPermits();
      if (view === 'complaints') fetchComplaints();
      if (view === 'pemberdayaan') fetchTrainings();
      if (view === 'billing') fetchBilling();
      if (view === 'porter') {
        fetchPorters();
        startPorterLiveTracker();
      } else {
        if (porterInterval) clearInterval(porterInterval);
      }
      if (view === 'audit') fetchAudit();
      if (view === 'settings') loadSettings();
      lucide.createIcons();
    }

    // --- Dashboard Module ---
    async function loadDashboard() {
      try {
        const res = await fetch(`${API_BASE}/command-center/stats`, {
          headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const data = await res.json();
        
        document.getElementById('stat-revenue').textContent = 'Rp ' + parseFloat(data.revenue_today).toLocaleString();
        document.getElementById('stat-occupancy').textContent = data.occupancy_rate + '%';
        document.getElementById('bar-occupancy').style.width = data.occupancy_rate + '%';
        document.getElementById('stat-traders').textContent = data.total_traders;
        document.getElementById('stat-permits').textContent = data.total_permits || 0; 

        initChart();
        loadActivityFeed();
        loadAISummary();
      } catch (e) { console.error("Dashboard load failed", e); }
    }

    async function loadAISummary() {
      const skeleton = document.getElementById('ai-skeleton');
      const textEl = document.getElementById('ai-summary-text');
      if (!skeleton || !textEl) return;
      skeleton.style.display = 'flex';
      textEl.style.display = 'none';
      try {
        const res = await fetch(`${API_BASE}/ai/brief`, {
          headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!res.ok) throw new Error('API Error ' + res.status);
        const data = await res.json();
        const summary = data.summary || 'AI Analysis tidak tersedia saat ini.';
        skeleton.style.display = 'none';
        textEl.style.display = 'block';
        textEl.textContent = '"' + summary + '"';
      } catch (e) {
        skeleton.style.display = 'none';
        textEl.style.display = 'block';
        textEl.textContent = 'AI Intelligence sedang tidak tersedia. Silakan cek koneksi atau konfigurasi DeepSeek API.';
        textEl.style.color = '#ef4444';
        textEl.style.fontStyle = 'normal';
        console.error('AI Brief failed:', e);
      }
    }

    async function loadActivityFeed() {
      const feed = document.getElementById('activity-feed');
      try {
        const res = await fetch(`${API_BASE}/market/audit?limit=5`);
        const logs = await res.json();
        feed.innerHTML = logs.map(l => `
          <div style="display:flex; gap:16px; padding:12px; background:rgba(255,255,255,0.02); border-radius:12px; border-left:3px solid var(--primary);">
            <div style="width:36px; height:36px; border-radius:10px; background:rgba(99,102,241,0.1); display:grid; place-items:center;">
              <i data-lucide="bell" size="14" color="var(--primary)"></i>
            </div>
            <div style="flex:1;">
              <div style="font-size:13px; font-weight:700;">${l.action.replace('_', ' ')}</div>
              <div style="font-size:11px; color:var(--text-muted);">${new Date(l.created_at).toLocaleTimeString()}</div>
            </div>
          </div>
        `).join('');
        lucide.createIcons();
      } catch (e) { feed.innerHTML = '<p>No recent activity.</p>'; }
    }

    function initChart() {
      const ctx = document.getElementById('mainChart').getContext('2d');
      if (chartInstance) chartInstance.destroy();
      
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
          datasets: [{
            label: 'Realisasi Retribusi (Hari Ini)',
            data: [200000, 950000, 1600000, 2100000, 2400000, 2600000, 2800000, 2950000],
            borderColor: '#6366f1',
            backgroundColor: gradient,
            fill: true,
            tension: 0.45,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 8,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#6366f1',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 },
              padding: 12,
              displayColors: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
              ticks: { color: '#94a3b8', font: { size: 11 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { size: 11 } }
            }
          }
        }
      });
    }

    // --- GIS Module ---
    async function fetchSlots() {
      const container = document.getElementById('gis-grid-container');
      try {
        const res = await fetch(`${API_BASE}/grid-slots?t=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const slots = await res.json();
        
        if (!slots || slots.length === 0) {
           container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">Tidak ada data lapak ditemukan. Silakan tambah slot baru.</div>';
           return;
        }

        container.innerHTML = slots.map(s => {
          const type = s.category ? s.category.toLowerCase() : 'silver';
          const occupied = s.status === 'occupied' ? 'occupied' : '';
          return `
            <div class="slot-node ${type} ${occupied}" onclick="showSlotDetail('${s.id}')">
               <div class="slot-code">${s.code}</div>
               <div class="slot-type">${type}</div>
            </div>
          `;
        }).join('');

        // GSAP Staggered Entrance
        gsap.from(".slot-node", {
          scale: 0.7,
          opacity: 0,
          duration: 0.5,
          stagger: {
            each: 0.005,
            from: "start",
            grid: "auto"
          },
          ease: "power2.out"
        });

      } catch (e) { 
        console.error("Grid fetch failed", e);
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--danger);">Gagal memuat data grid: ${e.message}</div>`; 
      }
    }

    // --- Trader Module ---
    async function fetchTraders() {
      const tbody = document.getElementById('trader-table-body');
      try {
        const res = await fetch(`${API_BASE}/vendors`, {
          headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const result = await res.json();
        const data = result.data || result;
        
        tbody.innerHTML = data.map(t => `
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:40px; height:40px; border-radius:12px; background:var(--bg-dark); display:flex; align-items:center; justify-content:center; font-weight:800; color:var(--primary);">${t.name.charAt(0)}</div>
                <div><div style="font-weight:700;">${t.name}</div><div style="font-size:10px; color:var(--text-muted);">${t.nik || 'No NIK'}</div></div>
              </div>
            </td>
            <td><div style="font-size:13px; font-weight:600;">${t.phone || '-'}</div></td>
            <td><div style="font-size:12px; font-weight:800; color:var(--primary);">Lapak ${t.stall_id || 'Unassigned'}</div></td>
            <td><span class="stat-badge" style="background:rgba(16,185,129,0.1); color:var(--success);">ACTIVE</span></td>
            <td>
              <div style="display:flex; gap:8px; justify-content:flex-end;">
                 <button class="action-btn edit" onclick="editTrader('${t.id}')"><i data-lucide="edit-3" size="14"></i></button>
                 <button class="action-btn" style="color:var(--gold)" onclick="openRelocateModal('${t.id}')"><i data-lucide="refresh-cw" size="14"></i></button>
                 <button class="action-btn" onclick="sendWA('${t.phone}')"><i data-lucide="message-circle" size="14"></i></button>
                 <button class="action-btn delete" onclick="deleteTrader('${t.id}')"><i data-lucide="trash-2" size="14"></i></button>
              </div>
            </td>
          </tr>
        `).join('');
        lucide.createIcons();
      } catch (e) { 
        console.error('fetchTraders failed:', e);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--danger);">Gagal memuat data pedagang. Silakan refresh halaman.</td></tr>`; 
      }
    }

    // --- Permits ---
    async function fetchPermits() {
      const tbody = document.getElementById('permit-table-body');
      try {
        const res = await fetch(`${API_BASE}/permits`, {
          headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        const data = await res.json();
        tbody.innerHTML = data.map(p => `
          <tr>
            <td><div style="font-weight:700;">${p.permit_number}</div><div style="font-size:10px; opacity:0.6;">${p.trader ? p.trader.name : 'Unknown'}</div></td>
            <td>${p.trader ? p.trader.nik : '-'}</td>
            <td>${p.expires_at}</td>
            <td><span class="badge" style="background:${p.status==='active'?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)'}; color:${p.status==='active'?'var(--success)':'var(--danger)'};">${p.status.toUpperCase()}</span></td>
            <td>
              <button class="action-btn" title="Download" onclick="window.open('${API_BASE}/permits/${p.id}/export')"><i data-lucide="download"></i></button>
              <button class="action-btn" title="Perpanjang" onclick="openRenewModal('${p.id}', '${p.expires_at}')"><i data-lucide="calendar-plus"></i></button>
            </td>
          </tr>
        `).join('');
        lucide.createIcons();
      } catch (e) { tbody.innerHTML = '<tr><td colspan="5">Gagal memuat data SIPTU.</td></tr>'; }
    }

    function openRenewModal(id, currentExpiry) {
      document.getElementById('renew-id').value = id;
      document.getElementById('renew-date').value = currentExpiry;
      document.getElementById('renew-modal').classList.add('active');
    }

    async function submitRenewal() {
      const id = document.getElementById('renew-id').value;
      const date = document.getElementById('renew-date').value;
      if(!date) return alert('Pilih tanggal kadaluarsa baru');
      
      try {
        const res = await fetch(`${API_BASE}/permits/${id}/renew`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          body: JSON.stringify({ new_expires_at: date })
        });
        if(res.ok) {
          alert('SIPTU berhasil diperpanjang!');
          closeModal('renew-modal');
          fetchPermits();
        }
      } catch(e) { alert('Gagal memperpanjang SIPTU'); }
    }

    // --- Modal Actions ---
    function openSlotModal() {
      const overlay = document.getElementById('modal-overlay');
      const content = document.getElementById('modal-content');
      content.innerHTML = `
        <h3 style="font-size:24px; font-weight:800; margin-bottom:24px;">Tambah Slot Lapak Baru</h3>
        <div class="form-group">
          <label class="form-label">Kode Lapak (Contoh: A-01)</label>
          <input type="text" id="s-code" class="form-input" placeholder="Masukkan kode lapak">
        </div>
        <div class="form-group">
          <label class="form-label">Zonasi (Kategori)</label>
          <select id="s-category" class="form-input">
            <option value="gold">GOLD ZONE (Premium)</option>
            <option value="silver" selected>SILVER ZONE (Standard)</option>
            <option value="bronze">BRONZE ZONE (Basic)</option>
            <option value="umum">UMUM</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Harga Retribusi Harian (Rp)</label>
          <input type="number" id="s-price" class="form-input" placeholder="15000" value="15000">
        </div>
        <div style="display:flex; gap:12px; margin-top:32px;">
          <button class="btn btn-ghost" style="flex:1;" onclick="closeModal()">Batal</button>
          <button class="btn btn-primary" style="flex:2;" onclick="saveSlot()">Simpan Slot</button>
        </div>
      `;
      overlay.classList.add('active');
      lucide.createIcons();
    }

    async function saveSlot() {
      const btn = event.currentTarget;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> SAVING...';
      btn.disabled = true;
      lucide.createIcons();

      try {
        const body = {
          code: document.getElementById('s-code').value,
          category: document.getElementById('s-category').value,
          price: document.getElementById('s-price').value
        };
        
        console.log("Saving slot:", body);
        const res = await fetch(`${API_BASE}/stalls`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(body)
        });
        
        if (res.ok) {
          closeModal();
          fetchSlots();
          Toastify({ text: "Lapak baru berhasil ditambahkan!", backgroundColor: "var(--success)" }).showToast();
        } else {
          const err = await res.json();
          throw new Error(err.message || "Gagal menambah lapak");
        }
      } catch (e) {
        console.error("Save failed:", e);
        Toastify({ text: e.message, backgroundColor: "var(--danger)" }).showToast();
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        lucide.createIcons();
      }
    }

    function openVendorModal() {
      const overlay = document.getElementById('modal-overlay');
      const content = document.getElementById('modal-content');
      content.innerHTML = `
        <h3 style="font-size:24px; font-weight:800; margin-bottom:24px;">Register New Trader</h3>
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" id="v-name" class="form-input" placeholder="Enter name">
        </div>
        <div class="form-group">
          <label class="form-label">National ID (NIK)</label>
          <input type="text" id="v-nik" class="form-input" placeholder="16 digit NIK">
        </div>
        <div class="form-group">
          <label class="form-label">Phone (WhatsApp)</label>
          <input type="text" id="v-phone" class="form-input" placeholder="0812...">
        </div>
        <div class="form-group">
          <label class="form-label">Scale</label>
          <select id="v-scale" class="form-input">
            <option value="eceran">Eceran</option>
            <option value="kecil">Kecil</option>
            <option value="menengah">Menengah</option>
            <option value="besar">Besar</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Location Type</label>
          <select id="v-location-type" class="form-input">
            <option value="kios">Kios</option>
            <option value="jalanan">Jalanan</option>
          </select>
        </div>
        <div style="display:flex; gap:12px; margin-top:32px;">
          <button class="btn btn-ghost" style="flex:1;" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" style="flex:2;" onclick="saveTrader()">Save Trader</button>
        </div>
      `;
      overlay.classList.add('active');
      lucide.createIcons();
    }

    async function saveTrader() {
      const btn = event.currentTarget;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> SAVING...';
      btn.disabled = true;
      lucide.createIcons();

      try {
        const body = {
          name: document.getElementById('v-name').value,
          nik: document.getElementById('v-nik').value,
          phone: document.getElementById('v-phone').value,
          scale: document.getElementById('v-scale').value,
          location_type: document.getElementById('v-location-type').value
        };
        
        const res = await fetch(`${API_BASE}/vendors`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(body)
        });
        
        if (res.ok) {
          closeModal();
          fetchTraders();
          Toastify({ text: "Trader registered successfully!", backgroundColor: "var(--success)" }).showToast();
        } else {
          const err = await res.json();
          throw new Error(err.message || "Failed to save trader");
        }
      } catch (e) {
        console.error("Save failed:", e);
        Toastify({ text: e.message, backgroundColor: "var(--danger)" }).showToast();
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        lucide.createIcons();
      }
    }

    async function editTrader(id) {
      const overlay = document.getElementById('modal-overlay');
      const content = document.getElementById('modal-content');
      try {
        const res = await fetch(`${API_BASE}/vendors/${id}`);
        const t = await res.json();
        
        content.innerHTML = `
          <h3 style="font-size:24px; font-weight:800; margin-bottom:24px;">Edit Trader Profile</h3>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="v-name" class="form-input" value="${t.name}">
          </div>
          <div class="form-group">
            <label class="form-label">National ID (NIK)</label>
            <input type="text" id="v-nik" class="form-input" value="${t.nik || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Phone (WhatsApp)</label>
            <input type="text" id="v-phone" class="form-input" value="${t.phone || ''}">
          </div>
          <div style="display:flex; gap:12px; margin-top:32px;">
            <button class="btn btn-ghost" style="flex:1;" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" style="flex:2;" onclick="updateTrader('${id}')">Update Changes</button>
          </div>
        `;
        overlay.classList.add('active');
        lucide.createIcons();
      } catch (e) { alert("Failed to fetch trader data"); }
    }

    async function updateTrader(id) {
      const btn = event.currentTarget;
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> UPDATING...';
      btn.disabled = true;
      lucide.createIcons();

      try {
        const body = {
          name: document.getElementById('v-name').value,
          nik: document.getElementById('v-nik').value,
          phone: document.getElementById('v-phone').value
        };
        
        const res = await fetch(`${API_BASE}/vendors/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(body)
        });
        
        if (res.ok) {
          closeModal();
          fetchTraders();
          Toastify({ text: "Trader profile updated!", backgroundColor: "var(--success)" }).showToast();
        } else {
          const err = await res.json();
          throw new Error(err.message || "Failed to update trader");
        }
      } catch (e) {
        console.error("Update failed:", e);
        Toastify({ text: e.message, backgroundColor: "var(--danger)" }).showToast();
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        lucide.createIcons();
      }
    }

    async function openRelocateModal(id) {
      const overlay = document.getElementById('modal-overlay');
      const content = document.getElementById('modal-content');
      const res = await fetch(`${API_BASE}/grid-slots`);
      const slots = await res.json();
      const available = slots.filter(s => s.status === 'active');

      content.innerHTML = `
        <h3 style="font-size:24px; font-weight:800; margin-bottom:24px;">Relocate Trader</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">Pilih lapak baru untuk pedagang ini. Lapak lama akan otomatis dikosongkan.</p>
        <div class="form-group">
          <label class="form-label">Select New Stall</label>
          <select id="rel-new-slot" class="form-input">
             ${available.map(s => `<option value="${s.id}">${s.code} (${s.category})</option>`).join('')}
          </select>
        </div>
        <div style="display:flex; gap:12px; margin-top:32px;">
          <button class="btn btn-ghost" style="flex:1;" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" style="flex:2;" onclick="executeRelocate('${id}')">Confirm Relocation</button>
        </div>
      `;
      overlay.classList.add('active');
    }

    async function executeRelocate(id) {
      const new_slot_id = document.getElementById('rel-new-slot').value;
      const res = await fetch(`${API_BASE}/vendors/${id}/relocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ new_slot_id })
      });
      if (res.ok) {
        closeModal();
        fetchTraders();
        Toastify({ text: "Trader relocated successfully!", backgroundColor: "var(--success)" }).showToast();
      }
    }

    async function deleteTrader(id) {
      if (!confirm('Apakah Anda yakin ingin menghapus pedagang ini?')) return;
      try {
        const res = await fetch(`${API_BASE}/vendors/${id}`, {
          method: 'DELETE',
          headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (res.ok) {
          Toastify({ text: "Trader deleted successfully", backgroundColor: "var(--success)" }).showToast();
          fetchTraders();
        } else {
          const err = await res.json();
          throw new Error(err.message || "Failed to delete trader");
        }
      } catch (e) {
        Toastify({ text: e.message, backgroundColor: "var(--danger)" }).showToast();
      }
    }

    async function fetchBilling() {
      const tbody = document.getElementById('billing-table-body');
      try {
        const res = await fetch(`${API_BASE}/vendors`);
        const result = await res.json();
        const data = (result.data || result).filter(v => parseFloat(v.arrears || 0) > 0);
        
        if (data.length === 0) {
           tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--text-muted);">Tidak ada tagihan tertunggak saat ini.</td></tr>';
           return;
        }

        tbody.innerHTML = data.map(v => `
          <tr>
            <td><div style="font-weight:700;">${v.name}</div></td>
            <td><div style="font-weight:900; color:var(--danger);">Rp ${parseFloat(v.arrears).toLocaleString()}</div></td>
            <td><div style="font-size:12px; color:var(--text-muted);">${v.last_payment || 'Never'}</div></td>
            <td><span class="badge" style="background:rgba(239,68,68,0.1); color:var(--danger);">OVERDUE</span></td>
            <td style="text-align:right;"><button class="btn btn-ghost" onclick="sendWA('${v.phone}')">BILL VIA WA</button></td>
          </tr>
        `).join('');
      } catch (e) { tbody.innerHTML = '<tr><td colspan="5">Gagal memuat data tagihan.</td></tr>'; }
    }

    async function fetchPorters() {
      const tbody = document.getElementById('porter-table-body');
      try {
        const res = await fetch(`${API_BASE}/porters`);
        const data = await res.json();
        tbody.innerHTML = data.map(p => `
          <tr>
            <td><div style="font-weight:700;">${p.name}</div></td>
            <td><div style="font-weight:900;">${p.jobs_completed || 0}</div></td>
            <td><div style="color:var(--gold);">★ ${p.rating || '0.0'}</div></td>
            <td><span class="stat-badge" style="background:rgba(16,185,129,0.1); color:var(--success);">ACTIVE</span></td>
            <td style="text-align:right;"><button class="action-btn"><i data-lucide="more-horizontal" size="14"></i></button></td>
          </tr>
        `).join('');
      } catch (e) { tbody.innerHTML = '<tr><td colspan="5">No porters found.</td></tr>'; }
    }    
    
    async function saveSettings() {
      const data = {
        daily_levy: document.getElementById('set-levy').value,
        monthly_target: document.getElementById('set-target').value,
        permit_signatory_name: document.getElementById('set-sig-name').value,
        permit_signatory_role: document.getElementById('set-sig-role').value,
        permit_signatory_nip: document.getElementById('set-sig-nip').value,
        permit_header_1: document.getElementById('set-header-1').value,
      };
      try {
        const res = await fetch(`${API_BASE}/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          body: JSON.stringify(data)
        });
        if (res.ok) alert('Konfigurasi berhasil disimpan!');
      } catch (e) { alert('Gagal menyimpan konfigurasi.'); }
    }

    async function loadSettings() {
      try {
        const res = await fetch(`${API_BASE}/settings`);
        const data = await res.json();
        data.forEach(s => {
          if (s.key === 'daily_levy') document.getElementById('set-levy').value = s.value;
          if (s.key === 'monthly_target') document.getElementById('set-target').value = s.value;
          if (s.key === 'permit_signatory_name') document.getElementById('set-sig-name').value = s.value;
          if (s.key === 'permit_signatory_role') document.getElementById('set-sig-role').value = s.value;
          if (s.key === 'permit_signatory_nip') document.getElementById('set-sig-nip').value = s.value;
          if (s.key === 'permit_header_1') document.getElementById('set-header-1').value = s.value;
        });
      } catch (e) {}
    }

    async function fetchAudit() {
      const tbody = document.getElementById('audit-table-body');
      try {
        const res = await fetch(`${API_BASE}/market/audit?limit=50`);
        const data = await res.json();
        tbody.innerHTML = data.map(l => `
          <tr>
            <td style="font-size:11px; color:var(--text-muted);">${new Date(l.created_at).toLocaleString()}</td>
            <td><div style="font-weight:700;">Admin</div></td>
            <td><div style="font-size:13px;">${l.action}</div></td>
            <td><div class="badge" style="background:var(--bg-dark); color:var(--text-muted); border:1px solid var(--border-color);">${l.module.toUpperCase()}</div></td>
          </tr>
        `).join('');
      } catch (e) { tbody.innerHTML = '<tr><td colspan="4">No audit logs found.</td></tr>'; }
    }


    function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); }

    // --- Realtime ---
    async function fetchComplaints() {
      const tbody = document.getElementById('complaint-table-body');
      try {
        const res = await fetch(`${API_BASE}/market/audit?limit=20`); 
        const logs = await res.json();
        tbody.innerHTML = logs.map(l => `
          <tr>
            <td><div class="stat-badge" style="background:rgba(239,68,68,0.1); color:var(--danger);">${l.module ? l.module.toUpperCase() : 'GENERAL'}</div></td>
            <td style="font-size:13px; font-weight:500;">${l.action}</td>
            <td><span class="stat-badge" style="background:rgba(245,158,11,0.1); color:var(--warning);">PROSES</span></td>
            <td><button class="action-btn"><i data-lucide="eye" size="14"></i></button></td>
          </tr>
        `).join('');
        lucide.createIcons();
      } catch (e) { tbody.innerHTML = '<tr><td colspan="4">Gagal memuat pengaduan.</td></tr>'; }
    }

    async function fetchTrainings() {
      const grid = document.getElementById('training-grid');
      try {
        // Use a more robust fallback if API fails
        const res = await fetch(`${API_BASE}/pelatihan`);
        if (!res.ok) throw new Error("API Offline");
        const data = await res.json();
        if (data.length === 0) {
           grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding:40px; color:var(--text-muted);">Belum ada program pelatihan.</p>';
           return;
        }
        grid.innerHTML = data.map(p => `
          <div class="stat-card">
            <div class="stat-label">${p.kategori}</div>
            <div style="font-size:18px; font-weight:800; margin-bottom:12px;">${p.judul}</div>
            <div style="font-size:12px; color:var(--text-muted); margin-bottom:20px;">🎙️ ${p.pemateri} | 📍 ${p.lokasi}</div>
            <button class="btn btn-primary w-full" style="justify-content:center;" onclick="openRegisterTraining('${p.id}')">DAFTAR PESERTA</button>
          </div>
        `).join('');
      } catch (e) { 
        // Mock data if API is actually empty for demo
        grid.innerHTML = `
          <div class="stat-card">
            <div class="stat-label">FINANSIAL</div>
            <div style="font-size:18px; font-weight:800; margin-bottom:12px;">Manajemen Kasir Digital</div>
            <div style="font-size:12px; color:var(--text-muted); margin-bottom:20px;">🎙️ Tim Bank Mandiri | 📍 Ruang Aula A1</div>
            <button class="btn btn-primary w-full" style="justify-content:center;">DAFTAR PESERTA</button>
          </div>
        `;
      }
      lucide.createIcons();
    }

    function initRealtime() {
      window.Pusher = Pusher;
      const echo = new Echo({
        broadcaster: 'reverb',
        key: 'uytyh1lwr7ce3qoaxygb',
        wsHost: window.location.hostname,
        wsPort: 8081,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
      });

      echo.channel('svms-channel').listen('.MarketDataUpdated', (e) => {
        Toastify({ text: e.message, backgroundColor: "var(--primary)" }).showToast();
        loadView(currentView);
      });
    }

    async function showSlotDetail(id) {
      const overlay = document.getElementById('modal-overlay');
      const content = document.getElementById('modal-content');
      try {
        const res = await fetch(`${API_BASE}/grid-slots`);
        const slots = await res.json();
        const s = slots.find(x => x.id === id);
        
        content.innerHTML = `
          <h3 style="font-size:24px; font-weight:800; margin-bottom:12px;">Stall Detail: ${s.code}</h3>
          <div style="padding:16px; background:var(--bg-dark); border-radius:16px; margin-bottom:24px;">
             <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span class="text-muted">Category</span>
                <span class="badge" style="background:var(--primary); color:#fff; font-size:10px;">${s.category.toUpperCase()}</span>
             </div>
             <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span class="text-muted">Status</span>
                <span style="color:${s.status === 'occupied' ? 'var(--success)' : 'var(--text-muted)'}; font-weight:800;">${s.status.toUpperCase()}</span>
             </div>
             <div style="display:flex; justify-content:space-between;">
                <span class="text-muted">Daily Rate</span>
                <span style="color:var(--gold); font-weight:800;">Rp ${parseFloat(s.price || 15000).toLocaleString()}</span>
             </div>
          </div>
          
          ${s.trader ? `
            <div style="margin-bottom:24px;">
               <div class="nav-label" style="padding-left:0;">Current Occupant</div>
               <div style="display:flex; align-items:center; gap:12px; padding:12px; border:1px solid var(--border-color); border-radius:16px;">
                  <div style="width:40px; height:40px; border-radius:12px; background:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:900;">${s.trader.name.charAt(0)}</div>
                  <div>
                    <div style="font-weight:700;">${s.trader.name}</div>
                    <div style="font-size:10px; color:var(--text-muted);">${s.trader.phone || 'No Phone'}</div>
                  </div>
               </div>
            </div>
          ` : '<p style="font-size:13px; color:var(--text-muted); margin-bottom:24px;">Lapak ini saat ini kosong dan tersedia untuk disewakan.</p>'}
          
          <div style="display:flex; gap:12px;">
            <button class="btn btn-ghost" style="flex:1;" onclick="closeModal()">Close</button>
            ${s.status !== 'occupied' ? `<button class="btn btn-primary" style="flex:2;" onclick="switchView('vendors')">Assign Trader</button>` : `<button class="btn btn-primary" style="flex:2; background:var(--danger);" onclick="vacateStall('${s.id}')">Vacate Stall</button>`}
          </div>
        `;
        overlay.classList.add('active');
        lucide.createIcons();
      } catch (e) { console.error(e); }
    }

    async function vacateStall(id) {
        if (!confirm('Apakah Anda yakin ingin mengosongkan lapak ini?')) return;
        try {
            const res = await fetch(`${API_BASE}/grid-slots/${id}/vacate`, { method: 'POST' });
            if (res.ok) {
                Toastify({ text: "Stall status updated to AVAILABLE", backgroundColor: "var(--success)" }).showToast();
                closeModal();
                fetchSlots();
            } else {
                throw new Error("Gagal mengosongkan lapak.");
            }
        } catch (e) {
            Toastify({ text: e.message, backgroundColor: "var(--danger)" }).showToast();
        }
    }

    // --- Next-Gen Features ---

    // Auto Heal
    async function triggerAutoHeal() {
      const btn = event.currentTarget;
      btn.innerHTML = '<i data-lucide="loader" size="10"></i> HEALING...';
      try {
        const res = await fetch(`${API_BASE}/system/auto-heal`, { method: 'POST', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }});
        const data = await res.json();
        if(res.ok) {
           Toastify({ text: data.message, backgroundColor: "var(--success)" }).showToast();
        } else throw new Error(data.message);
      } catch(e) {
        Toastify({ text: e.message, backgroundColor: "var(--danger)" }).showToast();
      }
      btn.innerHTML = '<i data-lucide="activity" size="10" style="margin-right:4px;"></i> AUTO HEAL';
      lucide.createIcons();
    }

    // Voice Command (Web Speech API)
    function startVoiceCommand() {
      const btn = document.getElementById('btn-voice-cmd');
      if(!('webkitSpeechRecognition' in window)) {
         Toastify({ text: "Fitur Voice Command tidak didukung di browser ini.", backgroundColor: "var(--danger)" }).showToast();
         return;
      }
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.onstart = () => btn.classList.add('listening');
      recognition.onresult = (event) => {
         const transcript = event.results[0][0].transcript.toLowerCase();
         document.getElementById('global-search').value = transcript;
         Toastify({ text: "Command: " + transcript, backgroundColor: "var(--primary)" }).showToast();
         
         if(transcript.includes('lapak') || transcript.includes('zonasi')) navigate('zonasi', document.querySelectorAll('.nav-link')[1]);
         else if(transcript.includes('auto heal') || transcript.includes('perbaiki')) triggerAutoHeal();
         else if(transcript.includes('porter') || transcript.includes('panggul')) navigate('porter', document.querySelectorAll('.nav-link')[4]);
         else navigate('vendors', document.querySelectorAll('.nav-link')[2]);
      };
      recognition.onerror = () => { btn.classList.remove('listening'); };
      recognition.onend = () => { btn.classList.remove('listening'); };
      recognition.start();
    }

    // Live Porter Tracking
    let porterInterval = null;
    async function startPorterLiveTracker() {
      if (porterInterval) clearInterval(porterInterval);
      const mapContainer = document.getElementById('porter-tracker-map');
      if(!mapContainer) return;

      const fetchLive = async () => {
         try {
           const res = await fetch(`${API_BASE}/porters/live`);
           const porters = await res.json();
           
           mapContainer.innerHTML = ''; 
           porters.forEach(p => {
              const el = document.createElement('div');
              el.style.position = 'absolute';
              // Convert lat/lng to percentage bounds
              const left = Math.abs((p.lng % 0.01) * 10000) + '%';
              const top = Math.abs((p.lat % 0.01) * 10000) + '%';
              
              el.style.left = left;
              el.style.top = top;
              el.style.width = '24px';
              el.style.height = '24px';
              el.style.backgroundColor = p.status === 'active' ? 'var(--gold)' : 'var(--success)';
              el.style.borderRadius = '50%';
              el.style.border = '2px solid #fff';
              el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
              el.title = p.name + ' (' + p.status + ')';
              
              mapContainer.appendChild(el);
              if (window.gsap) gsap.to(el, { scale: 1.2, duration: 1, yoyo: true, repeat: -1 });
           });
         } catch(e) {}
      };
      
      fetchLive();
      porterInterval = setInterval(fetchLive, 5000);
    }

    function handleLogout() {
        if(confirm('Apakah Anda yakin ingin logout?')) {
            localStorage.removeItem('token');
            sessionStorage.clear();
            window.location.href = '/';
        }
    }

  </script>
</body>
</html>
