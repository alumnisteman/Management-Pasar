<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Receipt;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReceiptController extends Controller
{
    /**
     * Generate a virtual receipt with anti-tamper hash.
     */
    public function generate($transactionId)
    {
        $tx = Transaction::with(['market', 'slot', 'trader'])->findOrFail($transactionId);
        
        $receiptNumber = $tx->receipt_number ?? 'REC-' . strtoupper(Str::random(10));
        
        // Ensure receipt record exists
        $receipt = Receipt::firstOrCreate(
            ['transaction_id' => $tx->id],
            [
                'id' => (string) Str::uuid(),
                'receipt_number' => $receiptNumber,
                'printed_at' => now(),
            ]
        );

        // Verification Hash for Anti-Pungli (HMAC of key data)
        $hashData = "{$tx->id}|{$tx->amount}|{$tx->transaction_time}";
        $vHash = hash_hmac('sha256', $hashData, config('app.key'));

        return response()->json([
            'market' => $tx->market->name,
            'receipt_number' => $receipt->receipt_number,
            'date' => $tx->transaction_time,
            'trader' => $tx->trader->name,
            'slot' => $tx->slot->code,
            'amount' => $tx->amount,
            'method' => $tx->payment_method,
            'verification_url' => "http://103.175.219.57/verify-receipt/{$receipt->receipt_number}",
            'v_hash' => $vHash
        ]);
    }
}
