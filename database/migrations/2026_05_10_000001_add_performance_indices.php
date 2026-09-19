<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('traders', function (Blueprint $table) {
            $table->index('nik');
            $table->index('status');
        });

        Schema::table('permits', function (Blueprint $table) {
            $table->index('trader_id');
            $table->index('permit_number');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->index('action');
        });
    }

    public function down(): void
    {
        Schema::table('traders', function (Blueprint $table) {
            $table->dropIndex(['nik']);
            $table->dropIndex(['status']);
        });

        Schema::table('permits', function (Blueprint $table) {
            $table->dropIndex(['trader_id']);
            $table->dropIndex(['permit_number']);
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex(['action']);
        });
    }
};
