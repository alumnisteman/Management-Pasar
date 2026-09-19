<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Adding 'code' and 'area_name' to stalls for the Grid System
        Schema::table('stalls', function (Blueprint $table) {
            $table->string('code')->nullable()->after('id'); // A1, B2, etc.
            $table->string('area_name')->nullable()->after('zone_id'); // "Depan Masjid", etc.
        });

        Schema::table('temporary_stalls', function (Blueprint $table) {
            $table->string('code')->nullable()->after('id'); // T1, T2, etc.
            $table->string('area_name')->nullable()->after('zone_id'); // "Zona Musiman A", etc.
        });
    }

    public function down(): void
    {
        Schema::table('stalls', function (Blueprint $table) {
            $table->dropColumn(['code', 'area_name']);
        });

        Schema::table('temporary_stalls', function (Blueprint $table) {
            $table->dropColumn(['code', 'area_name']);
        });
    }
};
