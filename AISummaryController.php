<?php

namespace App\Http\Controllers;

use App\Models\Stall;
use App\Models\Payment;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AISummaryController extends Controller
{
    public function brief()
    {
        $occupancy = app(\App\Services\OccupancyService::class)->calculate();
        
        $todayRevenue = Payment::whereDate('created_at', now())->sum('amount_paid');
        
        $latestAudit = AuditLog::latest()->take(3)->get()->map(function($log) {
            return "[{$log->created_at->format('H:i')}] {$log->action} by User {$log->user_id}";
        });

        return response()->json([
            'summary' => "SMOS Status Report: Occupancy is at {$occupancy['occupancy_rate']}%. Total active stalls: {$occupancy['active']}. Suspended stalls (Violations): {$occupancy['suspended']}. Today's revenue: Rp " . number_format($todayRevenue, 0, ',', '.') . ".",
            'critical_alerts' => $occupancy['suspended'] > 5 ? "High violation count detected!" : "System stable.",
            'recent_activity' => $latestAudit
        ]);
    }
}
