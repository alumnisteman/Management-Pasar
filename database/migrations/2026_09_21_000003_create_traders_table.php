<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        if (!Schema::hasTable('traders')) {
            Schema::create('traders', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->foreignId('stall_id')->nullable()->constrained('stalls')->nullOnDelete();
                $table->decimal('balance', 12, 2)->default(0);
                $table->timestamps();
            });
        }
    }
    public function down(): void {
        Schema::dropIfExists('traders');
    }
};
?>
