<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Markets Alignment
        Schema::table('markets', function (Blueprint $table) {
            if (!Schema::hasColumn('markets', 'kode_pasar')) $table->string('kode_pasar')->nullable()->after('id');
            if (!Schema::hasColumn('markets', 'status')) $table->string('status')->default('aktif')->after('is_active');
        });

        // 2. Zones Alignment
        Schema::table('zones', function (Blueprint $table) {
            if (!Schema::hasColumn('zones', 'kode_zona')) $table->string('kode_zona')->nullable()->after('market_id');
            if (!Schema::hasColumn('zones', 'jenis_zona')) $table->enum('jenis_zona', ['basah', 'kering', 'kuliner', 'jasa', 'campuran'])->default('campuran')->after('name');
            if (!Schema::hasColumn('zones', 'prioritas')) $table->integer('prioritas')->default(1);
        });

        // 3. Blocks Alignment
        Schema::table('blocks', function (Blueprint $table) {
            if (!Schema::hasColumn('blocks', 'zona_id')) $table->string('zona_id')->nullable()->after('market_id');
            if (!Schema::hasColumn('blocks', 'kode_blok')) $table->string('kode_blok')->nullable()->after('name');
            if (!Schema::hasColumn('blocks', 'lantai')) $table->string('lantai')->default('1');
            if (!Schema::hasColumn('blocks', 'kapasitas')) $table->integer('kapasitas')->default(0);
        });

        // 4. Slots (Lapaks) Alignment
        Schema::table('slots', function (Blueprint $table) {
            if (!Schema::hasColumn('slots', 'block_id')) $table->string('block_id')->nullable()->after('zone_id');
            if (!Schema::hasColumn('slots', 'kode_lapak')) $table->string('kode_lapak')->nullable()->after('code');
            if (!Schema::hasColumn('slots', 'tipe')) $table->string('tipe')->default('standar');
            if (!Schema::hasColumn('slots', 'panjang')) $table->decimal('panjang', 8, 2)->default(2.00);
            if (!Schema::hasColumn('slots', 'lebar')) $table->decimal('lebar', 8, 2)->default(2.00);
            if (!Schema::hasColumn('slots', 'koordinat_x')) $table->string('koordinat_x')->nullable();
            if (!Schema::hasColumn('slots', 'koordinat_y')) $table->string('koordinat_y')->nullable();
            if (!Schema::hasColumn('slots', 'qr_code')) $table->text('qr_code')->nullable();
            
            $table->index('status', 'idx_lapak_status');
        });

        // 5. Traders Alignment
        Schema::table('traders', function (Blueprint $table) {
            if (!Schema::hasColumn('traders', 'jenis_dagangan')) $table->string('jenis_dagangan')->nullable();
            if (!Schema::hasColumn('traders', 'tanggal_masuk')) $table->date('tanggal_masuk')->nullable();
            if (!Schema::hasColumn('traders', 'foto')) $table->string('foto')->nullable();
            
            $table->index('stall_id', 'idx_pedagang_lapak');
        });

        // 6. Payments Alignment
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'metode')) $table->string('metode')->default('tunai');
            if (!Schema::hasColumn('payments', 'petugas_id')) $table->string('petugas_id')->nullable();
            if (!Schema::hasColumn('payments', 'foto_bukti')) $table->string('foto_bukti')->nullable();
            
            $table->index('created_at', 'idx_pembayaran_tanggal');
        });

        // 7. Training Modules
        Schema::create('pelatihans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('judul');
            $table->date('tanggal');
            $table->string('pemateri');
            $table->string('kategori');
            $table->string('lokasi');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('pelatihan_pedagang', function (Blueprint $table) {
            $table->id();
            $table->uuid('pelatihan_id');
            $table->uuid('trader_id');
            $table->string('status_hadir')->default('terdaftar');
            $table->string('sertifikat')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pelatihan_pedagang');
        Schema::dropIfExists('pelatihans');
    }
};
