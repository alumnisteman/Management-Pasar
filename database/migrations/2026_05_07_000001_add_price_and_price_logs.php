<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add price column to slots table
        Schema::table('slots', function (Blueprint $table) {
            $table->integer('price')->default(0)->after('status');
        });

        // Create price_logs table
        Schema::create('price_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('slot_id');
            $table->foreign('slot_id')->references('id')->on('slots')->onDelete('cascade');
            $table->integer('price');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_logs');
        Schema::table('slots', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};
?>
