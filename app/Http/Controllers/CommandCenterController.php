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
