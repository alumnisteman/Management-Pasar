<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Models\Stall;
use App\Models\Bill;
use App\Models\Payment;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TraderProfileController extends Controller
{
    /**
     * Return 360-degree aggregated profile for a trader.
     */
    public function fullProfile($id)
    {
        $trader = Trader::with(['market', 'stall', 'wallet', 'permits', 'trainings'])->findOrFail($id);

        // Fetch Financials
        $bills = Bill::where('trader_id', $id)->get();
        $payments = Payment::where('trader_id', $id)->orderBy('created_at', 'desc')->get();
        $totalArrears = $trader->arrears ?? 0;

        // Fetch Activities
        $complaints = DB::table('complaints')->where('trader_id', $id)->get();
        $inspections = DB::table('inspections')->where('trader_id', $id)->get();

        // Fetch Audit logs
        $auditLogs = AuditLog::where('data', 'like', "%{$id}%")
            ->orWhere('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json([
            'trader' => [
                'id' => $trader->id,
                'name' => $trader->name,
                'nik' => $trader->nik,
                'phone' => $trader->phone,
                'jenis_dagangan' => $trader->jenis_dagangan,
                'permit_number' => $trader->permit_number,
                'status' => $trader->status,
                'tanggal_masuk' => $trader->tanggal_masuk,
                'foto' => $trader->foto,
                'qr_code' => "TRD-{$trader->id}",
                'reputation_score' => $trader->reputation_score ?? 100,
            ],
            'stall' => $trader->stall ? [
                'id' => $trader->stall->id,
                'code' => $trader->stall->code ?? $trader->stall->kode_lapak,
                'block' => $trader->stall->block ? $trader->stall->block->name : 'Unassigned',
                'zone' => $trader->stall->zone ? $trader->stall->zone->name : 'Unassigned',
                'status' => $trader->stall->status ?? 'active',
            ] : null,
            'financial' => [
                'total_arrears' => (float) $totalArrears,
                'bills' => $bills,
                'payments' => $payments,
            ],
            'activities' => [
                'complaints' => $complaints,
                'inspections' => $inspections,
                'trainings' => $trader->trainings,
            ],
            'audit_logs' => $auditLogs,
        ]);
    }
}
