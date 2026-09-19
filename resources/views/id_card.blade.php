<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kartu Identitas Pedagang – SVMS</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #020617;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .wrapper { text-align: center; max-width: 420px; width: 100%; }
    .id-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
      border: 1px solid #3730a3;
      border-radius: 24px;
      padding: 32px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 0 60px rgba(99,102,241,0.3), 0 30px 80px rgba(0,0,0,0.7);
    }
    .id-card::before {
      content: '';
      position: absolute; top: -60px; right: -60px;
      width: 200px; height: 200px;
      background: radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%);
      border-radius: 50%;
    }
    .id-card::after {
      content: '';
      position: absolute; bottom: -40px; left: -40px;
      width: 160px; height: 160px;
      background: radial-gradient(circle, rgba(217,70,239,0.15), transparent 70%);
      border-radius: 50%;
    }
    .header {
      display: flex; flex-direction: column; align-items: center;
      gap: 4px; margin-bottom: 28px;
    }
    .gov-logo {
      font-size: 12px; font-weight: 700; letter-spacing: 0.15em;
      color: #a5b4fc; text-transform: uppercase;
    }
    .gov-sub {
      font-size: 10px; color: #6366f1; letter-spacing: 0.1em;
    }
    .divider {
      width: 100%; height: 1px;
      background: linear-gradient(90deg, transparent, #6366f1, transparent);
      margin: 12px 0;
    }
    .card-title {
      font-size: 13px; font-weight: 800; letter-spacing: 0.3em;
      color: #c7d2fe; text-transform: uppercase;
    }
    .photo-section {
      display: flex; align-items: center; gap: 20px;
      margin: 24px 0;
      position: relative; z-index: 1;
    }
    .photo {
      width: 90px; height: 90px; border-radius: 20px;
      border: 3px solid #6366f1;
      box-shadow: 0 0 20px rgba(99,102,241,0.4);
      flex-shrink: 0;
      object-fit: cover;
    }
    .trader-info { text-align: left; flex: 1; }
    .trader-name {
      font-size: 20px; font-weight: 900; color: #f8fafc;
      letter-spacing: -0.02em; line-height: 1.2;
    }
    .trader-type {
      font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
      color: #6366f1; margin-top: 4px; text-transform: uppercase;
    }
    .badge {
      display: inline-block; margin-top: 8px;
      padding: 3px 10px; background: rgba(16,185,129,0.15);
      border: 1px solid #10b981; border-radius: 20px;
      font-size: 9px; font-weight: 700; color: #10b981;
      text-transform: uppercase; letter-spacing: 0.1em;
    }
    .fields {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
      position: relative; z-index: 1;
    }
    .field { text-align: left; }
    .field-label {
      font-size: 9px; font-weight: 700; letter-spacing: 0.15em;
      color: #64748b; text-transform: uppercase; margin-bottom: 4px;
    }
    .field-value {
      font-size: 13px; font-weight: 700; color: #e2e8f0;
    }
    .field.full { grid-column: 1 / -1; }
    .permit-number {
      font-family: 'Courier New', monospace; font-size: 14px;
      font-weight: 900; color: #a5b4fc; letter-spacing: 0.05em;
    }
    .qr-section {
      margin-top: 24px; position: relative; z-index: 1;
      display: flex; align-items: center; justify-content: center; gap: 20px;
    }
    .qr-box {
      background: #fff; padding: 12px; border-radius: 16px;
      display: inline-block;
    }
    .qr-info { text-align: left; }
    .qr-label {
      font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
      color: #64748b; text-transform: uppercase;
    }
    .qr-value { font-size: 11px; color: #a5b4fc; font-weight: 600; margin-top: 2px; }
    .valid-until { font-size: 11px; color: #10b981; font-weight: 700; margin-top: 8px; }
    .footer {
      margin-top: 28px; position: relative; z-index: 1;
      font-size: 9px; color: #334155; letter-spacing: 0.1em;
    }
    .action-btns {
      display: flex; gap: 12px; margin-top: 24px;
    }
    .btn {
      flex: 1; padding: 14px; border: none; border-radius: 14px;
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
      cursor: pointer; transition: 0.2s;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #d946ef);
      color: #fff; box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    }
    .btn-secondary {
      background: #0f172a; border: 1px solid #1e293b;
      color: #94a3b8;
    }
    .btn:hover { transform: translateY(-2px); }
    #loading {
      color: #6366f1; font-size: 16px; font-weight: 700;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    @media print {
      body { background: white; }
      .action-btns { display: none; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div id="loading">⏳ Memuat data kartu identitas...</div>
    <div id="card-area" style="display:none;">
      <div class="id-card">
        <div class="header">
          <div class="gov-logo" id="header1">PEMERINTAH KOTA TERNATE</div>
          <div class="gov-sub" id="header2">DINAS PERINDUSTRIAN DAN PERDAGANGAN</div>
          <div class="divider"></div>
          <div class="card-title">Kartu Tanda Pengenal Pedagang</div>
        </div>

        <div class="photo-section">
          <img class="photo" id="photo" src="" alt="Foto Pedagang" />
          <div class="trader-info">
            <div class="trader-name" id="trader-name">—</div>
            <div class="trader-type" id="trader-market">—</div>
            <div class="badge">✓ AKTIF</div>
          </div>
        </div>

        <div class="fields">
          <div class="field">
            <div class="field-label">NIK</div>
            <div class="field-value" id="f-nik">—</div>
          </div>
          <div class="field">
            <div class="field-label">Lapak</div>
            <div class="field-value" id="f-slot">—</div>
          </div>
          <div class="field full">
            <div class="field-label">No. Izin (SIPTU)</div>
            <div class="permit-number" id="f-permit">—</div>
          </div>
        </div>

        <div class="qr-section">
          <div class="qr-box">
            <div id="qr-code"></div>
          </div>
          <div class="qr-info">
            <div class="qr-label">Kode Verifikasi</div>
            <div class="qr-value" id="f-qr">—</div>
            <div class="valid-until">✓ Berlaku hingga:</div>
            <div class="qr-value" id="f-valid">—</div>
          </div>
        </div>

        <div class="footer">
          Kartu ini diterbitkan secara digital oleh SVMS Enterprise v6.0 •
          Scan QR untuk verifikasi keaslian dokumen ini.
        </div>
      </div>

      <div class="action-btns">
        <button class="btn btn-secondary" onclick="history.back()">← Kembali</button>
        <button class="btn btn-primary" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
  <script>
    const path = window.location.pathname; // e.g. /trader/id-card/{id}
    const parts = path.split('/');
    // Expected: /trader/{id}/id-card  => id is parts[2]
    const id = parts[2];
    const API = 'http://103.175.219.57:8001/api';

    async function loadCard() {
      try {
        const res = await fetch(`${API}/trader/${id}/id-card`);
        if (!res.ok) throw new Error('Data tidak ditemukan');
        const d = await res.json();

        document.getElementById('trader-name').textContent = d.name || '—';
        document.getElementById('trader-market').textContent = d.market || '—';
        document.getElementById('f-nik').textContent = d.nik || '—';
        document.getElementById('f-slot').textContent = d.slot || '—';
        document.getElementById('f-permit').textContent = d.permit_number || '—';
        document.getElementById('f-qr').textContent = d.qr_code || '—';
        document.getElementById('f-valid').textContent = d.valid_until ? new Date(d.valid_until).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'}) : '—';
        document.getElementById('photo').src = d.photo_url || '';

        new QRCode(document.getElementById('qr-code'), {
          text: d.qr_code || 'SVMS-INVALID',
          width: 100, height: 100,
          colorDark: '#020617', colorLight: '#ffffff'
        });

        document.getElementById('loading').style.display = 'none';
        document.getElementById('card-area').style.display = 'block';
      } catch (e) {
        document.getElementById('loading').innerHTML = '❌ Gagal memuat data: ' + e.message;
      }
    }

    loadCard();
  </script>
</body>
</html>
