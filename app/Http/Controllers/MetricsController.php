<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Models\Slot;
use App\Models\Payment;
use Illuminate\Http\Request;

class MetricsController extends Controller
{
    public function prometheus()
    {
        $traderCount = \Illuminate\Support\Facades\Schema::hasTable('traders') ? Trader::count() : 0;
        $slotCount = \Illuminate\Support\Facades\Schema::hasTable('slots') ? Slot::count() : 0;
        $occupiedSlots = (\Illuminate\Support\Facades\Schema::hasTable('slots') && \Illuminate\Support\Facades\Schema::hasColumn('slots', 'status')) ? Slot::where('status', 'occupied')->count() : 0;
        $totalPayments = (\Illuminate\Support\Facades\Schema::hasTable('payments') && \Illuminate\Support\Facades\Schema::hasColumn('payments', 'amount_paid')) ? Payment::sum('amount_paid') : 0;

        $metrics = [];
        $metrics[] = "# HELP svms_traders_total Total number of registered traders";
        $metrics[] = "# TYPE svms_traders_total gauge";
        $metrics[] = "svms_traders_total {$traderCount}";

        $metrics[] = "# HELP svms_slots_total Total number of stalls/slots";
        $metrics[] = "# TYPE svms_slots_total gauge";
        $metrics[] = "svms_slots_total {$slotCount}";

        $metrics[] = "# HELP svms_slots_occupied Number of occupied stalls/slots";
        $metrics[] = "# TYPE svms_slots_occupied gauge";
        $metrics[] = "svms_slots_occupied {$occupiedSlots}";

        $metrics[] = "# HELP svms_revenue_total Total revenue collected in IDR";
        $metrics[] = "# TYPE svms_revenue_total counter";
        $metrics[] = "svms_revenue_total {$totalPayments}";

        return response(implode("\n", $metrics), 200, [
            'Content-Type' => 'text/plain; version=0.0.4'
        ]);
    }
}
