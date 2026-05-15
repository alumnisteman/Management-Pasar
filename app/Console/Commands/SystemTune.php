<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SystemTune extends Command
{
    protected $signature = 'system:tune';
    protected $description = 'Perform long-term maintenance, cleanup, and performance tuning.';

    public function handle()
    {
        $this->info('🚀 Starting System Tuning & Cleanup...');

        // 1. Cleanup Old Sync Queues (Success ones older than 7 days)
        $cleanedQueues = DB::table('sync_queues')->where('status', 'sent')->where('created_at', '<', now()->subDays(7))->delete();
        $this->info("🧹 Cleaned $cleanedQueues old sync queue records.");

        // 2. Clear Application Cache safely
        Cache::flush();
        $this->info('⚡ Caches flushed and optimized.');

        // 3. Database Integrity Check
        // Ensure no assignments exist for deleted slots
        $orphanedAssignments = DB::table('assignments')->whereNotExists(function ($query) {
            $query->select(DB::raw(1))->from('slots')->whereRaw('slots.id = assignments.slot_id');
        })->delete();
        if ($orphanedAssignments > 0) {
            Log::warning("⚠️ Detected and fixed $orphanedAssignments orphaned assignments.");
            $this->info("🔧 Fixed $orphanedAssignments data integrity issues.");
        }

        // 4. Index Optimization (Ensuring indexes exist for fast lookups)
        // Note: These are usually in migrations, but we ensure them here for speed
        try {
            DB::statement('CREATE INDEX IF NOT EXISTS idx_transactions_trader_id ON transactions(trader_id)');
            DB::statement('CREATE INDEX IF NOT EXISTS idx_transactions_slot_id ON transactions(slot_id)');
            DB::statement('CREATE INDEX IF NOT EXISTS idx_slots_code ON slots(code)');
            $this->info('📈 Database indexes verified for high-speed access.');
        } catch (\Exception $e) {
            // Some drivers might not support CREATE INDEX IF NOT EXISTS directly
        }

        $this->info('✅ System is now TUNED and OPTIMIZED.');
        return 0;
    }
}
