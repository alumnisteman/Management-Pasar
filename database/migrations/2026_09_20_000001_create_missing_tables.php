<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Porters (Kuli angkut pasar)
        if (!Schema::hasTable('porters')) {
            Schema::create('porters', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('id_number')->unique();
                $table->string('phone');
                $table->enum('status', ['available', 'active', 'offline'])->default('available');
                $table->decimal('rating', 3, 2)->default(0);
                $table->decimal('daily_earnings', 15, 2)->default(0);
                $table->decimal('daily_target', 15, 2)->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        // Porter Jobs
        if (!Schema::hasTable('porter_jobs')) {
            Schema::create('porter_jobs', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('porter_id');
                $table->string('description')->nullable();
                $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
                $table->decimal('fee', 15, 2)->default(0);
                $table->decimal('rating', 3, 2)->nullable();
                $table->text('feedback')->nullable();
                $table->timestamps();
                $table->foreign('porter_id')->references('id')->on('porters')->onDelete('cascade');
            });
        }

        // Porter Incentives
        if (!Schema::hasTable('porter_incentives')) {
            Schema::create('porter_incentives', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('porter_id');
                $table->string('tier')->default('none');
                $table->decimal('bonus', 15, 2)->default(0);
                $table->string('period')->nullable();
                $table->timestamps();
                $table->foreign('porter_id')->references('id')->on('porters')->onDelete('cascade');
            });
        }

        // Slot Bookings
        if (!Schema::hasTable('slot_bookings')) {
            Schema::create('slot_bookings', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('slot_id');
                $table->uuid('trader_id');
                $table->string('shift');
                $table->date('date');
                $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
                $table->timestamps();
            });
        }

        // Scan Logs (QR scan events)
        if (!Schema::hasTable('scan_logs')) {
            Schema::create('scan_logs', function (Blueprint $table) {
                $table->id();
                $table->string('qr_payload');
                $table->string('scanned_by')->nullable();
                $table->string('location')->nullable();
                $table->enum('result', ['valid', 'invalid', 'expired'])->default('valid');
                $table->timestamps();
            });
        }

        // Temporary Stalls
        if (!Schema::hasTable('temporary_stalls')) {
            Schema::create('temporary_stalls', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('code')->unique();
                $table->string('location')->nullable();
                $table->enum('status', ['available', 'occupied'])->default('available');
                $table->timestamps();
            });
        }

        // Temporary Permits
        if (!Schema::hasTable('temporary_permits')) {
            Schema::create('temporary_permits', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('vendor_id')->nullable();
                $table->uuid('stall_id')->nullable();
                $table->date('date_start');
                $table->date('date_end');
                $table->string('shift')->nullable();
                $table->enum('status', ['active', 'expired', 'cancelled'])->default('active');
                $table->string('qr_code')->nullable();
                $table->timestamps();
            });
        }

        // Vendors
        if (!Schema::hasTable('vendors')) {
            Schema::create('vendors', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('name');
                $table->string('phone')->nullable();
                $table->string('id_number')->nullable();
                $table->enum('status', ['active', 'inactive'])->default('active');
                $table->timestamps();
            });
        }

        // Reputations
        if (!Schema::hasTable('reputations')) {
            Schema::create('reputations', function (Blueprint $table) {
                $table->id();
                $table->uuid('trader_id');
                $table->integer('score')->default(100);
                $table->string('reason')->nullable();
                $table->integer('delta')->default(0);
                $table->timestamps();
            });
        }

        // Permit Requests
        if (!Schema::hasTable('permit_requests')) {
            Schema::create('permit_requests', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('trader_id');
                $table->uuid('slot_id')->nullable();
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('permit_requests');
        Schema::dropIfExists('reputations');
        Schema::dropIfExists('vendors');
        Schema::dropIfExists('temporary_permits');
        Schema::dropIfExists('temporary_stalls');
        Schema::dropIfExists('scan_logs');
        Schema::dropIfExists('slot_bookings');
        Schema::dropIfExists('porter_incentives');
        Schema::dropIfExists('porter_jobs');
        Schema::dropIfExists('porters');
    }
};
