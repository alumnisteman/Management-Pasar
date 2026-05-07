<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Services\AuditLogger;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index()
    {
        return Trader::with('wallet')->get()->map(function($trader) {
            $trader->wallet_balance = $trader->wallet->balance ?? 0;
            return $trader;
        });
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'nullable|string',
            'scale' => 'required|in:eceran,kecil,menengah,besar',
            'location_type' => 'required|in:kios,jalanan'
        ]);

        $trader = Trader::create([
            'name' => $data['name'],
            'nik' => $data['nik'],
            'type' => 'tetap',
            'status' => 'active',
            'scale' => $data['scale'],
            'location_type' => $data['location_type'],
            'reputation_score' => 100
        ]);

        // Create Wallet
        \App\Models\Wallet::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'trader_id' => $trader->id,
            'balance' => 0,
        ]);

        AuditLogger::log('CREATE_VENDOR', [
            'vendor_id' => $trader->id,
            'name' => $trader->name,
            'scale' => $trader->scale
        ]);

        return response()->json($trader, 201);
    }

    public function update(Request $request, $id)
    {
        $trader = Trader::findOrFail($id);
        
        $data = $request->validate([
            'name' => 'string|max:255',
            'nik' => 'string',
        ]);

        $trader->update($data);

        AuditLogger::log('UPDATE_VENDOR', [
            'vendor_id' => $trader->id,
            'changes' => $data
        ]);

        return response()->json($trader);
    }

    public function applyReward($id)
    {
        $trader = Trader::findOrFail($id);
        if ($trader->scale !== 'besar' || $trader->reputation_score <= 80) {
            return response()->json(['error' => 'Trader is not eligible for reward.'], 400);
        }

        AuditLogger::log('APPLY_REWARD', [
            'vendor_id' => $trader->id,
            'reputation' => $trader->reputation_score
        ]);

        return response()->json(['success' => true, 'message' => 'Reward applied successfully']);
    }
}
