<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // blocks
        if (!Schema::hasTable('blocks')) {
            Schema::create('blocks', function (Blueprint $table) {
                $table->id();
                $table->foreignId('market_id');
                $table->string('name');
                $table->timestamps();
            });
        }

        // Ensure stalls table exists and has SMOS structure
        if (!Schema::hasTable('stalls')) {
            Schema::create('stalls', function (Blueprint $table) {
                $table->id();
                $table->foreignId('market_id');
                $table->foreignId('block_id');
                $table->string('code');
                $table->decimal('lat', 10, 7)->nullable();
                $table->decimal('lng', 10, 7)->nullable();
                $table->enum('status', ['EMPTY', 'ACTIVE', 'SUSPENDED', 'MAINTENANCE'])->default('EMPTY');
                $table->timestamps();
            });
        }

        // Update traders table to match SMOS structure
        Schema::table('traders', function (Blueprint $table) {
            if (!Schema::hasColumn('traders', 'stall_id')) {
                $table->foreignId('stall_id')->nullable()->after('market_id');
            }
            if (!Schema::hasColumn('traders', 'permit_number')) {
                $table->string('permit_number')->unique()->nullable()->after('nik');
            }
            if (!Schema::hasColumn('traders', 'arrears')) {
                $table->decimal('arrears', 15, 2)->default(0)->after('status');
            }
            if (!Schema::hasColumn('traders', 'expired_at')) {
                $table->date('expired_at')->nullable()->after('arrears');
            }
            // Update status enum if possible, or just leave it if it conflicts
        });

        // scan_logs for Field Ops
        if (!Schema::hasTable('scan_logs')) {
            Schema::create('scan_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id');
                $table->string('permit_number');
                $table->decimal('lat', 10, 7)->nullable();
                $table->decimal('lng', 10, 7)->nullable();
                $table->timestamp('scanned_at');
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('scan_logs');
        Schema::dropIfExists('stalls');
        Schema::dropIfExists('blocks');
    }
};
