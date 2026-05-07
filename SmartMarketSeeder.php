<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Market;
use App\Models\User;
use App\Models\Zone;
use App\Models\Slot;
use App\Models\Trader;
use App\Models\Device;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SmartMarketSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Default Market
        $market = Market::create([
            'id' => (string) Str::uuid(),
            'name' => 'Pasar Induk Modern SVMS',
            'address' => 'Jl. Kebenaran No. 1, Jakarta',
            'latitude' => -6.2088,
            'longitude' => 106.8456,
            'is_active' => true
        ]);

        // 2. Default Device
        $device = Device::create([
            'id' => (string) Str::uuid(),
            'name' => 'TAB-GALAXY-PUNGLI-ZERO',
            'platform' => 'Android',
            'is_active' => true
        ]);

        // 3. Officer User
        $officer = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Budi Santoso',
            'email' => 'officer@svms.id',
            'password' => Hash::make('password'),
            'role' => 'officer',
            'market_id' => $market->id,
            'device_id' => $device->id,
            'is_active' => true
        ]);

        // 4. Zones
        $zBasah = Zone::create([
            'id' => (string) Str::uuid(),
            'market_id' => $market->id,
            'name' => 'ZONA BASAH',
            'description' => 'Komoditas Daging, Ikan, dan Sayuran',
            'color' => '#3b82f6'
        ]);

        $zKering = Zone::create([
            'id' => (string) Str::uuid(),
            'market_id' => $market->id,
            'name' => 'ZONA KERING',
            'description' => 'Pakaian dan Sembako',
            'color' => '#f59e0b'
        ]);

        // 5. Traders
        $trader = Trader::create([
            'id' => (string) Str::uuid(),
            'market_id' => $market->id,
            'name' => 'Haji Lulung',
            'nik' => '3201010101010001',
            'phone' => '08123456789',
            'type' => 'tetap',
            'status' => 'active',
            'scale' => 'menengah',
            'location_type' => 'kios'
        ]);

        // 6. Slots
        Slot::create([
            'id' => (string) Str::uuid(),
            'market_id' => $market->id,
            'zone_id' => $zBasah->id,
            'code' => 'B-01',
            'category' => 'basah',
            'type' => 'kios',
            'status' => 'active'
        ]);

        Slot::create([
            'id' => (string) Str::uuid(),
            'market_id' => $market->id,
            'zone_id' => $zKering->id,
            'code' => 'K-05',
            'category' => 'kering',
            'type' => 'lapak',
            'status' => 'active'
        ]);
    }
}
