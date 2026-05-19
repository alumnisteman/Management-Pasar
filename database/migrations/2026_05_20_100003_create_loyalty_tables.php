<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('loyalty_points', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('customer_id');
            $table->integer('points');
            $table->string('description')->nullable();
            $table->string('transaction_type')->default('earn'); // earn, spend
            $table->timestamps();

            // Performance Indexes
            $table->index('customer_id');
            $table->index('transaction_type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('loyalty_points');
    }
};
