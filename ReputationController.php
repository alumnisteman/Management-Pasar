<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReputationController extends Controller
{
    /**
     * Calculate and update a trader's reputation score.
     */
    public function recalculate($traderId)
    {
        $trader = Trader::findOrFail($traderId);
        
        // Base score
        $score = 50;

        // +Points for timely payments (simulated for now)
        $score += 20; 

        // -Points for whistleblower reports
        $complaintCount = \DB::table('whistleblower_reports')->where('terlapor', 'LIKE', "%{$trader->name}%")->count();
        $score -= ($complaintCount * 15);

        // Cap score between 0 and 100
        $score = max(0, min(100, $score));
        
        $trader->update(['reputation_score' => $score]);

        return response()->json(['status' => 'success', 'new_score' => $score]);
    }

    /**
     * Apply a reward/benefit for high reputation traders.
     */
    public function applyReward($id)
    {
        $trader = Trader::findOrFail($id);
        if ($trader->scale !== 'besar' || $trader->reputation_score <= 80) {
            return response()->json(['error' => 'Trader is not eligible for reward.'], 400);
        }

        return response()->json(['status' => 'success', 'message' => "Reward 'Discount 10%' applied to {$trader->name}"]);
    }

    public function rate(Request $request, $id)
    {
        $data = $request->validate([
            'score' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500'
        ]);

        $trader = Trader::findOrFail($id);
        
        // Impact reputation: 5 stars = +2, 4 stars = +1, 1-2 stars = -5
        $impact = 0;
        if ($data['score'] == 5) $impact = 2;
        elseif ($data['score'] == 4) $impact = 1;
        elseif ($data['score'] <= 2) $impact = -5;

        $trader->increment('reputation_score', $impact);
        $trader->reputation_score = max(0, min(100, $trader->reputation_score));
        
        // Auto-Deactivation Logic
        if ($trader->reputation_score < 10 && $trader->status !== 'inactive') {
            $trader->status = 'inactive';
            \App\Models\Notification::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'title' => '🚨 PENANGGUHAN OTOMATIS: ' . $trader->name,
                'message' => 'Reputasi pedagang jatuh di bawah ambang batas minimum (10 pts). Izin usaha ditangguhkan sementara.',
                'type' => 'alert',
                'is_read' => false
            ]);
        }
        
        $trader->save();
        
        \DB::table('audit_logs')->insert([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'module' => 'REPUTATION',
            'action' => 'PUBLIC_RATING',
            'data' => json_encode(['trader_id' => $id, 'score' => $data['score'], 'impact' => $impact]),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['status' => 'success', 'new_reputation' => $trader->reputation_score]);
    }
}
