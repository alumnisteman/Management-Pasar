<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Trader;
use App\Models\Zone;
use App\Models\Slot;
use App\Models\Device;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class FinalMasterSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create System User (Officer)
        $officer = User::updateOrCreate(
            ['email' => 'officer1@svms.id'],
            ['name' => 'Petugas Lapangan 1', 'password' => Hash::make('password')]
        );

        // 2. Create Device
        $device = Device::updateOrCreate(
            ['name' => 'TAB-SAMSUNG-01'],
            ['id' => (string) Str::uuid(), 'is_active' => true]
        );

        // 3. Create Zones
        $zBasah = Zone::updateOrCreate(['name' => 'ZONA BASAH'], ['id' => (string) Str::uuid(), 'description' => 'Ikan, Daging, Sayur']);
        $zKering = Zone::updateOrCreate(['name' => 'ZONA KERING'], ['id' => (string) Str::uuid(), 'description' => 'Pakaian, Alat Rumah Tangga']);
        $zKuliner = Zone::updateOrCreate(['name' => 'ZONA KULINER'], ['id' => (string) Str::uuid(), 'description' => 'Makanan Siap Saji']);

        // 4. Create Traders (Pedagang)
        $traders = [
            ['name' => 'Haji Hasan', 'nik' => '7201010101010001', 'type' => 'tetap'],
            ['name' => 'Ibu Siti', 'nik' => '7201010101010002', 'type' => 'harian'],
            ['name' => 'Bapak Budi', 'nik' => '7201010101010003', 'type' => 'musiman'],
        ];

        foreach ($traders as $t) {
            Trader::updateOrCreate(
                ['nik' => $t['nik']],
                ['id' => (string) Str::uuid(), 'name' => $t['name'], 'type' => $t['type'], 'status' => 'active']
            );
        }

        // 5. Create Slots (GRID)
        $slots = [
            ['code' => 'A1', 'zone' => $zBasah->id],
            ['code' => 'A2', 'zone' => $zBasah->id],
            ['code' => 'B1', 'zone' => $zKering->id],
            ['code' => 'C1', 'zone' => $zKuliner->id],
        ];

        foreach ($slots as $s) {
            Slot::updateOrCreate(
                ['code' => $s['code']],
                ['id' => (string) Str::uuid(), 'zone_id' => $s['zone'], 'x_position' => 0, 'y_position' => 0, 'status' => 'active']
            );
        }
    }
}
