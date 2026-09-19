<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(RolesAndPermissionsSeeder::class);
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('payments')->truncate();
        DB::table('bills')->truncate();
        DB::table('patrol_logs')->truncate();
        DB::table('complaints')->truncate();
        DB::table('permits')->truncate();
        DB::table('traders')->truncate();
        DB::table('slots')->truncate();
        DB::table('zones')->truncate();
        DB::table('markets')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Buat Market
        $marketId = (string) Str::uuid();
        DB::table('markets')->insert([
            'id' => $marketId,
            'name' => 'Pasar Induk Utama',
            'latitude' => -6.1754,
            'longitude' => 106.8272,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Buat Zones
        $zoneIds = [];
        $zones = ['Zona A (Sembako)', 'Zona B (Daging)', 'Zona C (Sayur)'];
        foreach($zones as $i => $z) {
            $zid = (string) Str::uuid();
            $zoneIds[] = $zid;
            DB::table('zones')->insert([
                'id' => $zid,
                'market_id' => $marketId,
                'name' => $z,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. Buat Lapak, Pedagang, Izin, Tagihan
        $commodities = ['Sembako', 'Sayur & Buah', 'Daging & Ikan', 'Pakaian & Tekstil', 'Jasa & Kuliner'];
        $traderNames = ['Hj. Aminah', 'H. Syamsul', 'Budi Santoso', 'Siti Rahma', 'Ahmad Ridwan', 'Dewi Lestari', 'Eko Prasetyo', 'Nurul Hidayah'];
        
        for ($i = 1; $i <= 30; $i++) {
            $code = sprintf("A-%03d", $i);
            $status = ($i % 5 == 0) ? 'vacant' : (($i % 9 == 0) ? 'maintenance' : 'occupied');
            $commodity = $commodities[$i % count($commodities)];
            
            $slotId = (string) Str::uuid();
            $zoneId = $zoneIds[$i % 3];
            
            DB::table('slots')->insert([
                'id' => $slotId,
                'market_id' => $marketId,
                'zone_id' => $zoneId,
                'code' => $code,
                'x_position' => $i * 10,
                'y_position' => ($i % 5) * 10,
                'status' => $status,
                'category' => $commodity,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($status === 'occupied') {
                // Buat Trader
                $traderId = (string) Str::uuid();
                $traderName = $traderNames[$i % count($traderNames)];
                DB::table('traders')->insert([
                    'id' => $traderId,
                    'name' => $traderName,
                    'nik' => '31710' . rand(10000000000, 99999999999),
                    'phone' => '08' . rand(1111111111, 9999999999),
                    'reputation_score' => rand(70, 100),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Buat Permit (SIPTU)
                $permitId = (string) Str::uuid();
                DB::table('permits')->insert([
                    'id' => $permitId,
                    'trader_id' => $traderId,
                    'slot_id' => $slotId,
                    'permit_number' => "SIPTU-M01-ZON-BLK-{$code}",
                    'valid_until' => now()->addYears(2),
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Buat Tagihan (Bills)
                $billStatus = ($i % 6 == 0) ? 'overdue' : (($i % 4 == 0) ? 'unpaid' : 'paid');
                DB::table('bills')->insert([
                    'id' => (string) Str::uuid(),
                    'permit_id' => $permitId,
                    'amount' => 450000 + rand(10000, 50000),
                    'type' => 'rent',
                    'status' => $billStatus,
                    'due_date' => now()->addDays(rand(-10, 10)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Inspeksi Patrol
                DB::table('patrol_logs')->insert([
                    'id' => (string) Str::uuid(),
                    'slot_id' => $slotId,
                    'officer_id' => (string) Str::uuid(), // dummy
                    'cleanliness_score' => rand(1, 5),
                    'security_status' => 'secure',
                    'notes' => 'Pemeriksaan rutin berjalan baik.',
                    'created_at' => now()->subDays(rand(1, 5)),
                    'updated_at' => now(),
                ]);

                // Komplain
                if ($i % 7 == 0) {
                    DB::table('complaints')->insert([
                        'id' => (string) Str::uuid(),
                        'trader_id' => $traderId,
                        'slot_id' => $slotId,
                        'ticket_number' => 'TCK-' . rand(1000, 9999),
                        'description' => 'Ada kerusakan pada saluran pembuangan air.',
                        'priority' => 'high',
                        'status' => 'open',
                        'created_at' => now()->subDays(rand(1, 3)),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
