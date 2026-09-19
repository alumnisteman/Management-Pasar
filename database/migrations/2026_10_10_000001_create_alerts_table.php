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
        Schema::create('alerts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type'); // e.g. CCTV_OFFLINE, PAYMENT_DUE, BREACH_DETECTED
            $table->text('message');
            $table->json('payload')->nullable();
            $table->enum('channel', ['EMAIL', 'PUSH', 'SMS', 'WHATSAPP'])->default('EMAIL');
            $table->boolean('sent')->default(false);
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
?>
