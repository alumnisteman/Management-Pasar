<?php

namespace App\Services;

use App\Models\Vendor;
use App\Models\Inspection;

class ReputationService
{
    /**
     * Calculate and update vendor reputation based on inspections and violations.
     */
    public function updateReputation(Vendor $vendor)
    {
        $baseScore = 100;

        // 1. Penalty from Violation Score (Server-side Rule Engine)
        $violationPenalty = $vendor->violation_score;
        $score = $baseScore - $violationPenalty;

        // 2. Bonus/Penalty from Inspections (Field Audits)
        $lastInspections = Inspection::where('vendor_id', $vendor->id)
            ->latest()
            ->take(5)
            ->get();

        foreach ($lastInspections as $inspection) {
            if ($inspection->status === 'Excellent') $score += 5;
            if ($inspection->status === 'Good') $score += 2;
            if ($inspection->status === 'Poor') $score -= 10;
        }

        // Clamp score between 0 and 100
        $score = max(0, min(100, $score));

        $vendor->update(['reputation_score' => $score]);

        return $score;
    }

    /**
     * Get Badge Level
     */
    public function getBadge($score)
    {
        if ($score >= 90) return 'Gold';
        if ($score >= 70) return 'Silver';
        if ($score >= 50) return 'Bronze';
        return 'Standard';
    }
}
