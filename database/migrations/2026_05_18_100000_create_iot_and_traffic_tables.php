<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. SMART METER READINGS TABLE
        Schema::create('smart_meter_readings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('slot_id');
            $table->enum('type', ['electricity', 'water']);
            $table->double('reading'); // KWh or cubic meters
            $table->decimal('cost', 15, 2)->default(0);
            $table->timestamp('recorded_at');
            $table->timestamps();

            $table->foreign('slot_id')->references('id')->on('slots')->cascadeOnDelete();
            $table->index('slot_id');
            $table->index('recorded_at');
        });

        // 2. FOOT TRAFFIC LOGS TABLE
        Schema::create('foot_traffic_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('zone_id');
            $table->integer('crowd_count')->default(0);
            $table->timestamp('recorded_at');
            $table->timestamps();

            $table->foreign('zone_id')->references('id')->on('zones')->cascadeOnDelete();
            $table->index('zone_id');
            $table->index('recorded_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foot_traffic_logs');
        Schema::dropIfExists('smart_meter_readings');
    }
};
