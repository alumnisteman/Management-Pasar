<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Models\Permit;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class IdentityController extends Controller
{
    /**
     * Generate a virtual identity card for a trader.
     */
    public function generateCard($id)
    {
        $trader = Trader::with(['market', 'permits.slot'])->findOrFail($id);
        $activePermit = $trader->permits->where('status', 'active')->first();

        return response()->json([
            'id' => $trader->id,
            'name' => $trader->name,
            'nik' => $trader->nik,
            'market' => $trader->market->name ?? 'Pasar Pusat Jakarta',
            'slot' => $activePermit->slot->code ?? 'N/A',
            'permit_number' => $activePermit->permit_number ?? 'PENDING',
            'valid_until' => $activePermit->expires_at ?? 'N/A',
            'photo_url' => 'https://ui-avatars.com/api/?name=' . urlencode($trader->name) . '&background=6366f1&color=fff&size=200',
            'qr_code' => 'TRADER-' . $trader->id
        ]);
    }

    public function batchGenerate()
    {
        $traders = Trader::with(['market', 'permits.slot'])->get();
        $data = $traders->map(function($trader) {
            $activePermit = $trader->permits->where('status', 'active')->first();
            return [
                'name' => $trader->name,
                'nik' => $trader->nik,
                'market' => $trader->market->name ?? 'Pasar Pusat Jakarta',
                'slot' => $activePermit->slot->code ?? 'N/A',
                'permit_number' => $activePermit->permit_number ?? 'PENDING',
                'photo_url' => 'https://ui-avatars.com/api/?name=' . urlencode($trader->name) . '&background=6366f1&color=fff&size=100',
                'qr_code' => 'TRADER-' . $trader->id
            ];
        });

        return view('batch_id_cards', ['traders' => $data]);
    }

    public function insuranceStatus($id)
    {
        $trader = Trader::findOrFail($id);
        return response()->json([
            'trader_id' => $trader->id,
            'name' => $trader->name,
            'bpjs_status' => $trader->reputation_score > 60 ? 'Active' : 'Lapsed',
            'last_payment' => now()->subDays(10)->toDateString(),
            'monthly_premium' => 16800,
            'provider' => 'BPJS Ketenagakerjaan (Pasar Mandiri)'
        ]);
    }

    public function payInsurance($id)
    {
        $trader = Trader::findOrFail($id);
        $wallet = \App\Models\Wallet::where('trader_id', $trader->id)->first();
        $premium = 16800;

        if (!$wallet || $wallet->balance < $premium) {
            return response()->json(['error' => 'Saldo dompet digital tidak cukup.'], 400);
        }

        \DB::beginTransaction();
        try {
            $wallet->decrement('balance', $premium);
            \App\Models\WalletTransaction::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'wallet_id' => $wallet->id,
                'type' => 'payment',
                'amount' => -$premium,
                'description' => 'Iuran BPJS Ketenagakerjaan (Otomatis)'
            ]);
            \DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Iuran BPJS berhasil dibayar.']);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['error' => 'Gagal memproses pembayaran.'], 500);
        }
    }
}
