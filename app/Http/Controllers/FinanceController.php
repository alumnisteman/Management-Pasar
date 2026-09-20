<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FinanceController extends Controller
{
    /**
     * Dashboard Keuangan — data riil dari tabel bills & payments.
     */
    public function dashboard()
    {
        // Ambil total tagihan berdasarkan status
        $billStats = DB::table('bills')
            ->selectRaw("
                SUM(amount) as total_billed,
                SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid,
                SUM(CASE WHEN status IN ('unpaid','overdue') THEN amount ELSE 0 END) as total_arrears,
                COUNT(*) as total_bills,
                SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_count,
                SUM(CASE WHEN status = 'unpaid' THEN 1 ELSE 0 END) as unpaid_count,
                SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count
            ")
            ->first();

        $totalBilled  = (float)($billStats->total_billed ?? 0);
        $totalPaid    = (float)($billStats->total_paid ?? 0);
        $totalArrears = (float)($billStats->total_arrears ?? 0);
        $collRate     = $totalBilled > 0 ? round(($totalPaid / $totalBilled) * 100, 1) : 0;

        // Trend bulanan 6 bulan terakhir
        $monthly = DB::table('bills')
            ->selectRaw("DATE_FORMAT(created_at, '%b %Y') as month, DATE_FORMAT(created_at, '%Y-%m') as ym, SUM(amount) as total, SUM(CASE WHEN status='paid' THEN amount ELSE 0 END) as paid")
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')")
            ->orderByRaw("DATE_FORMAT(created_at, '%Y-%m')")
            ->get();

        // Aging Piutang: 0-30, 31-60, 61-90, >90 hari
        $aging = [
            '0_30'  => (float) DB::table('bills')->whereIn('status', ['unpaid','overdue'])->where('due_date', '>=', now()->subDays(30))->sum('amount'),
            '31_60' => (float) DB::table('bills')->whereIn('status', ['unpaid','overdue'])->whereBetween('due_date', [now()->subDays(60), now()->subDays(30)])->sum('amount'),
            '61_90' => (float) DB::table('bills')->whereIn('status', ['unpaid','overdue'])->whereBetween('due_date', [now()->subDays(90), now()->subDays(60)])->sum('amount'),
            '90_plus'=> (float) DB::table('bills')->whereIn('status', ['unpaid','overdue'])->where('due_date', '<', now()->subDays(90))->sum('amount'),
        ];

        // 10 Pedagang dengan tunggakan tertinggi
        $topDebtors = DB::table('bills')
            ->join('traders', 'bills.trader_id', '=', 'traders.id')
            ->whereIn('bills.status', ['unpaid', 'overdue'])
            ->groupBy('traders.id', 'traders.name', 'traders.phone')
            ->selectRaw('traders.id, traders.name, traders.phone, SUM(bills.amount) as total_arrears, COUNT(*) as bill_count')
            ->orderByRaw('SUM(bills.amount) DESC')
            ->limit(10)
            ->get();

        return response()->json([
            'summary' => [
                'total_billed'        => $totalBilled,
                'total_paid'          => $totalPaid,
                'total_arrears'       => $totalArrears,
                'collection_rate_pct' => $collRate,
                'total_bills'         => (int)($billStats->total_bills ?? 0),
                'overdue_count'       => (int)($billStats->overdue_count ?? 0),
                'unpaid_count'        => (int)($billStats->unpaid_count ?? 0),
                'paid_count'          => (int)($billStats->paid_count ?? 0),
            ],
            'monthly_trend' => $monthly->map(fn($m) => [
                'month'  => $m->month,
                'income' => (float)$m->paid,
                'target' => (float)$m->total,
            ]),
            'aging_piutang' => $aging,
            'top_debtors'   => $topDebtors,
        ]);
    }

    /**
     * Generate tagihan bulanan untuk semua lapak aktif.
     */
    public function generateBills(Request $request)
    {
        $validated = $request->validate([
            'month' => 'required|string',
            'year'  => 'required|integer',
        ]);

        // Ambil semua permits aktif
        $permits = DB::table('permits')
            ->join('slots', 'permits.slot_id', '=', 'slots.id')
            ->where('permits.status', 'active')
            ->select('permits.id as permit_id', 'permits.trader_id', 'permits.slot_id', 'slots.price')
            ->get();

        $created = 0;
        foreach ($permits as $permit) {
            // Cek apakah sudah ada tagihan bulan ini
            $exists = DB::table('bills')
                ->where('permit_id', $permit->permit_id)
                ->whereYear('created_at', $validated['year'])
                ->whereMonth('created_at', date('m', strtotime('1 ' . $validated['month'])))
                ->exists();

            if (!$exists) {
                DB::table('bills')->insert([
                    'id'        => (string)\Illuminate\Support\Str::uuid(),
                    'permit_id' => $permit->permit_id,
                    'trader_id' => $permit->trader_id,
                    'slot_id'   => $permit->slot_id,
                    'amount'    => $permit->price ?? 450000,
                    'type'      => 'rent',
                    'status'    => 'unpaid',
                    'due_date'  => date('Y-m-25', strtotime("1 {$validated['month']} {$validated['year']}")),
                    'created_at'=> now(),
                    'updated_at'=> now(),
                ]);
                $created++;
            }
        }

        return response()->json([
            'message'      => "Tagihan bulan {$validated['month']} {$validated['year']} berhasil dibuat.",
            'bills_created'=> $created,
            'total_permits'=> $permits->count(),
        ], 201);
    }

    /**
     * Rekonsiliasi keuangan — cocokkan bills dengan payments.
     */
    public function reconcile(Request $request)
    {
        $totalBills    = DB::table('bills')->count();
        $paidBills     = DB::table('bills')->where('status', 'paid')->count();
        $unmatchedBills= DB::table('bills')
            ->whereIn('status', ['unpaid', 'overdue'])
            ->where('due_date', '<', now())
            ->count();

        // Tandai bills yang sudah overdue
        $markedOverdue = DB::table('bills')
            ->where('status', 'unpaid')
            ->where('due_date', '<', now())
            ->update(['status' => 'overdue', 'updated_at' => now()]);

        return response()->json([
            'message'          => 'Rekonsiliasi keuangan selesai.',
            'total_bills'      => $totalBills,
            'matched_records'  => $paidBills,
            'unmatched_records'=> $unmatchedBills,
            'marked_overdue'   => $markedOverdue,
            'status'           => $unmatchedBills === 0 ? 'BALANCED' : 'HAS_ARREARS',
            'reconciled_at'    => now()->toIso8601String(),
        ]);
    }
}
