<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Models\Bill;
use App\Models\Payment;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Complaint;
use App\Models\PorterJob;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TenantPortalController extends Controller
{
    public function getDashboard($traderId)
    {
        $trader = Trader::with(['permits.slot', 'wallet'])->findOrFail($traderId);
        
        $unpaidBills = Bill::where('trader_id', $traderId)
            ->where('status', 'unpaid')
            ->orderBy('due_date', 'asc')
            ->get();

        $paidBills = Bill::where('trader_id', $traderId)
            ->where('status', 'paid')
            ->orderBy('due_date', 'desc')
            ->take(10)
            ->get();

        $complaints = Complaint::where('market_id', $trader->market_id)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'trader' => $trader,
            'unpaid_bills' => $unpaidBills,
            'paid_bills' => $paidBills,
            'complaints' => $complaints,
        ]);
    }

    public function payBill(Request $request)
    {
        $data = $request->validate([
            'bill_id' => 'required|exists:bills,id',
            'trader_id' => 'required|exists:traders,id'
        ]);

        $bill = Bill::findOrFail($data['bill_id']);
        $trader = Trader::findOrFail($data['trader_id']);
        $wallet = Wallet::firstOrCreate(
            ['trader_id' => $trader->id],
            ['balance' => 500000] // default top up for testing
        );

        if ($wallet->balance < $bill->amount) {
            return response()->json([
                'error' => 'Saldo Dompet tidak mencukupi.',
                'wallet_balance' => $wallet->balance,
                'bill_amount' => $bill->amount
            ], 400);
        }

        DB::transaction(function () use ($bill, $wallet, $trader) {
            // Deduct balance
            $wallet->balance -= $bill->amount;
            $wallet->save();

            // Record wallet transaction
            WalletTransaction::create([
                'id' => (string) Str::uuid(),
                'wallet_id' => $wallet->id,
                'type' => 'payment',
                'amount' => $bill->amount,
                'description' => "Pembayaran tagihan sewa bulanan #{$bill->id}",
                'reference_id' => $bill->id
            ]);

            // Update bill status
            $bill->status = 'paid';
            $bill->save();

            // Create global audit payment
            Payment::create([
                'id' => (string) Str::uuid(),
                'bill_id' => $bill->id,
                'transaction_id' => null,
                'payment_method' => 'wallet',
                'amount_paid' => $bill->amount,
                'paid_at' => Carbon::now()
            ]);

            // Log event
            \App\Services\AuditLogger::log('TENANT_PAY_BILL', [
                'trader_id' => $trader->id,
                'bill_id' => $bill->id,
                'amount' => $bill->amount,
                'new_balance' => $wallet->balance
            ]);
        });

        return response()->json([
            'message' => 'Pembayaran tagihan berhasil dilunasi!',
            'new_balance' => $wallet->balance
        ]);
    }

    public function submitComplaint(Request $request)
    {
        $data = $request->validate([
            'trader_id' => 'required|exists:traders,id',
            'category' => 'required|string',
            'description' => 'required|string'
        ]);

        $trader = Trader::findOrFail($data['trader_id']);

        $complaint = Complaint::create([
            'id' => (string) Str::uuid(),
            'market_id' => $trader->market_id,
            'zone_id' => null,
            'category' => $data['category'],
            'description' => $data['description'],
            'status' => 'open'
        ]);

        // Auto-route: Create a Porter Job for this complaint in the real-time porter queue
        $job = PorterJob::create([
            'id' => (string) Str::uuid(),
            'porter_id' => null, // open for grabs by active porters
            'status' => 'pending',
            'cargo_description' => "Perbaikan " . $data['category'] . ": " . substr($data['description'], 0, 40) . "...",
            'incentive_amount' => 15000, // static tip for porters
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        \App\Services\AuditLogger::log('TENANT_COMPLAINT', [
            'trader_id' => $trader->id,
            'complaint_id' => $complaint->id,
            'porter_job_id' => $job->id
        ]);

        return response()->json([
            'message' => 'Pengaduan berhasil diajukan dan telah dikirimkan ke antrean Porter pasar!',
            'complaint' => $complaint,
            'porter_job' => $job
        ]);
    }
}
