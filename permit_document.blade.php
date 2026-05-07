<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Izin Penempatan Tempat Usaha (SIPTU) - SVMS</title>
    <style>
        body { font-family: 'Times New Roman', serif; padding: 50px; border: 10px double #1e293b; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header img { width: 80px; }
        .header .title { font-size: 22px; font-weight: bold; text-transform: uppercase; margin-top: 10px; }
        .header .subtitle { font-size: 14px; margin-top: 5px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .content { margin-top: 30px; line-height: 1.6; }
        .content table { width: 100%; margin-top: 20px; }
        .content td { padding: 8px; vertical-align: top; }
        .qr-section { text-align: center; margin-top: 40px; }
        .footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
        .signature { text-align: center; }
        .signature-name { font-weight: bold; text-decoration: underline; margin-top: 60px; }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="margin:0;letter-spacing:2px;">{{ $header_1 }}</h2>
        <h3 style="margin:5px 0;font-weight:900;">{{ $header_2 }}</h3>
        <p style="margin:0;font-size:12px;">{{ $location }}</p>
        <div style="border-bottom:3px double #000;margin-top:10px;"></div>
    </div>

    <div style="text-align:center;margin:20px 0;">
        <h3 style="text-decoration:underline;margin-bottom:5px;">SURAT IZIN PENEMPATAN TEMPAT USAHA (SIPTU)</h3>
        <p style="margin:0;font-size:14px;">Nomor: {{ $permit_number }}</p>
    </div>

    <div class="content">
        Diberikan izin kepada:
        <table>
            <tr><td width="30%">Nama Pedagang</td><td>: <b>{{ $trader_name }}</b></td></tr>
            <tr><td>Nomor Identitas (NIK)</td><td>: {{ $nik }}</td></tr>
            <tr><td>Lokasi Pasar</td><td>: {{ $market_name }}</td></tr>
            <tr><td>Blok / Nomor Lapak</td><td>: <b>{{ $slot_code }}</b></td></tr>
            <tr><td>Jenis Usaha</td><td>: {{ $location_type }}</td></tr>
        </table>
        
        <p style="margin-top: 20px;">Izin ini berlaku mulai tanggal <b>{{ $issued_at }}</b> sampai dengan <b>{{ $expires_at }}</b>. Pemegang izin wajib mematuhi seluruh peraturan pengelolaan pasar yang berlaku dan dilarang memindahtangankan izin ini tanpa persetujuan tertulis.</p>
    </div>

    <div class="footer">
        <div class="qr-section">
            <div id="qr-container">
                <!-- QR will be rendered here by backend or as an image -->
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data={{ $qr_payload }}" alt="QR Code Verification">
            </div>
            <div style="font-size: 9px; margin-top: 5px;">Scan untuk Verifikasi Digital</div>
        </div>
        <div class="signature">
            Dikeluarkan di: Jakarta<br>
            Pada Tanggal: {{ $issued_at }}<br>
            Kepala Unit Pengelola Pasar,<br><br><br>
            <div style="font-weight: bold; margin-top: 60px;">{{ $sig_name }}</div>
            <div style="font-size: 12px;">{{ $sig_nip }}</div>
        </div>
    </div>
</body>
</html>
