<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\AuditLog;
use Carbon\Carbon;

class ArchiveOldLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:archive-logs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archive audit logs older than 6 months into a backup table to optimize database performance';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info("Starting Log Archival Process...");
        
        // Ensure the archive table exists without a migration
        DB::statement('CREATE TABLE IF NOT EXISTS audit_logs_archive LIKE audit_logs');
        
        $sixMonthsAgo = Carbon::now()->subMonths(6);
        $count = 0;
        
        // Loop using limit to avoid offset shifting when deleting
        while (true) {
            $logs = AuditLog::where('created_at', '<', $sixMonthsAgo)
                ->limit(500)
                ->get();
                
            if ($logs->isEmpty()) {
                break;
            }
            
            $insertData = [];
            $idsToDelete = [];
            
            foreach ($logs as $log) {
                $insertData[] = $log->getAttributes();
                $idsToDelete[] = $log->id;
            }
            
            // Bulk insert into archive table
            DB::table('audit_logs_archive')->insert($insertData);
            
            // Bulk delete from main table
            AuditLog::whereIn('id', $idsToDelete)->delete();
            
            $count += count($insertData);
            $this->info("Archived {$count} logs...");
        }
            
        $this->info("Archival Complete! Total logs archived and pruned: {$count}");
        return Command::SUCCESS;
    }
}
