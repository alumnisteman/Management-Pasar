<?php

namespace App\Services;

use App\Models\Trader;

class TraderRiskService
{
    public function score($trader)
    {
        $score = 0;

        if ($trader->arrears > 1000000) {
            $score += 40;
        }

        if ($trader->status == 'SUSPENDED') {
            $score += 30;
        }

        if ($trader->expired_at && $trader->expired_at < now()) {
            $score += 30;
        }

        return [
            'score' => $score,
            'risk_level' => match(true) {
                $score >= 70 => 'HIGH',
                $score >= 40 => 'MEDIUM',
                default => 'LOW'
            }
        ];
    }
}
