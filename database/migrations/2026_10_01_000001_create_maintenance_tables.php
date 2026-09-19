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
        // maintenance_tickets table
        Schema::create('maintenance_tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])->default('OPEN');
            $table->uuid('assigned_technician_id')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->timestamps();
        });

        // work_orders table
        Schema::create('work_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('maintenance_ticket_id');
            $table->enum('type', ['INSPECTION', 'REPAIR', 'OTHER']);
            $table->string('title');
            $table->text('details')->nullable();
            $table->enum('status', ['PENDING', 'ASSIGNED', 'COMPLETED'])->default('PENDING');
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamps();

            $table->foreign('maintenance_ticket_id')
                  ->references('id')->on('maintenance_tickets')
                  ->onDelete('cascade');
        });

        // assignments table (technician assignments to work orders)
        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('work_order_id');
            $table->uuid('technician_id');
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamps();

            $table->foreign('work_order_id')
                  ->references('id')->on('work_orders')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('work_orders');
        Schema::dropIfExists('maintenance_tickets');
    }
};
?>
