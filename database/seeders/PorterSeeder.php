<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Porter;
use App\Models\PorterJob;
use Carbon\Carbon;

class PorterSeeder extends Seeder
{
    public function run()
    {
        $p1 = Porter::create([
            'name' => 'Djauhar Arifin',
            'id_number' => 'KP-001',
            'phone' => '081234567890',
            'status' => 'available',
            'rating' => 4.9,
            'daily_earnings' => 45000,
            'daily_target' => 100000
        ]);

        $p2 = Porter::create([
            'name' => 'M. Maruwan',
            'id_number' => 'KP-002',
            'phone' => '081234567891',
            'status' => 'active',
            'rating' => 4.7,
            'daily_earnings' => 15000,
            'daily_target' => 100000
        ]);

        PorterJob::create([
            'porter_id' => $p1->id,
            'customer_name' => 'Ibu Siti',
            'location_from' => 'Pintu Barat',
            'location_to' => 'Blok B-12',
            'weight_category' => 'Medium',
            'fee' => 15000,
            'status' => 'completed',
            'rating' => 5,
            'feedback' => 'Sangat ramah dan cekatan'
        ]);

        PorterJob::create([
            'porter_id' => $p2->id,
            'customer_name' => 'Pak Budi',
            'location_from' => 'Pintu Utara',
            'location_to' => 'Toko Sembako Jaya',
            'weight_category' => 'Heavy',
            'fee' => 25000,
            'status' => 'in_progress'
        ]);
    }
}
