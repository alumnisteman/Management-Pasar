#!/bin/bash
php artisan tinker --execute="
App\Models\TemporaryPermit::query()->delete();
App\Models\TemporaryStall::query()->delete();
App\Models\TemporaryStall::create(['code'=>'A1', 'name'=>'Lapak Ramadhan A1', 'area_name'=>'Depan Masjid Al-Munawwar', 'latitude'=>0.7895, 'longitude'=>127.3825, 'capacity'=>5]);
App\Models\TemporaryStall::create(['code'=>'A2', 'name'=>'Lapak Ramadhan A2', 'area_name'=>'Depan Masjid Al-Munawwar', 'latitude'=>0.7898, 'longitude'=>127.3830, 'capacity'=>3]);
App\Models\TemporaryStall::create(['code'=>'B1', 'name'=>'Lapak Ramadhan B1', 'area_name'=>'Jalan Pahlawan Revolusi', 'latitude'=>0.7910, 'longitude'=>127.3850, 'capacity'=>10]);
App\Models\TemporaryStall::create(['code'=>'B2', 'name'=>'Lapak Ramadhan B2', 'area_name'=>'Jalan Pahlawan Revolusi', 'latitude'=>0.7912, 'longitude'=>127.3855, 'capacity'=>10]);
"
