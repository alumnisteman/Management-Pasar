<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inspections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('stall_code', 50)->index();
            $table->string('trader_name')->nullable();
            $table->string('inspector_name');
            $table->string('cleanliness_status');
            $table->string('security_status');
            $table->boolean('payment_verified')->default(false);
            $table->text('notes')->nullable();
            $table->string('photo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inspections');
    }
};
