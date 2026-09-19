<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\Permit;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BillingService
{
    /**
     * Generate monthly bills for all active permits.
     */
    public function generateMonthlyBills()
    {
        $count = 0;
        $totalAmount = 0;

        Permit::where('status', 'active')->chunk(100, function ($activePermits) use (&$count, &$totalAmount) {
            foreach ($activePermits as $permit) {
                $month = Carbon::now()->format('Y-m');
                
                // Check if bill already exists for this trader, slot, and month
                $exists = Bill::where('trader_id', $permit->trader_id)
                    ->where('slot_id', $permit->slot_id)
                    ->whereYear('created_at', Carbon::now()->year)
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->exists();

                if (!$exists) {
                    $amount = $this->calculateRate($permit->slot->category ?? 'umum');
                    
                    $bill = Bill::create([
                        'trader_id' => $permit->trader_id,
                        'slot_id' => $permit->slot_id,
                        'amount' => $amount,
                        'due_date' => Carbon::now()->endOfMonth(),
                        'status' => 'unpaid'
                    ]);

                    $this->attemptAutoDebit($bill);
                    
                    $count++;
                    $totalAmount += $amount;
                }
            }
        });

        return [
            'generated_count' => $count,
            'total_amount' => $totalAmount
        ];
    }

    private function calculateRate($category)
    {
        return match (strtolower($category)) {
            'basah' => 50000,
            'kering' => 75000,
            'kuliner' => 100000,
            default => 30000,
        };
    }

    private function attemptAutoDebit(Bill $bill)
    {
        $wallet = Wallet::where('trader_id', $bill->trader_id)->first();

        if ($wallet && $wallet->balance >= $bill->amount && !$wallet->is_frozen) {
            DB::beginTransaction();
            try {
                // Deduct from wallet
                $wallet->decrement('balance', $bill->amount);

                // Record transaction
                WalletTransaction::create([
                    'id' => (string) Str::uuid(),
                    'wallet_id' => $wallet->id,
                    'type' => 'payment',
                    'amount' => -$bill->amount,
                    'description' => "Pembayaran Otomatis Retribusi Lapak " . ($bill->slot->code ?? ''),
                    'reference_id' => $bill->id
                ]);

                // Update bill status
                $bill->update(['status' => 'paid']);

                // Log audit
                AuditLog::create([
                    'id' => (string) Str::uuid(),
                    'action' => 'AUTO_DEBIT_RETRIBUSI',
                    'module' => 'BILLING',
                    'payload' => json_encode([
                        'bill_id' => $bill->id,
                        'trader_id' => $bill->trader_id,
                        'amount' => $bill->amount
                    ])
                ]);

                DB::commit();
                return true;
            } catch (\Exception $e) {
                DB::rollBack();
                return false;
            }
        }

        return false;
    }
}
