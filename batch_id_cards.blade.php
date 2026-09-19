<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Batch Cetak Kartu Identitas Pedagang - SVMS</title>
    <style>
        body { font-family: sans-serif; background: #f1f5f9; padding: 20px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .card { 
            background: linear-gradient(135deg, #1e293b, #0f172a); 
            border-radius: 16px; padding: 20px; color: #fff; 
            border: 1px solid #334155; height: 250px; position: relative; overflow: hidden;
            page-break-inside: avoid;
        }
        .card-header { display: flex; gap: 15px; align-items: center; }
        .photo { width: 60px; height: 60px; border-radius: 8px; border: 2px solid #6366f1; object-fit: cover; }
        .title { font-size: 8px; font-weight: 800; color: #6366f1; text-transform: uppercase; letter-spacing: 0.1em; }
        .name { font-size: 16px; font-weight: 700; margin-top: 2px; }
        .nik { font-size: 10px; color: #94a3b8; }
        .details { margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .detail-item { font-size: 8px; color: #94a3b8; text-transform: uppercase; }
        .detail-val { font-size: 10px; font-weight: 700; color: #fff; }
        .qr { position: absolute; bottom: 20px; right: 20px; background: #fff; padding: 5px; border-radius: 8px; width: 60px; height: 60px; }
    </style>
</head>
<body>
    <div class="grid">
        @foreach($traders as $t)
        <div class="card">
            <div class="card-header">
                <img src="{{ $t['photo_url'] }}" class="photo">
                <div>
                    <div class="title">Kartu Identitas Pedagang</div>
                    <div class="name">{{ $t['name'] }}</div>
                    <div class="nik">{{ $t['nik'] }}</div>
                </div>
            </div>
            <div class="details">
                <div><div class="detail-item">Pasar</div><div class="detail-val">{{ $t['market'] }}</div></div>
                <div><div class="detail-item">Blok/Lapak</div><div class="detail-val">{{ $t['slot'] }}</div></div>
                <div><div class="detail-item">Nomor Izin</div><div class="detail-val" style="color:#eab308">{{ $t['permit_number'] }}</div></div>
                <div><div class="detail-item">Status</div><div class="detail-val">AKTIF</div></div>
            </div>
            <div class="qr">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data={{ $t['qr_code'] }}" style="width:100%;">
            </div>
        </div>
        @endforeach
    </div>
</body>
</html>
