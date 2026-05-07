<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Add classification columns to traders table
        if (Schema::hasTable('traders')) {
            Schema::table('traders', function (Blueprint $table) {
                if (!Schema::hasColumn('traders', 'scale')) {
                    $table->enum('scale', ['eceran', 'kecil', 'menengah', 'besar'])->default('kecil')->after('type');
                }
                if (!Schema::hasColumn('traders', 'location_type')) {
                    $table->enum('location_type', ['kios', 'jalanan'])->default('jalanan')->after('scale');
                }
            });
        }

        // Create whistleblower_reports table
        if (!Schema::hasTable('whistleblower_reports')) {
            Schema::create('whistleblower_reports', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('pelapor')->nullable(); // Can be anonymous
                $table->string('terlapor');
                $table->text('laporan');
                $table->string('bukti_foto')->nullable();
                $table->enum('status', ['pending', 'investigating', 'resolved'])->default('pending');
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        if (Schema::hasTable('traders')) {
            Schema::table('traders', function (Blueprint $table) {
                $table->dropColumn(['scale', 'location_type']);
            });
        }
        Schema::dropIfExists('whistleblower_reports');
    }
};
