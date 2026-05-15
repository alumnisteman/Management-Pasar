<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('temporary_stalls', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('zone_id')->nullable();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->integer('capacity')->default(1);
            $table->json('active_dates')->nullable();
            $table->timestamps();
        });

        Schema::create('temporary_events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        });

        Schema::create('temporary_permits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            $table->foreignId('stall_id')->constrained('temporary_stalls')->onDelete('cascade');
            $table->date('date_start');
            $table->date('date_end');
            $table->enum('shift', ['pagi', 'siang', 'malam']);
            $table->enum('status', ['active', 'expired', 'revoked'])->default('active');
            $table->string('qr_code')->nullable();
            $table->timestamps();

            $table->index(['stall_id', 'date_start', 'shift']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('temporary_permits');
        Schema::dropIfExists('temporary_events');
        Schema::dropIfExists('temporary_stalls');
    }
};
