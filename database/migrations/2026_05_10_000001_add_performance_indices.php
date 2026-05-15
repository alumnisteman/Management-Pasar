<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends \Illuminate\Database\Migrations\Migration
{
    public function up(): void
    {
        if (Schema::hasTable('traders')) {
            Schema::table('traders', function (Blueprint $table) {
                if (!$this->indexExists('traders', 'traders_nik_index')) {
                    $table->index('nik');
                }
                if (!$this->indexExists('traders', 'traders_status_index')) {
                    $table->index('status');
                }
            });
        }

        if (Schema::hasTable('permits')) {
            Schema::table('permits', function (Blueprint $table) {
                if (!$this->indexExists('permits', 'permits_trader_id_index')) {
                    $table->index('trader_id');
                }
                if (!$this->indexExists('permits', 'permits_permit_number_index')) {
                    $table->index('permit_number');
                }
            });
        }

        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                if (!$this->indexExists('audit_logs', 'audit_logs_action_index')) {
                    $table->index('action');
                }
                if (!$this->indexExists('audit_logs', 'audit_logs_user_id_index')) {
                    $table->index('user_id');
                }
            });
        }

        if (Schema::hasTable('assignments')) {
            Schema::table('assignments', function (Blueprint $table) {
                if (!$this->indexExists('assignments', 'assignments_trader_id_stall_id_index')) {
                    $table->index(['trader_id', 'stall_id']);
                }
            });
        }

        if (Schema::hasTable('transactions')) {
            Schema::table('transactions', function (Blueprint $table) {
                if (!$this->indexExists('transactions', 'transactions_created_at_index')) {
                    $table->index('created_at');
                }
                if (!$this->indexExists('transactions', 'transactions_trader_id_index')) {
                    $table->index('trader_id');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('traders')) {
            Schema::table('traders', function (Blueprint $table) {
                $table->dropIndexIfExists(['nik']);
                $table->dropIndexIfExists(['status']);
            });
        }
        if (Schema::hasTable('permits')) {
            Schema::table('permits', function (Blueprint $table) {
                $table->dropIndexIfExists(['trader_id']);
                $table->dropIndexIfExists(['permit_number']);
            });
        }
        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->dropIndexIfExists(['action']);
                $table->dropIndexIfExists(['user_id']);
            });
        }
        if (Schema::hasTable('assignments')) {
            Schema::table('assignments', function (Blueprint $table) {
                $table->dropIndexIfExists(['trader_id', 'stall_id']);
            });
        }
        if (Schema::hasTable('transactions')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->dropIndexIfExists(['created_at']);
                $table->dropIndexIfExists(['trader_id']);
            });
        }
    }

    private function indexExists(string $table, string $indexName): bool
    {
        $result = DB::select(
            "SHOW INDEX FROM `{$table}` WHERE Key_name = ?",
            [$indexName]
        );
        return count($result) > 0;
    }
};
