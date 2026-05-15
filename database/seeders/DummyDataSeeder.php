<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Market;
use App\Models\User;
use App\Models\Zone;
use App\Models\Slot;
use App\Models\Trader;
use App\Models\Permit;
use App\Models\Payment;
use App\Models\AuditLog;
use App\Models\PriceLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $market = Market::firstOrCreate(
            ['name' => 'Pasar Induk Modern SVMS'],
            [
                'id' => (string) Str::uuid(),
                'address' => 'Jl. Kebenaran No. 1, Jakarta',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'is_active' => true
            ]
        );

        $zBasah = Zone::firstOrCreate(['name' => 'ZONA BASAH'], ['id' => (string) Str::uuid(), 'market_id' => $market->id, 'description' => 'Basah', 'color' => '#3b82f6']);
        $zKering = Zone::firstOrCreate(['name' => 'ZONA KERING'], ['id' => (string) Str::uuid(), 'market_id' => $market->id, 'description' => 'Kering', 'color' => '#f59e0b']);
        $zKuliner = Zone::firstOrCreate(['name' => 'ZONA KULINER'], ['id' => (string) Str::uuid(), 'market_id' => $market->id, 'description' => 'Kuliner', 'color' => '#10b981']);

        // Generate Traders & Slots
        $zones = [$zBasah, $zKering, $zKuliner];
        $traders = [];
        for ($i = 1; $i <= 60; $i++) {
            $trader = Trader::create([
                'id' => (string) Str::uuid(),
                'market_id' => $market->id,
                'name' => 'Pedagang ' . $i,
                'nik' => '320101010' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'phone' => '081234' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'type' => $i % 3 == 0 ? 'harian' : 'tetap',
                'status' => 'active',
                'scale' => 'menengah',
                'location_type' => 'lapak'
            ]);
            $traders[] = $trader;

            $zone = $zones[$i % 3];
            $uniqueCode = strtoupper(substr($zone->name, 5, 1)) . '-' . str_pad($i, 3, '0', STR_PAD_LEFT);
            
            // Check if code exists, if so append a suffix
            if (Slot::where('code', $uniqueCode)->exists()) {
                $uniqueCode .= '-' . strtoupper(Str::random(3));
            }

            $slot = Slot::create([
                'id' => (string) Str::uuid(),
                'market_id' => $market->id,
                'zone_id' => $zone->id,
                'code' => $uniqueCode,
                'category' => strtolower(substr($zone->name, 5)),
                'type' => 'lapak',
                'status' => 'active',
                'x_position' => ($i % 5) * 10,
                'y_position' => floor($i / 5) * 10
            ]);

            // Create a permit for this trader and slot
            $permitNumber = 'PMT-' . strtoupper(Str::random(8));
            Permit::create([
                'id' => (string) Str::uuid(),
                'trader_id' => $trader->id,
                'slot_id' => $slot->id,
                'permit_number' => $permitNumber,
                'qr_code_payload' => "PERMIT|{$permitNumber}|{$trader->id}|{$slot->id}",
                'issued_at' => now(),
                'expires_at' => now()->addYear(),
                'status' => 'active',
                'is_digital' => true
            ]);
        }

        // Generate Payments for the last 7 days
        foreach ($traders as $t) {
            for ($daysAgo = 0; $daysAgo < 7; $daysAgo++) {
                if (rand(1, 100) <= 80) { // 80% chance of paying
                    Payment::create([
                        'id' => (string) Str::uuid(),
                        'bill_id' => null,
                        'transaction_id' => null,
                        'payment_method' => rand(1, 100) > 70 ? 'qris' : 'cash',
                        'amount_paid' => 5000,
                        'paid_at' => Carbon::now()->subDays($daysAgo)->setHour(rand(6, 12)),
                        'receipt_url' => null
                    ]);
                }
            }
        }

        // Generate Audit Logs
        $events = ['slot_booking', 'trader_registered', 'payment_failed', 'reputation_changed', 'patrol_log'];
        for ($i = 0; $i < 20; $i++) {
            AuditLog::create([
                'id' => (string) Str::uuid(),
                'user_id' => null,
                'action' => $events[array_rand($events)],
                'payload' => json_encode(['info' => 'Aktivitas sistem otomatis by DummyDataSeeder']),
                'created_at' => Carbon::now()->subHours(rand(1, 48))
            ]);
        }

        // Generate Price Logs
        $commodities = ['Beras Premium', 'Daging Sapi', 'Cabai Merah', 'Minyak Goreng', 'Bawang Merah'];
        $basePrices = [15000, 120000, 60000, 18000, 35000];
        
        for ($i = 0; $i < count($commodities); $i++) {
            for ($daysAgo = 0; $daysAgo < 7; $daysAgo++) {
                $fluctuation = rand(-2000, 2000);
                PriceLog::create([
                    'commodity_name' => $commodities[$i],
                    'price' => $basePrices[$i] + $fluctuation,
                    'recorded_at' => Carbon::now()->subDays($daysAgo)->format('Y-m-d'),
                    'slot_id' => null
                ]);
            }
        }
    }
}
