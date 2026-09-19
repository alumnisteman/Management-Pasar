<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        if (!Schema::hasTable('stalls')) {
            Schema::create('stalls', function (Blueprint $table) {
                $table->id();
                $table->foreignId('block_id')->constrained('blocks')->cascadeOnDelete();
                $table->string('code')->unique();
                $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');
                $table->timestamps();
            });
        }
    }
    public function down(): void {
        Schema::dropIfExists('stalls');
    }
};
?>
