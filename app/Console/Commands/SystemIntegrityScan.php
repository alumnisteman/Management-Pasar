<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SlotBooking;
use App\Models\Notification;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SystemIntegrityScan extends \Illuminate\Console\Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'svms:scan-integrity';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan for AI-detected anomalies, fraud, and data integrity issues.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting System Integrity Scan...');
        
        $today = Carbon::today();
        
        // 1. Detect Traders bypassing the 2-slot limit (Fraud Detection)
        $suspiciousTraders = SlotBooking::select('vendor_id')
            ->whereDate('date', $today)
            ->where('status', 'active')
            ->groupBy('vendor_id')
            ->havingRaw('COUNT(id) > 2')
            ->get();
            
        foreach ($suspiciousTraders as $anomaly) {
            $this->warn("Anomaly detected: Vendor {$anomaly->vendor_id} exceeded daily slot limit.");
            
            Notification::create([
                'id' => (string) Str::uuid(),
                'title' => '🚨 AI Integrity Alert: Aturan Terlanggar',
                'message' => "Pedagang dengan ID {$anomaly->vendor_id} terdeteksi menguasai lebih dari 2 slot secara bersamaan hari ini. Ini mengindikasikan potensi monopoli lapak.",
                'type' => 'alert',
                'is_read' => false
            ]);
            
            \App\Services\AuditLogger::log('AI_ANOMALY_MONOPOLY', ['vendor_id' => $anomaly->vendor_id]);
        }
        
        // 2. Detect missing / ghost permits (Traders occupying active slots without valid permits)
        $ghostOccupancies = \Illuminate\Support\Facades\DB::table('slots')
            ->leftJoin('permits', 'slots.id', '=', 'permits.slot_id')
            ->where('slots.status', 'occupied')
            ->where(function($q) {
                $q->whereNull('permits.id')
                  ->orWhere('permits.status', '!=', 'active');
            })
            ->count();
            
        if ($ghostOccupancies > 0) {
            $this->error("Ghost Occupancy Detected: {$ghostOccupancies} slots occupied without active permits.");
            
            Notification::create([
                'id' => (string) Str::uuid(),
                'title' => '⚠️ AI Integrity Alert: Ghost Occupancy',
                'message' => "Sistem mendeteksi ada {$ghostOccupancies} lapak berstatus 'occupied' namun tidak memiliki izin aktif (Permit) yang terhubung. Kemungkinan besar lapak diisi secara ilegal.",
                'type' => 'warning',
                'is_read' => false
            ]);
            
            \App\Services\AuditLogger::log('AI_ANOMALY_GHOST', ['count' => $ghostOccupancies]);
        }
        
        $this->info('Scan Complete. Anomalies logged.');
        return 0;
    }
}
