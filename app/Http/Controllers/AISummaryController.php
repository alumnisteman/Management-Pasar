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
            return "[{$log->created_at->format('H:i')}] {$log->action}";
        });

        $aiService = new \App\Services\AIService();
        
        $dataForAI = [
            'occupancy' => $occupancy,
            'today_revenue' => $todayRevenue,
            'recent_logs' => $latestAudit
        ];

        $aiSummary = $aiService->generateSummary($dataForAI);

        return response()->json([
            'summary' => $aiSummary,
            'critical_alerts' => $occupancy['suspended'] > 5 ? "High violation count detected!" : "System stable.",
            'recent_activity' => $latestAudit,
            'ai_status' => $aiService->getStatus()
        ]);
    }
}
