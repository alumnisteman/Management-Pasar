<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Audit Logs (Sering dibaca untuk riwayat)
        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->index('action');
                $table->index('created_at');
            });
        }

        // 2. Payments (Sering difilter berdasarkan status & metode)
        if (Schema::hasTable('payments')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->index('status');
                $table->index('payment_method');
                $table->index('created_at');
            });
        }

        // 3. Smart Meter Readings (Sering difilter berdasarkan device & waktu)
        if (Schema::hasTable('smart_meter_readings')) {
            Schema::table('smart_meter_readings', function (Blueprint $table) {
                $table->index('device_id');
                $table->index('created_at');
            });
        }

        // 4. Transactions (Sering dihitung untuk report daily)
        if (Schema::hasTable('transactions')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->index('type');
                $table->index('created_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->dropIndex(['action']);
                $table->dropIndex(['created_at']);
            });
        }

        if (Schema::hasTable('payments')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->dropIndex(['status']);
                $table->dropIndex(['payment_method']);
                $table->dropIndex(['created_at']);
            });
        }

        if (Schema::hasTable('smart_meter_readings')) {
            Schema::table('smart_meter_readings', function (Blueprint $table) {
                $table->dropIndex(['device_id']);
                $table->dropIndex(['created_at']);
            });
        }

        if (Schema::hasTable('transactions')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->dropIndex(['type']);
                $table->dropIndex(['created_at']);
            });
        }
    }
};
