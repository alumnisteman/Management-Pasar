<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->integer('reputation_score')->default(100)->after('violation_score');
            $table->string('last_inspection_status')->nullable()->after('reputation_score'); // Excellent, Good, Fair, Poor
        });

        Schema::create('inspections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            $table->foreignId('stall_id')->nullable();
            $table->foreignId('inspector_id')->constrained('users');
            $table->string('status'); // Clean, Messy, Compliant, Non-compliant
            $table->text('notes')->nullable();
            $table->string('photo_evidence_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inspections');
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropColumn(['reputation_score', 'last_inspection_status']);
        });
    }
};
