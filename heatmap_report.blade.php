<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Okupansi & Heatmap Pasar - SVMS</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #1e293b; padding: 40px; }
        .header { text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px; }
        .grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 5px; margin-top: 20px; }
        .slot { 
            aspect-ratio: 1; border: 1px solid #cbd5e1; display: flex; 
            align-items: center; justify-content: center; font-size: 8px; font-weight: bold;
            color: #fff;
        }
        .occupied { background-color: #ef4444; }
        .available { background-color: #10b981; }
        .blocked { background-color: #f59e0b; }
        .legend { margin-top: 30px; display: flex; gap: 20px; font-size: 10px; }
        .legend-item { display: flex; align-items: center; gap: 5px; }
        .dot { width: 10px; height: 10px; border-radius: 2px; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin:0;">LAPORAN OKUPANSI ZONASI</h1>
        <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Smart Market Management System (SVMS) v6.0</div>
        <div style="margin-top: 10px; font-weight: bold;">Tanggal Laporan: {{ $date }}</div>
    </div>

    <div class="grid">
        @foreach($slots as $s)
        <div class="slot {{ $s->status }}">
            {{ $s->code }}
        </div>
        @endforeach
    </div>

    <div class="legend">
        <div class="legend-item"><div class="dot available"></div> Terisi (Available/Active)</div>
        <div class="legend-item"><div class="dot occupied"></div> Penuh (Occupied)</div>
        <div class="legend-item"><div class="dot blocked"></div> Diblokir (Blocked)</div>
    </div>

    <div style="margin-top: 50px; font-size: 10px; color: #94a3b8; text-align: center;">
        Dokumen ini dihasilkan secara otomatis oleh SVMS AI Engine. Keaslian data dapat diverifikasi melalui dashboard pusat.
    </div>
</body>
</html>
