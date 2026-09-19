<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('incidents')) {
            Schema::create('incidents', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('market_id')->nullable();
                $table->string('reporter_name');
                $table->string('type'); // SECURITY, FIRE, SANITATION, BREACH, DISPUTE
                $table->string('severity')->default('LOW'); // LOW, MEDIUM, HIGH, CRITICAL
                $table->text('description');
                $table->string('status')->default('OPEN'); // OPEN, INVESTIGATING, RESOLVED, CLOSED
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('announcements')) {
            Schema::create('announcements', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('title');
                $table->text('content');
                $table->string('target_market_id')->nullable();
                $table->string('category')->default('GENERAL'); // GENERAL, URGENT, MAINTENANCE, TARIFF
                $table->string('priority')->default('NORMAL'); // LOW, NORMAL, HIGH, URGENT
                $table->timestamp('published_at')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('inspections')) {
            Schema::create('inspections', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('stall_code');
                $table->string('trader_name')->default('N/A');
                $table->string('inspector_name');
                $table->string('cleanliness_status');
                $table->string('security_status');
                $table->boolean('payment_verified')->default(true);
                $table->text('notes')->nullable();
                $table->string('photo')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('approvals')) {
            Schema::create('approvals', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('type');
                $table->string('requested_by');
                $table->json('details');
                $table->string('status')->default('PENDING'); // PENDING, APPROVED, REJECTED
                $table->string('approved_by')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('collection_tasks')) {
            Schema::create('collection_tasks', function (Blueprint $table) {
                $table->id();
                $table->string('trader_id');
                $table->string('collector_name');
                $table->text('notes')->nullable();
                $table->string('status')->default('PENDING');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('inspections');
        Schema::dropIfExists('approvals');
        Schema::dropIfExists('collection_tasks');
    }
};
