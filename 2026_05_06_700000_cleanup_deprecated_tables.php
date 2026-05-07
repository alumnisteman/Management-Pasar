<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Menghapus tabel lama yang sudah digantikan oleh Professional Grid System
        Schema::dropIfExists('temporary_bookings');
        Schema::dropIfExists('temporary_permits');
        Schema::dropIfExists('temporary_stalls');
        Schema::dropIfExists('temporary_events');
    }

    public function down(): void
    {
        // No rollback needed for cleaning up deprecated tables
    }
};
