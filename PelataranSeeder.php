<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Market;
use App\Models\Zone;
use App\Models\Block;
use App\Models\Slot;

class PelataranSeeder extends Seeder
{
    public function run(): void
    {
        $marketId = '484093a4-60af-4f1b-b434-c6f8cd99862f';
        
        $zone = Zone::updateOrCreate(
            ['kode_zona' => 'PLT'],
            [
                'market_id' => $marketId,
                'name' => 'Zona Pelataran',
                'jenis_zona' => 'campuran',
                'color' => '#64748b',
                'description' => 'Area pelataran jalan dan akses luar pasar'
            ]
        );

        $block = Block::updateOrCreate(
            ['kode_blok' => 'PLT-DEP'],
            [
                'market_id' => $marketId,
                'zona_id' => $zone->id,
                'name' => 'Pelataran Depan',
                'lantai' => '0',
                'kapasitas' => 10
            ]
        );

        for ($i = 1; $i <= 5; $i++) {
            Slot::updateOrCreate(
                ['code' => 'PLT-00' . $i],
                [
                    'market_id' => $marketId,
                    'zone_id' => $zone->id,
                    'block_id' => $block->id,
                    'kode_lapak' => 'PLT-00' . $i,
                    'status' => 'empty',
                    'type' => 'pelataran',
                    'tipe' => 'pelataran',
                    'category' => 'pelataran',
                    'price' => 5000.00,
                    'panjang' => 1.5,
                    'lebar' => 1.5
                ]
            );
        }
    }
}
