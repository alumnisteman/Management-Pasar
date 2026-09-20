<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. MARKETS
        Schema::create('markets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('kode_pasar')->nullable();
            $table->string('name');
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('status')->default('active');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. ZONES
        Schema::create('zones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id');
            $table->string('kode_zona')->nullable();
            $table->string('name');
            $table->string('jenis_zona')->nullable();
            $table->text('description')->nullable();
            $table->string('color')->nullable();
            $table->integer('prioritas')->nullable();
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets')->cascadeOnDelete();
        });

        // 3. BLOCKS
        Schema::create('blocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id')->nullable();
            $table->uuid('zona_id')->nullable();
            $table->string('kode_blok')->nullable();
            $table->string('name');
            $table->integer('lantai')->nullable();
            $table->integer('kapasitas')->nullable();
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets')->nullOnDelete();
            $table->foreign('zona_id')->references('id')->on('zones')->nullOnDelete();
        });

        // 4. SLOTS
        Schema::create('slots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id')->nullable();
            $table->uuid('zone_id')->nullable();
            $table->uuid('block_id')->nullable();
            $table->string('code')->index();
            $table->integer('x_position')->default(0);
            $table->integer('y_position')->default(0);
            $table->string('type')->default('lapak');
            $table->string('category')->nullable();
            $table->string('status')->default('active');
            $table->decimal('price', 15, 2)->nullable();
            $table->uuid('owner_id')->nullable();
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets')->cascadeOnDelete();
            $table->foreign('zone_id')->references('id')->on('zones')->nullOnDelete();
            $table->foreign('block_id')->references('id')->on('blocks')->nullOnDelete();
        });

        // 5. STALLS
        Schema::create('stalls', function (Blueprint $table) {
            $table->id();
            $table->uuid('market_id')->nullable();
            $table->uuid('block_id')->nullable();
            $table->string('code')->nullable();
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets')->nullOnDelete();
            $table->foreign('block_id')->references('id')->on('blocks')->nullOnDelete();
        });

        // 6. TRADERS
        Schema::create('traders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id')->nullable();
            $table->uuid('stall_id')->nullable();
            $table->string('name');
            $table->string('nik')->nullable();
            $table->string('permit_number')->nullable();
            $table->string('phone')->nullable();
            $table->string('type')->default('harian');
            $table->string('scale')->nullable();
            $table->string('location_type')->nullable();
            $table->string('status')->default('active');
            $table->decimal('arrears', 15, 2)->default(0);
            $table->integer('reputation_score')->default(100);
            $table->string('jenis_dagangan')->nullable();
            $table->date('tanggal_masuk')->nullable();
            $table->string('foto')->nullable();
            $table->text('address')->nullable();
            $table->date('expired_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets')->nullOnDelete();
        });

        // 7. PERMITS
        Schema::create('permits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('trader_id');
            $table->uuid('slot_id');
            $table->string('permit_number')->unique();
            $table->string('qr_code_payload')->nullable();
            $table->date('issued_at')->nullable();
            $table->date('expires_at')->nullable();
            $table->dateTime('valid_until')->nullable();
            $table->string('status')->default('active');
            $table->boolean('is_digital')->default(true);
            $table->timestamps();

            $table->foreign('trader_id')->references('id')->on('traders')->cascadeOnDelete();
            $table->foreign('slot_id')->references('id')->on('slots')->cascadeOnDelete();
        });

        // 8. PELATIHAN & PELATIHAN_PEDAGANG
        Schema::create('pelatihans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama');
            $table->timestamps();
        });

        Schema::create('pelatihan_pedagang', function (Blueprint $table) {
            $table->id();
            $table->uuid('trader_id');
            $table->uuid('pelatihan_id');
            $table->string('status_hadir')->nullable();
            $table->string('sertifikat')->nullable();
            $table->timestamps();

            $table->foreign('trader_id')->references('id')->on('traders')->cascadeOnDelete();
            $table->foreign('pelatihan_id')->references('id')->on('pelatihans')->cascadeOnDelete();
        });

        // 9. DEVICES
        Schema::create('devices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->uuid('assigned_user_id')->nullable();
            $table->string('platform')->nullable();
            $table->timestamp('last_sync_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 10. BILLS
        Schema::create('bills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('permit_id')->nullable();
            $table->uuid('trader_id')->nullable();
            $table->uuid('slot_id')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('type')->default('rent');
            $table->date('due_date')->nullable();
            $table->string('status')->default('unpaid');
            $table->timestamps();

            $table->foreign('permit_id')->references('id')->on('permits')->nullOnDelete();
            $table->foreign('trader_id')->references('id')->on('traders')->nullOnDelete();
            $table->foreign('slot_id')->references('id')->on('slots')->nullOnDelete();
        });

        // 11. TRANSACTIONS
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('local_id')->nullable()->index();
            $table->uuid('market_id')->nullable();
            $table->uuid('slot_id')->nullable();
            $table->uuid('trader_id')->nullable();
            $table->uuid('officer_id')->nullable();
            $table->uuid('device_id')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('payment_method')->default('cash');
            $table->timestamp('transaction_time')->nullable();
            $table->timestamp('server_time')->nullable();
            $table->string('status')->default('pending');
            $table->string('receipt_number')->nullable();
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets')->nullOnDelete();
            $table->foreign('slot_id')->references('id')->on('slots')->nullOnDelete();
            $table->foreign('trader_id')->references('id')->on('traders')->nullOnDelete();
            $table->foreign('officer_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('device_id')->references('id')->on('devices')->nullOnDelete();
        });

        // 12. PAYMENTS
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('bill_id')->nullable();
            $table->uuid('trader_id')->nullable();
            $table->uuid('transaction_id')->nullable();
            $table->decimal('amount_paid', 15, 2)->default(0);
            $table->string('payment_method')->default('cash');
            $table->timestamp('paid_at')->nullable();
            $table->string('receipt_url')->nullable();
            $table->string('status')->default('success');
            $table->timestamps();

            $table->foreign('bill_id')->references('id')->on('bills')->nullOnDelete();
            $table->foreign('trader_id')->references('id')->on('traders')->nullOnDelete();
            $table->foreign('transaction_id')->references('id')->on('transactions')->nullOnDelete();
        });

        // 13. WALLETS
        Schema::create('wallets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('trader_id')->unique();
            $table->decimal('balance', 15, 2)->default(0);
            $table->string('currency')->default('IDR');
            $table->boolean('is_frozen')->default(false);
            $table->timestamps();

            $table->foreign('trader_id')->references('id')->on('traders')->cascadeOnDelete();
        });

        // 14. WALLET_TRANSACTIONS
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('wallet_id');
            $table->string('type');
            $table->decimal('amount', 15, 2);
            $table->string('description')->nullable();
            $table->string('reference_id')->nullable();
            $table->timestamps();

            $table->foreign('wallet_id')->references('id')->on('wallets')->cascadeOnDelete();
        });

        // 15. ASSIGNMENTS
        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('slot_id');
            $table->uuid('trader_id');
            $table->uuid('assigned_by')->nullable();
            $table->date('assignment_date')->nullable();
            $table->date('date')->nullable();
            $table->timestamps();

            $table->foreign('slot_id')->references('id')->on('slots')->cascadeOnDelete();
            $table->foreign('trader_id')->references('id')->on('traders')->cascadeOnDelete();
            $table->foreign('assigned_by')->references('id')->on('users')->nullOnDelete();
        });

        // 16. SYNC_LOGS
        Schema::create('sync_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('device_id');
            $table->integer('success_count')->default(0);
            $table->integer('failed_count')->default(0);
            $table->timestamp('sync_started_at');
            $table->timestamp('sync_finished_at')->nullable();
            $table->timestamps();

            $table->foreign('device_id')->references('id')->on('devices')->cascadeOnDelete();
        });

        // 17. RECEIPTS
        Schema::create('receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('transaction_id');
            $table->string('receipt_number')->unique();
            $table->timestamp('printed_at')->nullable();
            $table->timestamps();

            $table->foreign('transaction_id')->references('id')->on('transactions')->cascadeOnDelete();
        });

        // 18. COMPLAINTS
        Schema::create('complaints', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('trader_id')->nullable();
            $table->uuid('slot_id')->nullable();
            $table->uuid('market_id')->nullable();
            $table->uuid('zone_id')->nullable();
            $table->string('ticket_number')->nullable();
            $table->string('category')->nullable();
            $table->text('description');
            $table->string('priority')->default('normal');
            $table->string('photo')->nullable();
            $table->string('status')->default('open');
            $table->timestamps();

            $table->foreign('trader_id')->references('id')->on('traders')->nullOnDelete();
            $table->foreign('slot_id')->references('id')->on('slots')->nullOnDelete();
            $table->foreign('market_id')->references('id')->on('markets')->nullOnDelete();
            $table->foreign('zone_id')->references('id')->on('zones')->nullOnDelete();
        });

        // 19. PATROL_LOGS
        Schema::create('patrol_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('slot_id')->nullable();
            $table->uuid('officer_id')->nullable();
            $table->uuid('user_id')->nullable();
            $table->uuid('device_id')->nullable();
            $table->integer('cleanliness_score')->nullable();
            $table->string('security_status')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamp('pinged_at')->nullable();
            $table->timestamps();

            $table->foreign('slot_id')->references('id')->on('slots')->nullOnDelete();
            $table->foreign('officer_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('device_id')->references('id')->on('devices')->nullOnDelete();
        });

        // 20. INSPECTIONS
        Schema::create('inspections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('slot_id')->nullable();
            $table->uuid('trader_id')->nullable();
            $table->uuid('inspector_id')->nullable();
            $table->integer('cleanliness_score')->nullable();
            $table->string('security_status')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('COMPLETED');
            $table->timestamps();

            $table->foreign('slot_id')->references('id')->on('slots')->nullOnDelete();
            $table->foreign('trader_id')->references('id')->on('traders')->nullOnDelete();
            $table->foreign('inspector_id')->references('id')->on('users')->nullOnDelete();
        });

        // 21. AUDIT_LOGS
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->uuid('device_id')->nullable();
            $table->string('module')->nullable();
            $table->string('action');
            $table->json('data')->nullable();
            $table->json('payload')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('device_id')->references('id')->on('devices')->nullOnDelete();
        });

        // 22. DAILY_SUMMARIES
        Schema::create('daily_summaries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id')->nullable();
            $table->date('summary_date');
            $table->integer('total_transactions')->default(0);
            $table->decimal('total_income', 15, 2)->default(0);
            $table->integer('active_traders')->default(0);
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets')->cascadeOnDelete();
        });

        // 23. WHISTLEBLOWER_REPORTS
        Schema::create('whistleblower_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('pelapor')->nullable();
            $table->string('terlapor');
            $table->text('laporan');
            $table->string('bukti_foto')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        // 24. NOTIFICATIONS
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->string('type');
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        // 25. PRICE_LOGS
        Schema::create('price_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('slot_id')->nullable();
            $table->string('commodity_name')->nullable();
            $table->decimal('price', 15, 2);
            $table->date('recorded_at')->nullable();
            $table->timestamps();

            $table->foreign('slot_id')->references('id')->on('slots')->nullOnDelete();
        });

        // 26. MAINTENANCE_TICKETS & WORK_ORDERS
        Schema::create('maintenance_tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->string('status')->default('open');
            $table->uuid('assigned_technician_id')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamps();

            $table->foreign('assigned_technician_id')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('work_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('maintenance_ticket_id');
            $table->string('title');
            $table->text('instructions')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();

            $table->foreign('maintenance_ticket_id')->references('id')->on('maintenance_tickets')->cascadeOnDelete();
        });

        // 27. INCIDENTS
        Schema::create('incidents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id')->nullable();
            $table->string('reporter_name');
            $table->string('type');
            $table->string('severity')->default('LOW');
            $table->text('description');
            $table->string('status')->default('OPEN');
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets')->nullOnDelete();
        });

        // 28. ANNOUNCEMENTS
        Schema::create('announcements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('content');
            $table->uuid('target_market_id')->nullable();
            $table->string('category')->default('GENERAL');
            $table->string('priority')->default('NORMAL');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->foreign('target_market_id')->references('id')->on('markets')->nullOnDelete();
        });

        // 29. APPROVALS
        Schema::create('approvals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->string('requested_by');
            $table->json('details')->nullable();
            $table->string('status')->default('PENDING');
            $table->text('notes')->nullable();
            $table->string('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvals');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('incidents');
        Schema::dropIfExists('work_orders');
        Schema::dropIfExists('maintenance_tickets');
        Schema::dropIfExists('price_logs');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('whistleblower_reports');
        Schema::dropIfExists('daily_summaries');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('inspections');
        Schema::dropIfExists('patrol_logs');
        Schema::dropIfExists('complaints');
        Schema::dropIfExists('receipts');
        Schema::dropIfExists('sync_logs');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('wallets');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('bills');
        Schema::dropIfExists('devices');
        Schema::dropIfExists('pelatihan_pedagang');
        Schema::dropIfExists('pelatihans');
        Schema::dropIfExists('permits');
        Schema::dropIfExists('traders');
        Schema::dropIfExists('stalls');
        Schema::dropIfExists('slots');
        Schema::dropIfExists('blocks');
        Schema::dropIfExists('zones');
        Schema::dropIfExists('markets');
    }
};
