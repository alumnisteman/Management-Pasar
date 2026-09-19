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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('trader_id');
            $table->decimal('amount', 12, 2);
            $table->enum('method', ['QRIS', 'VIRTUAL_ACCOUNT', 'E_WALLET', 'CASH']);
            $table->enum('status', ['PENDING', 'COMPLETED', 'FAILED'])->default('PENDING');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->foreign('trader_id')->references('id')->on('traders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
?>
