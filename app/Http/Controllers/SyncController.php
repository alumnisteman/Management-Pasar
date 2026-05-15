<?php

namespace App\Http\Controllers;

use App\Models\Market;
use App\Models\Zone;
use App\Models\Slot;
use App\Models\Trader;
use App\Models\Transaction;
use App\Models\SyncLog;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SyncController extends Controller
{
    /**
     * Pull master data for offline use.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function pull(Request $request)
    {
        /** @var \Illuminate\Http\Request $request */
        $marketId = $request->input('market_id');
        
        $data = [
            'markets' => Market::all(),
            'zones' => $marketId ? Zone::where('market_id', $marketId)->get() : Zone::all(),
            'slots' => $marketId ? Slot::where('market_id', $marketId)->get() : Slot::all(),
            'traders' => $marketId ? Trader::where('market_id', $marketId)->get() : Trader::all(),
            'server_time' => \now()->toDateTimeString(),
        ];

        return \response()->json($data);
    }

    /**
     * Push local transactions to the server.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function push(Request $request)
    {
        /** @var \Illuminate\Http\Request $request */
        $deviceId = $request->input('device_id');
        $transactions = $request->input('transactions', []);
        
        $successCount = 0;
        $failedCount = 0;

        \Illuminate\Support\Facades\DB::beginTransaction();
        try {
            foreach ($transactions as $tx) {
                // Check if transaction already exists by local_id
                if (Transaction::where('local_id', $tx['local_id'])->exists()) {
                    continue;
                }

                Transaction::create([
                    'id' => (string) \Illuminate\Support\Str::uuid(),
                    'local_id' => $tx['local_id'],
                    'market_id' => $tx['market_id'],
                    'slot_id' => $tx['slot_id'],
                    'trader_id' => $tx['trader_id'],
                    'officer_id' => $tx['officer_id'],
                    'device_id' => $deviceId,
                    'amount' => $tx['amount'],
                    'payment_method' => $tx['payment_method'],
                    'transaction_time' => $tx['transaction_time'],
                    'server_time' => \now(),
                    'status' => 'synced',
                    'receipt_number' => $tx['receipt_number'] ?? null,
                ]);
                $successCount++;
            }

            // Log the sync
            SyncLog::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'device_id' => $deviceId,
                'success_count' => $successCount,
                'failed_count' => $failedCount,
                'sync_started_at' => \now(),
                'sync_finished_at' => \now(),
            ]);

            \Illuminate\Support\Facades\DB::commit();
            return \response()->json(['status' => 'success', 'synced' => $successCount]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return \response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
