<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SystemDoctor extends Command
{
    protected $signature = 'system:doctor {--fix} {--check-permit=}';
    protected $description = 'Deep diagnostic and auto-repair for SVMS Enterprise';

    private $issues = [];
    private $fixed = [];

    public function handle()
    {
        $this->info("=== SVMS System Doctor v1.1 ===");
        $this->line("Running at: " . now()->toDateTimeString());

        if ($num = $this->option('check-permit')) {
            $this->checkSpecificPermit($num);
            return 0;
        }

        $this->checkTables();

        $this->checkRequiredTables();
        $this->checkRedisConnection();
        $this->checkOrphanRecords();
        $this->checkDataIntegrity();
        $this->optimizeTables();

        $this->newLine();
        $this->info('=== DIAGNOSIS COMPLETE ===');

        if (count($this->issues) === 0) {
            $this->info('All systems healthy. No issues found.');
        } else {
            $this->warn('Found ' . count($this->issues) . ' issue(s):');
            foreach ($this->issues as $issue) {
                $this->line('  - ' . $issue);
            }
        }

        if (count($this->fixed) > 0) {
            $this->info('Fixed ' . count($this->fixed) . ' issue(s):');
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
        $this->info('Checking required tables...');
        $required = ['markets', 'zones', 'slots', 'traders', 'permits', 'payments', 'audit_logs', 'wallets', 'settings'];

        foreach ($required as $table) {
            if (!Schema::hasTable($table)) {
                $this->issues[] = "Missing table: {$table}";
                $this->error("  ✗ Table '{$table}' is MISSING");
            } else {
                $count = DB::table($table)->count();
                $this->line("  [OK] {$table} ({$count} rows)");
            }
        }
    }

    private function checkRedisConnection()
    {
        $this->info('Checking Redis connection...');
        try {
            Cache::store('redis')->put('system_doctor_test', 'ok', 10);
            $val = Cache::store('redis')->get('system_doctor_test');
            if ($val === 'ok') {
                $this->line('  [OK] Redis connection OK');
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
        $this->info('Checking orphan records...');
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
            $this->line('  [OK] No orphan permits');
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
            $this->line('  [OK] No orphan permit-slot references');
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
            $this->line('  [OK] No orphan wallets');
        }
    }

    private function checkDataIntegrity()
    {
        $this->info('Checking data integrity...');

        // 1. Expired but active permits
        $expiredActive = DB::table('permits')
            ->where('status', 'active')
            ->where('expires_at', '<', now())
            ->count();

        if ($expiredActive > 0) {
            $this->issues[] = "{$expiredActive} expired permit(s) still marked as active";
            if ($this->option('fix')) {
                DB::table('permits')->where('status', 'active')->where('expires_at', '<', now())->update(['status' => 'expired']);
                $this->fixed[] = "Marked {$expiredActive} expired permit(s) as 'expired'";
            }
        } else {
            $this->line('  [OK] No expired-but-active permits');
        }

        // 2. Multiple active permits for the same trader
        $multiPermits = DB::table('permits')
            ->select('trader_id', DB::raw('COUNT(*) as cnt'))
            ->where('status', 'active')
            ->groupBy('trader_id')
            ->having('cnt', '>', 1)
            ->get();

        if ($multiPermits->count() > 0) {
            $this->issues[] = "{$multiPermits->count()} trader(s) have multiple active permits";
            if ($this->option('fix')) {
                foreach ($multiPermits as $mp) {
                    $keep = DB::table('permits')->where('trader_id', $mp->trader_id)->where('status', 'active')->orderByDesc('issued_at')->first();
                    DB::table('permits')->where('trader_id', $mp->trader_id)->where('status', 'active')->where('id', '!=', $keep->id)->update(['status' => 'superseded']);
                }
                $this->fixed[] = "Superseded duplicate active permits";
            }
        } else {
            $this->line('  [OK] No duplicate active permits');
        }

        // 3. Occupied slots without active permits
        $missingPermits = DB::table('slots')
            ->where('status', 'occupied')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))->from('permits')->whereRaw('permits.slot_id = slots.id')->where('status', 'active');
            })->count();

        if ($missingPermits > 0) {
            $this->issues[] = "{$missingPermits} slot(s) marked 'occupied' but have no active permit";
            if ($this->option('fix')) {
                DB::table('slots')->where('status', 'occupied')->whereNotExists(function ($query) {
                    $query->select(DB::raw(1))->from('permits')->whereRaw('permits.slot_id = slots.id')->where('status', 'active');
                })->update(['status' => 'empty']);
                $this->fixed[] = "Reset {$missingPermits} inconsistent slot(s) to 'empty'";
            }
        } else {
            $this->line('  [OK] No inconsistent occupied slots');
        }

        // 4. Duplicate permit numbers
        $duplicates = DB::table('permits')->select('permit_number', DB::raw('COUNT(*) as cnt'))->groupBy('permit_number')->having('cnt', '>', 1)->count();
        if ($duplicates > 0) {
             $this->issues[] = "{$duplicates} duplicate permit number(s) found";
        } else {
             $this->line('  [OK] No duplicate permit numbers');
        }
    }

    private function optimizeTables()
    {
        $this->info('Running table optimization...');
        $tables = ['slots', 'traders', 'permits', 'payments', 'audit_logs'];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                DB::statement("OPTIMIZE TABLE {$table}");
                $this->line("  [OK] Optimized: {$table}");
            }
        }
    }

    private function checkSpecificPermit($number)
    {
        $this->info("Investigating Permit: {$number}");
        $permit = DB::table('permits')->where('permit_number', $number)->first();
        
        if (!$permit) {
            $this->error("  [NOT FOUND] Permit '{$number}' does not exist in database.");
            return;
        }

        $this->line("  [FOUND] ID: {$permit->id}");
        $this->line("  [STATUS] {$permit->status}");
        $this->line("  [EXPIRES] {$permit->expires_at}");
        
        $trader = DB::table('traders')->where('id', $permit->trader_id)->first();
        $this->line("  [TRADER] " . ($trader ? $trader->name : "MISSING"));
        
        $slot = DB::table('slots')->where('id', $permit->slot_id)->first();
        $this->line("  [SLOT] " . ($slot ? $slot->code : "MISSING"));

        if ($permit->status !== 'active') {
            $this->warn("  ⚠ Permit is not active (current status: {$permit->status})");
        }
        
        if (now()->gt($permit->expires_at)) {
            $this->warn("  ⚠ Permit has EXPIRED");
        }
    }
}
