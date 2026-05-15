<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use Illuminate\Http\Request;

class TraderVerificationController extends Controller
{
    public function verify($permit)
    {
        $trader = Trader::with(['stall', 'market'])
            ->where('permit_number', $permit)
            ->first();

        if (!$trader) {
            return response()->json([
                'status' => false,
                'message' => 'INVALID TRADER'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => [
                'name' => $trader->name,
                'market' => $trader->market->name ?? 'N/A',
                'stall' => $trader->stall->code ?? 'N/A',
                'status' => $trader->status,
                'arrears' => $trader->arrears,
                'expired_at' => $trader->expired_at
            ]
        ]);
    }
}
