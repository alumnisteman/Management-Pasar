<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('nik')->nullable();
            $table->string('type')->nullable();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('status')->default('legal');
            $table->string('photo')->nullable();
            $table->timestamps();
        });

        Schema::create('zones', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->json('geojson');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
        Schema::dropIfExists('zones');
    }
};
