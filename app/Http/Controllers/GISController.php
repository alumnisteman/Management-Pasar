<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GISController extends Controller
{
    /**
     * Get GeoJSON feature collection for Market Digital Twin (15 Layers & 5 Map Modes).
     * Data diambil dari database slots, traders, permits, bills secara real-time.
     */
    public function getStalls()
    {
        return $this->digitalTwin();
    }

    public function digitalTwin()
    {
        $features = [];

        // Ambil data lapak (slots) dari database beserta relasi pedagang & tagihan
        $slots = DB::table('slots')
            ->leftJoin('assignments', 'slots.id', '=', 'assignments.slot_id')
            ->leftJoin('traders', 'assignments.trader_id', '=', 'traders.id')
            ->leftJoin('permits', function ($join) {
                $join->on('permits.slot_id', '=', 'slots.id')
                     ->where('permits.status', 'active');
            })
            ->leftJoin('bills', function ($join) {
                $join->on('bills.slot_id', '=', 'slots.id')
                     ->whereIn('bills.status', ['unpaid', 'overdue']);
            })
            ->leftJoin('zones', 'slots.zone_id', '=', 'zones.id')
            ->select([
                'slots.id',
                'slots.code',
                'slots.status',
                'slots.category',
                'slots.x_position',
                'slots.y_position',
                'zones.name as zone_name',
                DB::raw('traders.name as pedagang'),
                DB::raw('permits.permit_number as siptu_number'),
                DB::raw('SUM(bills.amount) as total_tunggakan'),
            ])
            ->groupBy(
                'slots.id', 'slots.code', 'slots.status', 'slots.category',
                'slots.x_position', 'slots.y_position', 'zones.name',
                'traders.name', 'permits.permit_number'
            )
            ->orderBy('slots.code')
            ->get();

        // Jika DB kosong, fallback ke data contoh
        if ($slots->isEmpty()) {
            $slots = $this->getFallbackSlots();
        }

        foreach ($slots as $i => $slot) {
            $arrears = (float)($slot->total_tunggakan ?? 0);
            $arrearsStatus = 'LUNAS';
            if ($arrears > 1000000)   $arrearsStatus = 'HIGH_RISK';
            elseif ($arrears > 0)     $arrearsStatus = 'WARNING';

            $xPos = $slot->x_position ?? ($i * 10);
            $yPos = $slot->y_position ?? (($i % 5) * 10);
            $lng  = 106.8272 + ($xPos * 0.00003);
            $lat  = -6.1754  + ($yPos * 0.00002);

            $features[] = [
                'type'     => 'Feature',
                'geometry' => ['type' => 'Point', 'coordinates' => [$lng, $lat]],
                'properties' => [
                    'layer'       => 'lapak',
                    'id'          => $slot->id,
                    'code'        => $slot->code,
                    'status'      => $slot->status ?? 'vacant',
                    'name'        => $slot->code,
                    'pedagang'    => $slot->pedagang ?? 'Lapak Kosong',
                    'komoditas'   => $slot->category ?? 'Umum',
                    'piutang'     => $arrearsStatus,
                    'occupancy'   => ($slot->status === 'occupied') ? 'Terisi (100%)' : 'Kosong (0%)',
                    'luas_m2'     => 7.5,
                    'dimensions'  => '3.0m x 2.5m',
                    'market_name' => 'Pasar Induk Utama',
                    'zone'        => $slot->zone_name ?? 'Zona A',
                    'siptu'       => $slot->siptu_number ?? '-',
                    'tunggakan'   => $arrears,
                ],
            ];
        }

        // Layer Infrastruktur Statis
        $infrastructures = [
            ['layer' => 'cctv',          'code' => 'CCTV-01', 'name' => 'CCTV PTZ Dome Koridor Utama',    'status' => 'ONLINE (HD 1080p)',              'lat' => -6.1751, 'lng' => 106.8275],
            ['layer' => 'cctv',          'code' => 'CCTV-02', 'name' => 'CCTV Loading Dock Parkir',        'status' => 'ONLINE (HD 1080p)',              'lat' => -6.1753, 'lng' => 106.8281],
            ['layer' => 'hydrant',       'code' => 'HYD-01',  'name' => 'Hydrant Pilar Utama Zona A',      'status' => 'READY (Tekanan 4.5 Bar)',         'lat' => -6.1752, 'lng' => 106.8278],
            ['layer' => 'apar',          'code' => 'APAR-01', 'name' => 'APAR Powder 6kg Blok A',          'status' => 'VALID (Expired: Dec 2026)',       'lat' => -6.1754, 'lng' => 106.8273],
            ['layer' => 'toilet',        'code' => 'TLT-01',  'name' => 'Toilet Umum Pria & Wanita',       'status' => 'BERSIH (Sanitasi Grade A)',       'lat' => -6.1750, 'lng' => 106.8285],
            ['layer' => 'tempat_sampah', 'code' => 'TPS-01',  'name' => 'TPS Terpadu & Recycling Node',    'status' => 'AKTIF (Pengangkutan 2x/hari)',    'lat' => -6.1756, 'lng' => 106.8288],
            ['layer' => 'jalan',         'code' => 'JLN-01',  'name' => 'Koridor Utama Pedestrian',        'status' => 'LEBAR 4.0 meter',                'lat' => -6.1753, 'lng' => 106.8276],
            ['layer' => 'parkir',        'code' => 'PRK-01',  'name' => 'Area Parkir Motor & Mobil',       'status' => 'KAPASITAS: 150 Motor / 30 Mobil', 'lat' => -6.1758, 'lng' => 106.8280],
            ['layer' => 'gudang',        'code' => 'GDG-01',  'name' => 'Gudang Cold Storage Sembako',     'status' => 'SUHU: 4°C (Kapasitas 10 Ton)',   'lat' => -6.1749, 'lng' => 106.8279],
            ['layer' => 'listrik',       'code' => 'LSK-01',  'name' => 'Panel KWH Utama 33,000 VA',       'status' => 'NORMAL (Tegangan 220V)',           'lat' => -6.1751, 'lng' => 106.8271],
            ['layer' => 'air',           'code' => 'AIR-01',  'name' => 'Meteran Air PDAM Utama',          'status' => 'FLOW: 12 m³/jam',                'lat' => -6.1755, 'lng' => 106.8274],
        ];

        foreach ($infrastructures as $infra) {
            $features[] = [
                'type'     => 'Feature',
                'geometry' => ['type' => 'Point', 'coordinates' => [$infra['lng'], $infra['lat']]],
                'properties' => [
                    'layer'  => $infra['layer'],
                    'code'   => $infra['code'],
                    'name'   => $infra['name'],
                    'status' => $infra['status'],
                ],
            ];
        }

        return response()->json([
            'type'     => 'FeatureCollection',
            'metadata' => [
                'total_slots'  => $slots->count(),
                'generated_at' => now()->toIso8601String(),
                'map_modes'    => [
                    '2D_GRID_LAYOUT'            => 'Denah 2D Interaktif Lapak & Blok',
                    'HEATMAP_OCCUPANCY'         => 'Heatmap Kepadatan Lapak (Terisi vs Kosong)',
                    'FINANCIAL_ARREARS_MAP'     => 'Peta Gradasi Risiko Tunggakan Piutang',
                    'COMMODITY_ZONE_MAP'        => 'Peta Sebaran Komoditas Pasar',
                    'INFRASTRUCTURE_FACILITIES' => 'Overlapping Fasilitas Safe & Utility',
                ],
                'layers' => [
                    'lapak', 'pedagang', 'komoditas', 'piutang', 'occupancy',
                    'cctv', 'hydrant', 'apar', 'toilet', 'tempat_sampah',
                    'jalan', 'parkir', 'gudang', 'listrik', 'air',
                ],
            ],
            'features' => $features,
        ]);
    }

    /**
     * 360° Digital Twin Modal Data untuk lapak yang diklik.
     */
    public function stallDetail($code)
    {
        $stallCode = strtoupper($code);

        $slot = DB::table('slots')
            ->leftJoin('zones', 'slots.zone_id', '=', 'zones.id')
            ->where('slots.code', $stallCode)
            ->select('slots.*', 'zones.name as zone_name')
            ->first();

        if (!$slot) {
            return $this->getFallbackStallDetail($stallCode);
        }

        // Pedagang aktif via assignments
        $trader = DB::table('traders')
            ->join('assignments', 'traders.id', '=', 'assignments.trader_id')
            ->where('assignments.slot_id', $slot->id)
            ->select('traders.*')
            ->first();

        // Jika tidak ada di assignments, coba via permits
        if (!$trader) {
            $trader = DB::table('traders')
                ->join('permits', 'traders.id', '=', 'permits.trader_id')
                ->where('permits.slot_id', $slot->id)
                ->where('permits.status', 'active')
                ->select('traders.*')
                ->first();
        }

        // SIPTU aktif
        $permit = DB::table('permits')
            ->where('slot_id', $slot->id)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->first();

        // Tagihan
        $bills      = DB::table('bills')->where('slot_id', $slot->id)->orderBy('due_date', 'desc')->get();
        $totalBill  = $bills->whereIn('status', ['unpaid', 'overdue'])->sum('amount');
        $latestBill = $bills->first();
        $billStatus = $latestBill ? strtoupper($latestBill->status) : 'LUNAS';

        // Pembayaran terakhir
        $lastPayment = DB::table('payments')
            ->join('bills', 'payments.bill_id', '=', 'bills.id')
            ->where('bills.slot_id', $slot->id)
            ->orderBy('payments.created_at', 'desc')
            ->select('payments.*')
            ->first();

        // Inspeksi terakhir
        $inspection = DB::table('patrol_logs')
            ->where('slot_id', $slot->id)
            ->orderBy('created_at', 'desc')
            ->first();

        // Keluhan terakhir
        $complaint = DB::table('complaints')
            ->where('slot_id', $slot->id)
            ->orderBy('created_at', 'desc')
            ->first();

        // Histori SIPTU
        $history = DB::table('permits')
            ->where('permits.slot_id', $slot->id)
            ->join('traders', 'permits.trader_id', '=', 'traders.id')
            ->orderBy('permits.created_at', 'desc')
            ->select('permits.*', 'traders.name as trader_name')
            ->get()
            ->map(fn($p) => [
                'year'   => date('Y', strtotime($p->created_at)) . ' - ' . ($p->valid_until ? date('Y', strtotime($p->valid_until)) : 'Sekarang'),
                'tenant' => $p->trader_name,
                'action' => 'SIPTU ' . ucfirst($p->status),
                'status' => ucfirst($p->status),
            ])->toArray();

        if (empty($history)) {
            $history = [['year' => date('Y') . ' - Sekarang', 'tenant' => $trader->name ?? '-', 'action' => 'Sewa Aktif', 'status' => 'Aktif']];
        }

        // Komoditas
        $komoditasMap = [
            'Sembako'           => ['category' => 'Sembako & Beras Utama',  'primary_items' => 'Beras, Minyak, Gula, Telur',       'daily_stock_est' => '1.5 Ton',   'price_band' => 'Sesuai HET Pemerintah'],
            'Sayur & Buah'      => ['category' => 'Sayur & Buah Segar',     'primary_items' => 'Bayam, Kangkung, Pisang, Jeruk',   'daily_stock_est' => '800 Kg',    'price_band' => 'Pasar (Fluktuatif)'],
            'Daging & Ikan'     => ['category' => 'Daging & Ikan Segar',    'primary_items' => 'Ayam, Sapi, Lele, Bandeng',        'daily_stock_est' => '500 Kg',    'price_band' => 'Pasar (Fluktuatif)'],
            'Pakaian & Tekstil' => ['category' => 'Sandang & Tekstil',      'primary_items' => 'Kain, Baju, Kerudung',             'daily_stock_est' => 'Variatif',  'price_band' => 'Grosir - Eceran'],
            'Jasa & Kuliner'    => ['category' => 'Kuliner & Jasa',         'primary_items' => 'Makanan Siap Saji, Minuman',       'daily_stock_est' => 'Variatif',  'price_band' => 'Eceran'],
        ];
        $komoditasData = $komoditasMap[$slot->category] ?? ['category' => $slot->category ?? 'Umum', 'primary_items' => '-', 'daily_stock_est' => '-', 'price_band' => '-'];

        $cleanlinessGrade = 'GRADE A (Sangat Bersih)';
        if ($inspection) {
            $score = (int)($inspection->cleanliness_score ?? 5);
            $cleanlinessGrade = $score >= 4 ? 'GRADE A (Sangat Bersih)' : ($score >= 3 ? 'GRADE B (Bersih)' : 'GRADE C (Perlu Perhatian)');
        }

        return response()->json([
            'stall_info' => [
                'code'          => $slot->code,
                'block'         => 'Blok ' . substr($slot->code, 0, 1) . ' (' . ($slot->category ?? 'Umum') . ')',
                'zone'          => $slot->zone_name ?? 'Zona A',
                'dimensions'    => '3.0m x 2.5m',
                'luas_m2'       => 7.5,
                'status'        => strtoupper($slot->status ?? 'vacant'),
                'photo'         => 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60',
                'kwh_meter_no'  => 'KWH-' . strtoupper(substr(md5($slot->id), 0, 7)),
                'pdam_meter_no' => 'PAM-' . strtoupper(substr(md5($slot->id . 'pdam'), 0, 6)),
            ],
            'pedagang' => [
                'id'               => $trader->id ?? '-',
                'nik'              => $trader->nik ?? '-',
                'name'             => $trader->name ?? 'Lapak Kosong',
                'phone'            => $trader->phone ?? '-',
                'photo'            => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                'siptu_number'     => $permit->permit_number ?? '-',
                'siptu_expires'    => $permit && $permit->valid_until ? date('d F Y', strtotime($permit->valid_until)) : '-',
                'reputation_score' => $trader->reputation_score ?? 0,
                'status'           => $trader ? strtoupper($trader->status ?? 'ACTIVE') : '-',
                'jenis_dagangan'   => $trader->jenis_dagangan ?? ($slot->category ?? 'Umum'),
            ],
            'tagihan' => [
                'monthly_rent'       => 450000,
                'daily_retribusi'    => 15000,
                'kwh_usage_rp'       => 125000,
                'pdam_usage_rp'      => 45000,
                'total_current_bill' => $totalBill > 0 ? $totalBill : ($latestBill->amount ?? 0),
                'status'             => $billStatus,
                'due_date'           => $latestBill && $latestBill->due_date ? date('d F Y', strtotime($latestBill->due_date)) : '-',
            ],
            'pembayaran' => [
                'last_payment_date'   => $lastPayment ? date('d F Y', strtotime($lastPayment->created_at)) : '-',
                'last_payment_amount' => $lastPayment->amount_paid ?? 0,
                'payment_method'      => $lastPayment->method ?? 'QRIS DYNAMIC (Bank DKI / GoPay)',
                'receipt_no'          => $lastPayment ? 'RCP-' . strtoupper(substr(md5($lastPayment->id), 0, 12)) : '-',
                'status'              => $lastPayment ? 'VERIFIED_SUCCESS' : 'BELUM_ADA_PEMBAYARAN',
            ],
            'komoditas'  => $komoditasData,
            'inspection' => [
                'last_inspection_at' => $inspection ? $inspection->created_at : '-',
                'inspector_name'     => $inspection ? 'Officer (ID: ' . strtoupper(substr($inspection->officer_id ?? 'N/A', 0, 8)) . ')' : '-',
                'cleanliness'        => $cleanlinessGrade,
                'security'           => $inspection ? strtoupper($inspection->security_status ?? 'secure') : '-',
                'payment_verified'   => in_array($billStatus, ['PAID', 'LUNAS']),
                'notes'              => $inspection->notes ?? 'Belum ada catatan inspeksi.',
            ],
            'complaint' => [
                'total_tickets' => $complaint ? 1 : 0,
                'latest_ticket' => $complaint->ticket_number ?? '-',
                'issue'         => $complaint->description ?? 'Tidak ada pengaduan aktif.',
                'priority'      => $complaint ? strtoupper($complaint->priority ?? 'normal') : '-',
                'status'        => $complaint ? strtoupper($complaint->status ?? 'open') : 'NO_COMPLAINT',
            ],
            'histori_lapak' => $history,
        ]);
    }

    private function getFallbackSlots()
    {
        $commodities = ['Sembako', 'Sayur & Buah', 'Daging & Ikan', 'Pakaian & Tekstil', 'Jasa & Kuliner'];
        $traderNames = ['Hj. Aminah', 'H. Syamsul', 'Budi Santoso', 'Siti Rahma', 'Ahmad Ridwan', 'Dewi Lestari'];
        $result = [];
        for ($i = 1; $i <= 30; $i++) {
            $status  = ($i % 5 == 0) ? 'vacant' : (($i % 9 == 0) ? 'maintenance' : 'occupied');
            $result[] = (object)[
                'id'              => 'fallback-' . $i,
                'code'            => sprintf("A-%03d", $i),
                'status'          => $status,
                'category'        => $commodities[$i % count($commodities)],
                'x_position'      => $i * 10,
                'y_position'      => ($i % 5) * 10,
                'zone_name'       => 'Zona ' . chr(64 + ($i % 3 + 1)),
                'pedagang'        => $status === 'occupied' ? $traderNames[$i % count($traderNames)] : 'Toko Kosong',
                'siptu_number'    => 'SIPTU-M01-' . sprintf("A-%03d", $i),
                'total_tunggakan' => ($i % 6 == 0) ? 1500000 : (($i % 4 == 0) ? 500000 : 0),
            ];
        }
        return collect($result);
    }

    private function getFallbackStallDetail($code)
    {
        return response()->json([
            'stall_info'    => ['code' => $code, 'block' => 'Blok A (Sembako & Utama)', 'zone' => 'Zona A', 'dimensions' => '3.0m x 2.5m', 'luas_m2' => 7.5, 'status' => 'VACANT', 'photo' => 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60', 'kwh_meter_no' => 'KWH-0000000', 'pdam_meter_no' => 'PAM-000000'],
            'pedagang'      => ['id' => '-', 'nik' => '-', 'name' => 'Lapak Belum Diisi', 'phone' => '-', 'photo' => '', 'siptu_number' => '-', 'siptu_expires' => '-', 'reputation_score' => 0, 'status' => '-', 'jenis_dagangan' => '-'],
            'tagihan'       => ['monthly_rent' => 0, 'daily_retribusi' => 0, 'kwh_usage_rp' => 0, 'pdam_usage_rp' => 0, 'total_current_bill' => 0, 'status' => '-', 'due_date' => '-'],
            'pembayaran'    => ['last_payment_date' => '-', 'last_payment_amount' => 0, 'payment_method' => '-', 'receipt_no' => '-', 'status' => '-'],
            'komoditas'     => ['category' => 'Umum', 'primary_items' => '-', 'daily_stock_est' => '-', 'price_band' => '-'],
            'inspection'    => ['last_inspection_at' => '-', 'inspector_name' => '-', 'cleanliness' => '-', 'security' => '-', 'payment_verified' => false, 'notes' => '-'],
            'complaint'     => ['total_tickets' => 0, 'latest_ticket' => '-', 'issue' => 'Tidak ada pengaduan aktif.', 'priority' => '-', 'status' => 'NO_COMPLAINT'],
            'histori_lapak' => [],
        ]);
    }
}
