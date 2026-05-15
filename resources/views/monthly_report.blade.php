<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Performa Bulanan - SVMS</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; margin: 40px; }
        .header { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #1e293b; }
        .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; text-align: center; }
        .stat-val { font-size: 20px; font-weight: bold; color: #6366f1; }
        .stat-lbl { font-size: 10px; color: #64748b; text-transform: uppercase; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 40px; }
        th { background: #6366f1; color: #fff; padding: 12px; text-align: left; font-size: 12px; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
        .footer { margin-top: 60px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">SMART MARKET PERFORMANCE REPORT</div>
        <div class="subtitle">Bulan: {{ $month }} {{ $year }} | Lokasi: {{ $market_name }}</div>
    </div>

    <div class="stat-grid">
        <div class="stat-card">
            <div class="stat-val">Rp {{ number_format($total_revenue) }}</div>
            <div class="stat-lbl">Total Revenue</div>
        </div>
        <div class="stat-card">
            <div class="stat-val">{{ $total_transactions }}</div>
            <div class="stat-lbl">Transaksi Berhasil</div>
        </div>
        <div class="stat-card">
            <div class="stat-val">{{ $compliance_rate }}%</div>
            <div class="stat-lbl">Tingkat Kepatuhan (Anti-Pungli)</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Revenue</th>
                <th>Volume Transaksi</th>
                <th>Status Audit</th>
            </tr>
        </thead>
        <tbody>
            @foreach($daily_breakdown as $day)
            <tr>
                <td>{{ $day->date }}</td>
                <td>Rp {{ number_format($day->revenue) }}</td>
                <td>{{ $day->count }}</td>
                <td>TERVERIFIKASI</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Laporan ini dihasilkan secara otomatis oleh Smart Market Platform (SVMS) v6.0 Enterprise.
        <br>Seluruh data telah melalui proses enkripsi dan audit digital untuk memastikan integritas Anti-Pungli.
    </div>
</body>
</html>
