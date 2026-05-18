<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Bill;
use App\Models\Payment;
use App\Models\Slot;
use App\Models\Trader;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CommandCenterController extends Controller
{
    /**
     * Get real-time statistics for the command center.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats()
    {
        $today = Carbon::today();
        
        $revenueToday = Payment::whereDate('paid_at', $today)->sum('amount_paid');
        $revenueMonth = Payment::whereMonth('paid_at', Carbon::now()->month)->sum('amount_paid');
        
        $totalBills = Bill::whereMonth('created_at', Carbon::now()->month)->count();
        $paidBills = Bill::whereMonth('created_at', Carbon::now()->month)->where('status', 'paid')->count();
        $complianceRate = $totalBills > 0 ? \round(($paidBills / $totalBills) * 100, 2) : 0;
        
        $totalSlots = Slot::count();
        $occupiedSlots = \App\Models\Permit::where('status', 'active')->distinct('slot_id')->count();
        $occupancyRate = $totalSlots > 0 ? \round(($occupiedSlots / $totalSlots) * 100, 2) : 0;
        
        $activeComplaints = Complaint::where('status', 'open')->count();
        
        return \response()->json([
            'revenue_today'     => $revenueToday,
            'revenue_month'     => $revenueMonth,
            'compliance_rate'   => $complianceRate,
            'occupancy_rate'    => $occupancyRate,
            'active_complaints' => $activeComplaints,
            'total_traders'     => Trader::count(),
            'total_permits'     => \App\Models\Permit::where('status', 'active')->count(),
            'last_updated'      => \now()->toDateTimeString()
        ]);
    }

    /**
     * Get heatmap data for occupancy.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHeatmap()
    {
        // Simple heatmap data: count of traders per zone/market
        $data = DB::table('slots')
            ->select('category', DB::raw('count(*) as count'))
            ->where('status', 'active')
            ->groupBy('category')
            ->get();
            
        return \response()->json($data);
    }

    /**
     * Deep health status check for SVMS backend systems.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHealthStatus()
    {
        $status = 'OPERATIONAL';
        $checks = [];

        // 1. Database Check
        try {
            DB::connection()->getPdo();
            $checks['database'] = 'OK';
        } catch (\Exception $e) {
            $checks['database'] = 'FAIL: ' . $e->getMessage();
            $status = 'DEGRADED';
        }

        // 2. Redis/Cache Check
        try {
            $redis = \Illuminate\Support\Facades\Redis::connection();
            $redis->ping();
            $checks['redis'] = 'OK';
        } catch (\Exception $e) {
            $checks['redis'] = 'FAIL: ' . $e->getMessage();
            $status = 'DEGRADED';
        }

        // 3. Storage Check
        $storagePaths = [
            'logs' => storage_path('logs'),
            'views' => storage_path('framework/views'),
            'sessions' => storage_path('framework/sessions'),
        ];
        $checks['storage'] = 'OK';
        foreach ($storagePaths as $name => $path) {
            if (!is_writable($path)) {
                $checks['storage'] = 'FAIL: Storage path ' . $name . ' is not writable.';
                $status = 'DEGRADED';
                break;
            }
        }

        // 4. Migrations Check
        try {
            \Illuminate\Support\Facades\Artisan::call('migrate:status');
            $migrationOutput = \Illuminate\Support\Facades\Artisan::output();
            if (str_contains($migrationOutput, '| No |')) {
                $checks['migrations'] = 'PENDING';
                $status = 'DEGRADED';
            } else {
                $checks['migrations'] = 'OK';
            }
        } catch (\Exception $e) {
            $checks['migrations'] = 'FAIL: ' . $e->getMessage();
            $status = 'DEGRADED';
        }

        // 5. System Uptime Info (Request processing time)
        $checks['laravel_uptime'] = round(microtime(true) - LARAVEL_START, 4) . 's';

        return response()->json([
            'status' => $status,
            'timestamp' => now()->toIso8601String(),
            'checks' => $checks
        ]);
    }

    /**
     * Auto-Heal System: Clears cache, optimizes views, and restarts queue worker
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function autoHeal()
    {
        try {
            \Illuminate\Support\Facades\Artisan::call('optimize:clear');
            \Illuminate\Support\Facades\Artisan::call('queue:restart');
            
            \App\Services\AuditLogger::log('SYSTEM_AUTO_HEAL', [
                'action_type' => 'RESTART_AND_CLEAR',
                'triggered_by' => 'admin',
                'status'       => 'Success',
            ]);

            return \response()->json([
                'status' => 'success',
                'message' => 'System Auto-Heal completed successfully. Caches cleared and queues restarted.'
            ]);
        } catch (\Exception $e) {
            return \response()->json([
                'status' => 'error',
                'message' => 'Auto-Heal failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
