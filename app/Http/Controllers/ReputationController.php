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
     * 
     * @param  int|string  $traderId
     * @return \Illuminate\Http\JsonResponse
     */
    public function recalculate($traderId)
    {
        $trader = Trader::findOrFail($traderId);
        
        // Base score
        $score = 50;

        // +Points for timely payments (simulated for now)
        $score += 20; 

        // -Points for whistleblower reports
        $complaintCount = \Illuminate\Support\Facades\DB::table('whistleblower_reports')->where('terlapor', 'LIKE', "%{$trader->name}%")->count();
        $score -= ($complaintCount * 15);

        // Cap score between 0 and 100
        $score = \max(0, \min(100, $score));
        
        $trader->update(['reputation_score' => $score]);

        return \response()->json(['status' => 'success', 'new_score' => $score]);
    }

    /**
     * Apply a reward/benefit for high reputation traders.
     * 
     * @param  int|string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function applyReward($id)
    {
        $trader = Trader::findOrFail($id);
        
        $tier = 'Bronze';
        if ($trader->reputation_score >= 86) $tier = 'Platinum';
        elseif ($trader->reputation_score >= 61) $tier = 'Gold';
        elseif ($trader->reputation_score >= 31) $tier = 'Silver';

        if ($tier !== 'Platinum') {
            return \response()->json(['error' => 'Hanya pedagang tier Platinum yang berhak mendapat reward ini.', 'current_tier' => $tier], 400);
        }

        return \response()->json([
            'status' => 'success', 
            'tier' => $tier,
            'message' => "Reward 'Discount 10%' otomatis aktif untuk {$trader->name}"
        ]);
    }

    /**
     * Rate a trader and impact their reputation.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  int|string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function rate(Request $request, $id)
    {
        /** @var \Illuminate\Http\Request $request */
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
        $trader->reputation_score = \max(0, \min(100, $trader->reputation_score));
        
        // Auto-Deactivation Logic
        if ($trader->reputation_score < 10 && $trader->status !== 'inactive') {
            $trader->status = 'inactive';
            \App\Models\Notification::create([
                'id' => (string) Str::uuid(),
                'title' => '🚨 PENANGGUHAN OTOMATIS: ' . $trader->name,
                'message' => 'Reputasi pedagang jatuh di bawah ambang batas minimum (10 pts). Izin usaha ditangguhkan sementara.',
                'type' => 'alert',
                'is_read' => false
            ]);
        }
        
        $trader->save();
        
        \App\Services\AuditLogger::log('REPUTATION_RATING', [
            'action_type' => 'UPDATE_SCORE',
            'trader_id' => $id, 
            'score' => $data['score'], 
            'impact' => $impact
        ]);

        return \response()->json(['status' => 'success', 'new_reputation' => $trader->reputation_score]);
    }
}
