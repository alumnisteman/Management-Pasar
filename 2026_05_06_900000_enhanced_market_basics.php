<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Zonasi Jelas di Grid
        Schema::table('grids', function (Blueprint $table) {
            $table->enum('category', ['basah', 'kering', 'kuliner', 'umum'])->default('umum')->after('name');
        });

        // 2. Data Pedagang Lengkap
        Schema::table('vendors', function (Blueprint $table) {
            $table->string('business_type')->nullable()->after('nik');
            $table->text('address')->nullable()->after('business_type');
        });

        // 3. Status Lapak Tambahan (Harian)
        Schema::table('grid_slots', function (Blueprint $table) {
            // Using a raw statement to add 'harian' to the enum if needed, or just allow it via string
            // For simplicity and compatibility, we'll ensure 'type' can handle more
            $table->string('type')->change(); 
        });
    }

    public function down(): void
    {
        Schema::table('grids', function (Blueprint $table) { $table->dropColumn('category'); });
        Schema::table('vendors', function (Blueprint $table) { $table->dropColumn(['business_type', 'address']); });
    }
};
