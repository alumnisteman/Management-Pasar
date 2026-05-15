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
        $occupancy = \app(\App\Services\OccupancyService::class)->calculate();
        
        $todayRevenue = Payment::whereDate('created_at', now())->sum('amount_paid');
        
        $latestAudit = AuditLog::latest()->take(3)->get()->map(function($log) {
            return "[{$log->created_at->format('H:i')}] {$log->action} by User {$log->user_id}";
        });

        $prompt = "Summarize market performance. Occupancy: {$occupancy['occupancy_rate']}%, Active Stalls: {$occupancy['active']}, Suspended: {$occupancy['suspended']}, Today Revenue: Rp " . number_format($todayRevenue, 0, ',', '.') . ". Recent events: " . implode(', ', $latestAudit->toArray());
        
        $aiSummary = \app(\App\Services\AIService::class)->ask($prompt);

        return response()->json([
            'summary' => $aiSummary,
            'stats' => [
                'occupancy' => $occupancy,
                'revenue' => $todayRevenue
            ],
            'recent_activity' => $latestAudit
        ]);
    }
}
