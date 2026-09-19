<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('action');
            $table->text('data')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });

        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('nik')->unique()->nullable();
            $table->string('type')->nullable();
            $table->string('face_photo_path')->nullable();
            $table->string('qr_code')->unique()->nullable();
            $table->integer('violation_score')->default(0);
            $table->timestamps();
        });

        Schema::create('stalls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->nullable();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->enum('status', ['available', 'occupied', 'blocked'])->default('available');
            $table->timestamps();
        });

        Schema::create('permits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stall_id')->constrained()->onDelete('cascade');
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'expired', 'revoked'])->default('active');
            $table->boolean('non_transferable')->default(true);
            $table->timestamps();
        });

        Schema::create('permit_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            $table->foreignId('stall_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['new', 'renewal', 'relocation']);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permit_requests');
        Schema::dropIfExists('permits');
        Schema::dropIfExists('stalls');
        Schema::dropIfExists('vendors');
        Schema::dropIfExists('audit_logs');
    }
};
