<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyPoint;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LoyaltyController extends Controller
{
    public function getCustomerPoints($customerId)
    {
        $customer = Customer::findOrFail($customerId);
        $totalEarned = LoyaltyPoint::where('customer_id', $customerId)->where('transaction_type', 'earn')->sum('points');
        $totalSpent = LoyaltyPoint::where('customer_id', $customerId)->where('transaction_type', 'spend')->sum('points');
        
        return response()->json([
            'customer_id' => $customerId,
            'current_balance' => $totalEarned - $totalSpent,
            'history' => LoyaltyPoint::where('customer_id', $customerId)->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function addPoints(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'points' => 'required|integer|min:1',
            'description' => 'required|string',
        ]);

        $log = LoyaltyPoint::create([
            'id' => (string) Str::uuid(),
            'customer_id' => $validated['customer_id'],
            'points' => $validated['points'],
            'description' => $validated['description'],
            'transaction_type' => 'earn'
        ]);

        return response()->json($log, 201);
    }
}
