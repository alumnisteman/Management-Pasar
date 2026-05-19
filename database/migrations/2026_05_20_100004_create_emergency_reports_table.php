<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('emergency_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('reporter_id'); // can be Trader, Customer, User
            $table->string('reporter_type'); // Trader, Customer, User
            $table->string('type'); // fire, medical, crime, etc.
            $table->text('description');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('status')->default('reported'); // reported, responding, resolved
            $table->timestamps();

            // Performance Indexes
            $table->index(['reporter_id', 'reporter_type']);
            $table->index('type');
            $table->index('status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('emergency_reports');
    }
};
