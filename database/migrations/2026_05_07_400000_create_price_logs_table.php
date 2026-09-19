<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('price_logs')) {
            Schema::create('price_logs', function (Blueprint $table) {
                $table->id();
                $table->string('commodity_name');
                $table->decimal('price', 15, 2);
                $table->date('recorded_at');
                $table->uuid('slot_id')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('price_logs');
    }
};
