<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('waste_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id');
            $table->uuid('zone_id');
            $table->uuid('trader_id')->nullable();
            $table->uuid('slot_id')->nullable();
            $table->decimal('volume_kg', 8, 2);
            $table->string('type');
            $table->string('status')->default('collected');
            $table->timestamp('collected_at');
            $table->timestamps();
            $table->softDeletes();

            // Performance Indexes
            $table->index('market_id');
            $table->index('zone_id');
            $table->index('trader_id');
            $table->index('slot_id');
            $table->index('collected_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('waste_logs');
    }
};
