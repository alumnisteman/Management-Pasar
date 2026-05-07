<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. MARKETS TABLE
        Schema::create('markets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. USERS TABLE
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['super_admin', 'market_admin', 'officer', 'auditor'])->default('officer');
            $table->uuid('market_id')->nullable();
            $table->uuid('device_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            $table->foreign('market_id')->references('id')->on('markets')->nullOnDelete();
        });

        // 3. ZONES TABLE
        Schema::create('zones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('color')->nullable();
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets')->cascadeOnDelete();
        });

        // 4. SLOTS TABLE
        Schema::create('slots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id');
            $table->uuid('zone_id');
            $table->string('code');
            $table->integer('x_position')->default(0);
            $table->integer('y_position')->default(0);
            $table->enum('type', ['lapak', 'kios', 'los'])->default('lapak');
            $table->string('category')->nullable(); // Legacy support
            $table->enum('status', ['active', 'blocked', 'maintenance'])->default('active');
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets')->cascadeOnDelete();
            $table->foreign('zone_id')->references('id')->on('zones')->cascadeOnDelete();
        });

        // 5. TRADERS TABLE
        Schema::create('traders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id');
            $table->string('name');
            $table->string('nik')->nullable();
            $table->string('phone')->nullable();
            $table->enum('type', ['tetap', 'harian', 'musiman'])->default('harian');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('address')->nullable();
            
            // Legacy fields
            $table->string('scale')->nullable();
            $table->string('location_type')->nullable();
            $table->integer('reputation_score')->default(100);
            
            $table->timestamps();
            $table->foreign('market_id')->references('id')->on('markets')->cascadeOnDelete();
        });

        // 6. ASSIGNMENTS TABLE
        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('slot_id');
            $table->uuid('trader_id');
            $table->uuid('assigned_by');
            $table->date('assignment_date');
            $table->timestamps();

            $table->foreign('slot_id')->references('id')->on('slots');
            $table->foreign('trader_id')->references('id')->on('traders');
            $table->foreign('assigned_by')->references('id')->on('users');
        });

        // 7. TRANSACTIONS TABLE
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('local_id')->unique();
            $table->uuid('market_id');
            $table->uuid('slot_id');
            $table->uuid('trader_id');
            $table->uuid('officer_id');
            $table->uuid('device_id');
            $table->decimal('amount', 15, 2);
            $table->enum('payment_method', ['cash', 'qris'])->default('cash');
            $table->timestamp('transaction_time');
            $table->timestamp('server_time')->nullable();
            $table->enum('status', ['pending', 'synced', 'failed'])->default('pending');
            $table->string('receipt_number')->nullable();
            $table->timestamps();

            $table->foreign('market_id')->references('id')->on('markets');
            $table->foreign('slot_id')->references('id')->on('slots');
            $table->foreign('trader_id')->references('id')->on('traders');
            $table->foreign('officer_id')->references('id')->on('users');
            
            $table->index('market_id');
            $table->index('slot_id');
            $table->index('trader_id');
            $table->index('officer_id');
            $table->index('transaction_time');
        });

        // 8. DEVICES TABLE
        Schema::create('devices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->uuid('assigned_user_id')->nullable();
            $table->string('platform')->nullable();
            $table->timestamp('last_sync_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 9. SYNC_LOGS TABLE
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

        // 10. RECEIPTS TABLE
        Schema::create('receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('transaction_id');
            $table->string('receipt_number')->unique();
            $table->timestamp('printed_at')->nullable();
            $table->timestamps();

            $table->foreign('transaction_id')->references('id')->on('transactions')->cascadeOnDelete();
        });

        // 11. COMPLAINTS TABLE
        Schema::create('complaints', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id');
            $table->uuid('zone_id')->nullable();
            $table->string('category');
            $table->text('description');
            $table->string('photo')->nullable();
            $table->enum('status', ['open', 'in_progress', 'resolved'])->default('open');
            $table->timestamps();
            
            $table->foreign('market_id')->references('id')->on('markets')->cascadeOnDelete();
        });

        // 12. AUDIT LOGS TABLE
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->uuid('device_id')->nullable();
            $table->string('module')->nullable();
            $table->string('action');
            $table->json('data')->nullable(); // Legacy support
            $table->json('payload')->nullable(); // New schema
            $table->ipAddress('ip_address')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });

        // 13. DAILY_SUMMARIES TABLE
        Schema::create('daily_summaries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('market_id');
            $table->date('summary_date');
            $table->integer('total_transactions')->default(0);
            $table->decimal('total_income', 15, 2)->default(0);
            $table->integer('active_traders')->default(0);
            $table->timestamps();
            
            $table->foreign('market_id')->references('id')->on('markets')->cascadeOnDelete();
        });

        // 14. WHISTLEBLOWER REPORTS (Legacy)
        Schema::create('whistleblower_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('pelapor')->nullable();
            $table->string('terlapor');
            $table->text('laporan');
            $table->string('bukti_foto')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        // 15. PAYMENTS & BILLS (Legacy)
        Schema::create('bills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('trader_id');
            $table->uuid('slot_id');
            $table->decimal('amount', 15, 2);
            $table->date('due_date');
            $table->string('status')->default('unpaid');
            $table->timestamps();
            
            $table->foreign('trader_id')->references('id')->on('traders');
            $table->foreign('slot_id')->references('id')->on('slots');
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('bill_id')->nullable();
            $table->uuid('transaction_id')->nullable();
            $table->string('payment_method');
            $table->decimal('amount_paid', 15, 2);
            $table->timestamp('paid_at');
            $table->string('receipt_url')->nullable();
            $table->timestamps();
            
            $table->foreign('bill_id')->references('id')->on('bills');
            $table->foreign('transaction_id')->references('id')->on('transactions');
        });

        // 16. NOTIFICATIONS TABLE (Real-time Alerts)
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable(); // Target user
            $table->string('type'); // alert, info, complaint
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        // 17. PATROL_LOGS TABLE (Officer GPS Tracking)
        Schema::create('patrol_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('device_id');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->timestamp('pinged_at');
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('device_id')->references('id')->on('devices')->cascadeOnDelete();
            $table->index('user_id');
            $table->index('pinged_at');
        });
        // 18. PERMITS TABLE (Digital Permits)
        Schema::create('permits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('trader_id');
            $table->uuid('slot_id');
            $table->string('permit_number')->unique();
            $table->string('qr_code_payload');
            $table->date('issued_at');
            $table->date('expires_at');
            $table->enum('status', ['active', 'expired', 'revoked'])->default('active');
            $table->boolean('is_digital')->default(true);
            $table->timestamps();
            
            $table->foreign('trader_id')->references('id')->on('traders')->cascadeOnDelete();
            $table->foreign('slot_id')->references('id')->on('slots')->cascadeOnDelete();
        });
        // 19. WALLETS TABLE (Digital Cashless)
        Schema::create('wallets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('trader_id')->unique();
            $table->decimal('balance', 15, 2)->default(0);
            $table->string('currency')->default('IDR');
            $table->boolean('is_frozen')->default(false);
            $table->timestamps();
            
            $table->foreign('trader_id')->references('id')->on('traders')->cascadeOnDelete();
        });

        // 20. WALLET_TRANSACTIONS TABLE
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('wallet_id');
            $table->enum('type', ['topup', 'payment', 'refund', 'adjustment']);
            $table->decimal('amount', 15, 2);
            $table->string('description')->nullable();
            $table->string('reference_id')->nullable(); // External ref or transaction_id
            $table->timestamps();
            
            $table->foreign('wallet_id')->references('id')->on('wallets')->cascadeOnDelete();
        });
        // 21. PRICE_LOGS TABLE (Commodity Auditing)
        Schema::create('price_logs', function (Blueprint $table) {
            $table->id();
            $table->string('commodity_name');
            $table->decimal('price', 15, 2);
            $table->date('recorded_at');
            $table->uuid('slot_id')->nullable();
            $table->timestamps();
            
            $table->foreign('slot_id')->references('id')->on('slots')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_logs');
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('wallets');
        Schema::dropIfExists('permits');
        Schema::dropIfExists('patrol_logs');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('bills');
        Schema::dropIfExists('whistleblower_reports');
        Schema::dropIfExists('daily_summaries');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('complaints');
        Schema::dropIfExists('receipts');
        Schema::dropIfExists('sync_logs');
        Schema::dropIfExists('devices');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('traders');
        Schema::dropIfExists('slots');
        Schema::dropIfExists('zones');
        Schema::dropIfExists('users');
        Schema::dropIfExists('markets');
    }
};
