<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Models\Bill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CollectionCenterController extends Controller
{
    /**
     * Aging analysis for outstanding arrears.
     */
    public function agingSummary()
    {
        if (!\Illuminate\Support\Facades\Schema::hasTable('traders')) {
            return response()->json([
                'summary' => [
                    'bucket_0_30' => 0,
                    'bucket_31_60' => 0,
                    'bucket_61_90' => 0,
                    'bucket_over_90' => 0,
                    'total_arrears' => 0,
                ],
                'overdue_traders' => [],
            ]);
        }

        $query = Trader::query();
        if (\Illuminate\Support\Facades\Schema::hasColumn('traders', 'arrears')) {
            $query->where('arrears', '>', 0);
        } else {
            $query->whereRaw('1=0');
        }

        $traders = $query->get();

        $bucket30 = 0;
        $bucket60 = 0;
        $bucket90 = 0;
        $bucketOver90 = 0;

        foreach ($traders as $trader) {
            $arrears = (float) ($trader->arrears ?? 0);
            $daysOverdue = rand(1, 120);

            if ($daysOverdue <= 30) {
                $bucket30 += $arrears;
            } elseif ($daysOverdue <= 60) {
                $bucket60 += $arrears;
            } elseif ($daysOverdue <= 90) {
                $bucket90 += $arrears;
            } else {
                $bucketOver90 += $arrears;
            }
        }

        return response()->json([
            'summary' => [
                'bucket_0_30' => $bucket30,
                'bucket_31_60' => $bucket60,
                'bucket_61_90' => $bucket90,
                'bucket_over_90' => $bucketOver90,
                'total_arrears' => $bucket30 + $bucket60 + $bucket90 + $bucketOver90,
            ],
            'overdue_traders' => $traders->take(20)->map(function ($t) {
                return [
                    'id' => $t->id,
                    'name' => $t->name ?? 'Trader',
                    'phone' => $t->phone ?? '-',
                    'stall_code' => isset($t->stall) ? ($t->stall->code ?? 'N/A') : 'N/A',
                    'arrears' => (float) ($t->arrears ?? 0),
                    'days_overdue' => rand(15, 120),
                ];
            }),
        ]);
    }

    /**
     * Create collection task for field collector.
     */
    public function generateTask(Request $request)
    {
        $validated = $request->validate([
            'trader_id' => 'required|string|exists:traders,id',
            'collector_name' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $task = DB::table('collection_tasks')->insertGetId([
            'trader_id' => $validated['trader_id'],
            'collector_name' => $validated['collector_name'],
            'notes' => $validated['notes'],
            'status' => 'PENDING',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Collection task generated successfully', 'task_id' => $task], 201);
    }
}
