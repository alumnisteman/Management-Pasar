<?php

namespace App\Services;

use App\Models\Stall;

class OccupancyService
{
    public function calculate()
    {
        $total = Stall::count();
        if ($total === 0) return [
            'total' => 0,
            'active' => 0,
            'empty' => 0,
            'suspended' => 0,
            'occupancy_rate' => 0
        ];

        $active = Stall::where('status', 'ACTIVE')->count();
        $empty = Stall::where('status', 'EMPTY')->count();
        $suspended = Stall::where('status', 'SUSPENDED')->count();

        return [
            'total' => $total,
            'active' => $active,
            'empty' => $empty,
            'suspended' => $suspended,
            'occupancy_rate' => round(($active / $total) * 100, 2)
        ];
    }
}
