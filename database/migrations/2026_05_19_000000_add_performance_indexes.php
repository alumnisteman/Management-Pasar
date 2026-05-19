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
        // 1. Audit Logs
        if (Schema::hasTable('audit_logs')) {
            try {
                Schema::table('audit_logs', function (Blueprint $table) {
                    $table->index('action');
                });
            } catch (\Exception $e) {}

            try {
                Schema::table('audit_logs', function (Blueprint $table) {
                    $table->index('created_at');
                });
            } catch (\Exception $e) {}
        }

        // 2. Payments
        if (Schema::hasTable('payments')) {
            try {
                Schema::table('payments', function (Blueprint $table) {
                    $table->index('status');
                });
            } catch (\Exception $e) {}

            try {
                Schema::table('payments', function (Blueprint $table) {
                    $table->index('payment_method');
                });
            } catch (\Exception $e) {}

            try {
                Schema::table('payments', function (Blueprint $table) {
                    $table->index('created_at');
                });
            } catch (\Exception $e) {}
        }

        // 3. Smart Meter Readings
        if (Schema::hasTable('smart_meter_readings')) {
            try {
                Schema::table('smart_meter_readings', function (Blueprint $table) {
                    $table->index('device_id');
                });
            } catch (\Exception $e) {}

            try {
                Schema::table('smart_meter_readings', function (Blueprint $table) {
                    $table->index('created_at');
                });
            } catch (\Exception $e) {}
        }

        // 4. Transactions
        if (Schema::hasTable('transactions')) {
            try {
                Schema::table('transactions', function (Blueprint $table) {
                    $table->index('type');
                });
            } catch (\Exception $e) {}

            try {
                Schema::table('transactions', function (Blueprint $table) {
                    $table->index('created_at');
                });
            } catch (\Exception $e) {}
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('audit_logs')) {
            try {
                Schema::table('audit_logs', function (Blueprint $table) {
                    $table->dropIndex(['action']);
                });
            } catch (\Exception $e) {}

            try {
                Schema::table('audit_logs', function (Blueprint $table) {
                    $table->dropIndex(['created_at']);
                });
            } catch (\Exception $e) {}
        }

        if (Schema::hasTable('payments')) {
            try {
                Schema::table('payments', function (Blueprint $table) {
                    $table->dropIndex(['status']);
                });
            } catch (\Exception $e) {}

            try {
                Schema::table('payments', function (Blueprint $table) {
                    $table->dropIndex(['payment_method']);
                });
            } catch (\Exception $e) {}

            try {
                Schema::table('payments', function (Blueprint $table) {
                    $table->dropIndex(['created_at']);
                });
            } catch (\Exception $e) {}
        }

        if (Schema::hasTable('smart_meter_readings')) {
            try {
                Schema::table('smart_meter_readings', function (Blueprint $table) {
                    $table->dropIndex(['device_id']);
                });
            } catch (\Exception $e) {}

            try {
                Schema::table('smart_meter_readings', function (Blueprint $table) {
                    $table->dropIndex(['created_at']);
                });
            } catch (\Exception $e) {}
        }

        if (Schema::hasTable('transactions')) {
            try {
                Schema::table('transactions', function (Blueprint $table) {
                    $table->dropIndex(['type']);
                });
            } catch (\Exception $e) {}

            try {
                Schema::table('transactions', function (Blueprint $table) {
                    $table->dropIndex(['created_at']);
                });
            } catch (\Exception $e) {}
        }
    }
};
