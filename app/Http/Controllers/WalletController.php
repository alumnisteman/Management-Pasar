<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Trader;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    /**
     * Get trader wallet balance.
     */
    public function balance($traderId)
    {
        $wallet = Wallet::where('trader_id', $traderId)->firstOrFail();
        return response()->json($wallet);
    }

    /**
     * Top up wallet balance.
     */
    public function topup(Request $request, $traderId)
    {
        $data = $request->validate([
            'amount' => 'required|numeric|min:1000',
        ]);

        $wallet = Wallet::where('trader_id', $traderId)->firstOrFail();

        DB::beginTransaction();
        try {
            $wallet->increment('balance', $data['amount']);
            
            WalletTransaction::create([
                'id' => (string) Str::uuid(),
                'wallet_id' => $wallet->id,
                'type' => 'topup',
                'amount' => $data['amount'],
                'description' => 'Top-up saldo via loket pusat',
            ]);

            DB::commit();
            return response()->json(['status' => 'success', 'new_balance' => $wallet->balance]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Pay using wallet.
     */
    public function pay(Request $request, $traderId)
    {
        $data = $request->validate([
            'amount' => 'required|numeric',
            'description' => 'required|string',
            'reference_id' => 'nullable|string',
        ]);

        $wallet = Wallet::where('trader_id', $traderId)->firstOrFail();

        if ($wallet->balance < $data['amount']) {
            return response()->json(['error' => 'Saldo tidak mencukupi'], 400);
        }

        DB::beginTransaction();
        try {
            $wallet->decrement('balance', $data['amount']);
            
            WalletTransaction::create([
                'id' => (string) Str::uuid(),
                'wallet_id' => $wallet->id,
                'type' => 'payment',
                'amount' => -$data['amount'],
                'description' => $data['description'],
                'reference_id' => $data['reference_id'],
            ]);

            DB::commit();
            return response()->json(['status' => 'success', 'new_balance' => $wallet->balance]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function history($traderId)
    {
        $wallet = Wallet::where('trader_id', $traderId)->firstOrFail();
        $history = WalletTransaction::where('wallet_id', $wallet->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($history);
    }

    public function batchPay(Request $request)
    {
        $data = $request->validate([
            'trader_ids' => 'required|array',
            'amount' => 'required|numeric',
            'description' => 'required|string',
        ]);

        $results = [];
        foreach ($data['trader_ids'] as $id) {
            $wallet = Wallet::where('trader_id', $id)->first();
            if (!$wallet || $wallet->balance < $data['amount']) {
                $results[$id] = 'failed: insufficient balance';
                continue;
            }

            DB::beginTransaction();
            try {
                $wallet->decrement('balance', $data['amount']);
                WalletTransaction::create([
                    'id' => (string) Str::uuid(),
                    'wallet_id' => $wallet->id,
                    'type' => 'payment',
                    'amount' => -$data['amount'],
                    'description' => $data['description'],
                ]);
                DB::commit();
                $results[$id] = 'success';
            } catch (\Exception $e) {
                DB::rollBack();
                $results[$id] = 'error: ' . $e->getMessage();
            }
        }

        return response()->json($results);
    }
}
