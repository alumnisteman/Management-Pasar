<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Devices (Control field devices)
        Schema::create('devices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->timestamp('last_sync_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Traders (Pedagang - Enhanced)
        Schema::create('traders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('nik', 16)->unique();
            $table->string('phone')->nullable();
            $table->enum('type', ['tetap', 'harian', 'musiman'])->default('harian');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // 3. Zones (Zonasi Pasar)
        Schema::create('zones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 4. Slots (GRID SYSTEM - The Core)
        Schema::create('slots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->foreignUuid('zone_id')->constrained('zones');
            $table->integer('x_position');
            $table->integer('y_position');
            $table->enum('status', ['active', 'blocked'])->default('active');
            $table->timestamps();
        });

        // 5. Assignments (Tracking daily placement)
        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('trader_id')->constrained('traders');
            $table->foreignUuid('slot_id')->constrained('slots');
            $table->date('date');
            $table->foreignId('assigned_by')->constrained('users');
            $table->timestamps();
        });

        // 6. Transactions (CORE - ANTI PUNGLI)
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('local_id')->nullable(); // From mobile device
            $table->foreignUuid('trader_id')->constrained('traders');
            $table->foreignUuid('slot_id')->constrained('slots');
            $table->decimal('amount', 15, 2);
            $table->enum('payment_method', ['cash', 'qris'])->default('cash');
            $table->foreignId('officer_id')->constrained('users');
            $table->foreignUuid('device_id')->constrained('devices');
            $table->timestamp('transaction_time'); // Device time
            $table->timestamp('server_time')->nullable(); // Server arrival time
            $table->enum('status', ['pending', 'synced', 'failed'])->default('pending');
            $table->timestamps();
        });

        // 7. Sync Queue (Offline-First Brain)
        Schema::create('sync_queues', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('device_id')->constrained('devices');
            $table->json('payload');
            $table->enum('type', ['transaction', 'assignment']);
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
            $table->integer('retry_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sync_queues');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('slots');
        Schema::dropIfExists('zones');
        Schema::dropIfExists('traders');
        Schema::dropIfExists('devices');
    }
};
