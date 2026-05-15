<?php

namespace App\Http\Controllers;

use App\Models\WhistleblowerReport;
use App\Services\AuditLogger;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        return WhistleblowerReport::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'pelapor' => 'nullable|string',
            'terlapor' => 'required|string',
            'laporan' => 'required|string',
        ]);

        $reportId = (string) \Illuminate\Support\Str::uuid();
        \DB::table('whistleblower_reports')->insert([
            'id' => $reportId,
            'pelapor' => $data['pelapor'],
            'terlapor' => $data['terlapor'],
            'laporan' => $data['laporan'],
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['id' => $reportId, 'status' => 'pending'], 201);
    }

    public function verify($id)
    {
        $report = \DB::table('whistleblower_reports')->where('id', $id)->first();
        if (!$report) return response()->json(['error' => 'Report not found'], 404);

        \DB::table('whistleblower_reports')->where('id', $id)->update(['status' => 'verified']);

        // If pelapor is a trader ID (e.g. TRADER-1), give reward
        if ($report->pelapor && str_starts_with($report->pelapor, 'TRADER-')) {
            $traderId = str_replace('TRADER-', '', $report->pelapor);
            $wallet = \App\Models\Wallet::where('trader_id', $traderId)->first();
            if ($wallet) {
                $wallet->increment('balance', 50000); // Rp 50.000 reward
                \App\Models\WalletTransaction::create([
                    'id' => (string) \Illuminate\Support\Str::uuid(),
                    'wallet_id' => $wallet->id,
                    'type' => 'topup',
                    'amount' => 50000,
                    'description' => 'Reward: Laporan Valid (Anti-Pungli)'
                ]);
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Laporan diverifikasi & Reward dikirim.']);
    }
}
