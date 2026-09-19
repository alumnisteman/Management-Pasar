<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('porters', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('id_number')->unique();
            $table->string('phone');
            $table->enum('status', ['available', 'active', 'off'])->default('available');
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->decimal('daily_earnings', 12, 2)->default(0);
            $table->decimal('daily_target', 12, 2)->default(100000);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('porter_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('porter_id')->constrained('porters');
            $table->string('customer_name')->nullable();
            $table->string('location_from')->default('Pintu Masuk Pasar');
            $table->string('location_to');
            $table->enum('weight_category', ['Light', 'Medium', 'Heavy', 'Extra Heavy'])->default('Medium');
            $table->decimal('fee', 12, 2);
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->integer('rating')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('porter_incentives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('porter_id')->constrained('porters');
            $table->date('week_start');
            $table->date('week_end');
            $table->integer('jobs_completed');
            $table->decimal('avg_rating', 3, 2);
            $table->decimal('total_earnings', 12, 2);
            $table->integer('days_hit_target');
            $table->string('tier')->default('none');
            $table->decimal('bonus_amount', 12, 2)->default(0);
            $table->enum('status', ['pending', 'paid'])->default('pending');
            $table->timestamps();
        });

        // Optional: Separate ratings table if needed, but porter_jobs has them. 
        // We'll keep it in porter_jobs for now to follow the user's implicit logic 
        // where jobs can be "rateable".
    }

    public function down()
    {
        Schema::dropIfExists('porter_incentives');
        Schema::dropIfExists('porter_jobs');
        Schema::dropIfExists('porters');
    }
};
