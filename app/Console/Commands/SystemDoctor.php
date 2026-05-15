<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SystemDoctor extends Command
{
    protected $signature = 'system:doctor {--fix : Automatically fix issues found}';
    protected $description = 'Run comprehensive system health checks and fix orphan records';

    private $issues = [];
    private $fixed = [];

    public function handle()
    {
        $this->info('=== SVMS System Doctor v1.0 ===');
        $this->info('Running at: ' . now()->toDateTimeString());
        $this->newLine();

        $this->checkRequiredTables();
        $this->checkRedisConnection();
        $this->checkOrphanRecords();
        $this->checkDataIntegrity();
        $this->optimizeTables();

        $this->newLine();
        $this->info('=== DIAGNOSIS COMPLETE ===');

        if (count($this->issues) === 0) {
            $this->info('✅ All systems healthy. No issues found.');
        } else {
            $this->warn('⚠️  Found ' . count($this->issues) . ' issue(s):');
            foreach ($this->issues as $issue) {
                $this->line('  - ' . $issue);
            }
        }

        if (count($this->fixed) > 0) {
            $this->info('🔧 Auto-fixed ' . count($this->fixed) . ' issue(s):');
            foreach ($this->fixed as $fix) {
                $this->line('  - ' . $fix);
            }
        }

        // Log results
        Log::channel('daily')->info('SystemDoctor run', [
            'issues' => $this->issues,
            'fixed' => $this->fixed,
            'timestamp' => now()->toDateTimeString(),
        ]);

        return count($this->issues) === 0 ? 0 : 1;
    }

    private function checkRequiredTables()
    {
        $this->info('📋 Checking required tables...');
        $required = ['markets', 'zones', 'slots', 'traders', 'permits', 'payments', 'audit_logs', 'wallets', 'settings'];

        foreach ($required as $table) {
            if (!Schema::hasTable($table)) {
                $this->issues[] = "Missing table: {$table}";
                $this->error("  ✗ Table '{$table}' is MISSING");
            } else {
                $count = DB::table($table)->count();
                $this->line("  ✓ {$table} ({$count} rows)");
            }
        }
    }

    private function checkRedisConnection()
    {
        $this->info('🔴 Checking Redis connection...');
        try {
            Cache::store('redis')->put('system_doctor_test', 'ok', 10);
            $val = Cache::store('redis')->get('system_doctor_test');
            if ($val === 'ok') {
                $this->line('  ✓ Redis connection OK');
            } else {
                $this->issues[] = 'Redis: write succeeded but read returned unexpected value';
                $this->warn('  ⚠ Redis read mismatch');
            }
        } catch (\Exception $e) {
            $this->issues[] = 'Redis connection failed: ' . $e->getMessage();
            $this->error('  ✗ Redis: ' . $e->getMessage());
        }
    }

    private function checkOrphanRecords()
    {
        $this->info('🔍 Checking orphan records...');
        $autoFix = $this->option('fix');

        // Permits without a valid trader
        $orphanPermits = DB::table('permits')
            ->leftJoin('traders', 'permits.trader_id', '=', 'traders.id')
            ->whereNull('traders.id')
            ->count();

        if ($orphanPermits > 0) {
            $this->issues[] = "Found {$orphanPermits} permit(s) without a valid trader";
            $this->warn("  ⚠ {$orphanPermits} orphan permit(s)");
            if ($autoFix) {
                DB::table('permits')
                    ->leftJoin('traders', 'permits.trader_id', '=', 'traders.id')
                    ->whereNull('traders.id')
                    ->delete();
                $this->fixed[] = "Deleted {$orphanPermits} orphan permit(s)";
            }
        } else {
            $this->line('  ✓ No orphan permits');
        }

        // Permits without a valid slot
        $orphanPermitSlots = DB::table('permits')
            ->leftJoin('slots', 'permits.slot_id', '=', 'slots.id')
            ->whereNull('slots.id')
            ->count();

        if ($orphanPermitSlots > 0) {
            $this->issues[] = "Found {$orphanPermitSlots} permit(s) with invalid slot reference";
            $this->warn("  ⚠ {$orphanPermitSlots} permit(s) with missing slot");
            if ($autoFix) {
                DB::table('permits')
                    ->leftJoin('slots', 'permits.slot_id', '=', 'slots.id')
                    ->whereNull('slots.id')
                    ->delete();
                $this->fixed[] = "Deleted {$orphanPermitSlots} orphan permit-slot(s)";
            }
        } else {
            $this->line('  ✓ No orphan permit-slot references');
        }

        // Wallets without a trader
        $orphanWallets = DB::table('wallets')
            ->leftJoin('traders', 'wallets.trader_id', '=', 'traders.id')
            ->whereNull('traders.id')
            ->count();

        if ($orphanWallets > 0) {
            $this->issues[] = "Found {$orphanWallets} wallet(s) without a valid trader";
            $this->warn("  ⚠ {$orphanWallets} orphan wallet(s)");
            if ($autoFix) {
                DB::table('wallets')
                    ->leftJoin('traders', 'wallets.trader_id', '=', 'traders.id')
                    ->whereNull('traders.id')
                    ->delete();
                $this->fixed[] = "Deleted {$orphanWallets} orphan wallet(s)";
            }
        } else {
            $this->line('  ✓ No orphan wallets');
        }
    }

    private function checkDataIntegrity()
    {
        $this->info('🛡️  Checking data integrity...');

        // Check for expired permits still marked as active
        $expiredActive = DB::table('permits')
            ->where('status', 'active')
            ->where('expires_at', '<', now())
            ->count();

        if ($expiredActive > 0) {
            $this->issues[] = "{$expiredActive} expired permit(s) still marked as active";
            $this->warn("  ⚠ {$expiredActive} expired-but-active permit(s)");
            if ($this->option('fix')) {
                DB::table('permits')
                    ->where('status', 'active')
                    ->where('expires_at', '<', now())
                    ->update(['status' => 'expired']);
                $this->fixed[] = "Marked {$expiredActive} expired permit(s) as 'expired'";
            }
        } else {
            $this->line('  ✓ No expired-but-active permits');
        }

        // Check for duplicate permit numbers
        $duplicates = DB::table('permits')
            ->select('permit_number', DB::raw('COUNT(*) as cnt'))
            ->groupBy('permit_number')
            ->having('cnt', '>', 1)
            ->count();

        if ($duplicates > 0) {
            $this->issues[] = "{$duplicates} duplicate permit number(s) found";
            $this->error("  ✗ {$duplicates} duplicate permit number(s)!");
        } else {
            $this->line('  ✓ No duplicate permit numbers');
        }

        // Check for traders without market_id
        if (Schema::hasColumn('traders', 'market_id')) {
            $noMarket = DB::table('traders')->whereNull('market_id')->count();
            if ($noMarket > 0) {
                $this->issues[] = "{$noMarket} trader(s) without a market assignment";
                $this->warn("  ⚠ {$noMarket} trader(s) without market_id");
            } else {
                $this->line('  ✓ All traders have market assignment');
            }
        }
    }

    private function optimizeTables()
    {
        $this->info('⚡ Running table optimization...');
        $tables = ['slots', 'traders', 'permits', 'payments', 'audit_logs'];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                DB::statement("OPTIMIZE TABLE {$table}");
                $this->line("  ✓ Optimized: {$table}");
            }
        }
    }
}
