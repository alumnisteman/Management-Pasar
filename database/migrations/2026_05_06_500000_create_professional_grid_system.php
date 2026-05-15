<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grids', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., Zona Pasar A
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('grid_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grid_id')->constrained()->onDelete('cascade');
            $table->string('code'); // e.g., A1, B2
            $table->enum('type', ['permanent', 'temporary'])->default('temporary');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamps();
        });

        Schema::create('slot_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('slot_id')->constrained('grid_slots')->onDelete('cascade');
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->enum('shift', ['pagi', 'siang', 'malam']);
            $table->string('qr_code')->unique();
            $table->enum('status', ['active', 'expired', 'revoked'])->default('active');
            $table->timestamps();

            $table->index(['slot_id', 'date', 'shift']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('slot_bookings');
        Schema::dropIfExists('grid_slots');
        Schema::dropIfExists('grids');
    }
};
