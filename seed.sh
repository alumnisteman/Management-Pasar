#!/bin/bash
php artisan tinker --execute="
App\Models\Vendor::truncate();
App\Models\Vendor::create(['name'=>'Bu Sari','nik'=>'1234567890','type'=>'Sayuran','latitude'=>0.7935,'longitude'=>127.3845,'status'=>'legal']);
App\Models\Vendor::create(['name'=>'Pak Rudi','nik'=>'0987654321','type'=>'Pakaian','latitude'=>0.7950,'longitude'=>127.3860,'status'=>'legal']);
App\Models\Vendor::create(['name'=>'Kios Ilegal A','type'=>'Makanan','latitude'=>0.7910,'longitude'=>127.3820,'status'=>'illegal']);
App\Models\Vendor::create(['name'=>'Bu Dewi','nik'=>'1122334455','type'=>'Elektronik','latitude'=>0.7940,'longitude'=>127.3830,'status'=>'legal']);
App\Models\Vendor::create(['name'=>'Lapak Liar','type'=>'Buah-buahan','latitude'=>0.7970,'longitude'=>127.3870,'status'=>'illegal']);
"
