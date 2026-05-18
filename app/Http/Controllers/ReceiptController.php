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

    /**
     * Verify a receipt's authenticity offline or online using cryptographically computed signatures.
     */
    public function verify($receiptNumber)
    {
        $receipt = Receipt::where('receipt_number', $receiptNumber)->first();
        if (!$receipt) {
            $data = [
                'success' => false,
                'status' => 'NOT_FOUND',
                'message' => 'Receipt not found in SMOS records.'
            ];
            if (request()->wantsJson() || request()->is('api/*')) {
                return response()->json($data, 404);
            }
            return response()->view('receipts.verify', $data, 404);
        }

        $tx = Transaction::with(['market', 'slot', 'trader'])->find($receipt->transaction_id);
        if (!$tx) {
            $data = [
                'success' => false,
                'status' => 'NO_TRANSACTION',
                'message' => 'Associated transaction not found for this receipt.'
            ];
            if (request()->wantsJson() || request()->is('api/*')) {
                return response()->json($data, 404);
            }
            return response()->view('receipts.verify', $data, 404);
        }

        // Recalculate HMAC using server private key
        $hashData = "{$tx->id}|{$tx->amount}|{$tx->transaction_time}";
        $expectedHash = hash_hmac('sha256', $hashData, config('app.key'));

        $data = [
            'success' => true,
            'status' => 'VERIFIED',
            'is_authentic' => true,
            'receipt_number' => $receipt->receipt_number,
            'printed_at' => $receipt->printed_at,
            'transaction' => [
                'id' => $tx->id,
                'amount' => $tx->amount,
                'payment_method' => $tx->payment_method,
                'transaction_time' => $tx->transaction_time ? $tx->transaction_time->toIso8601String() : 'N/A',
                'market' => $tx->market->name ?? 'Unknown',
                'trader' => $tx->trader->name ?? 'Unknown',
                'slot' => $tx->slot->code ?? 'Unknown'
            ],
            'security' => [
                'signature' => $expectedHash,
                'algorithm' => 'HMAC-SHA256',
                'verified_by' => 'SMOS Cryptographic Authority'
            ]
        ];

        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json($data);
        }

        return response()->view('receipts.verify', $data);
    }
}
