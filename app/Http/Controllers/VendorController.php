<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Models\Wallet;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class VendorController extends Controller
{
    /**
     * @return \Illuminate\Database\Eloquent\Collection|array
     */
    public function index()
    {
        return Trader::with('wallet')->orderBy('created_at', 'desc')->get()->map(function(Trader $trader) {
            /** @var Trader $trader */
            $trader->wallet_balance = $trader->wallet->balance ?? 0;
            return $trader;
        });
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'nik'           => 'nullable|string',
            'phone'         => 'nullable|string',
            'scale'         => 'required|in:eceran,kecil,menengah,besar',
            'location_type' => 'required|in:kios,jalanan'
        ]);

        $trader = Trader::create([
            'id'               => (string) Str::uuid(),
            'name'             => $data['name'],
            'nik'              => $data['nik'],
            'phone'            => $data['phone'] ?? null,
            'type'             => 'tetap',
            'status'           => 'active',
            'scale'            => $data['scale'],
            'location_type'    => $data['location_type'],
            'reputation_score' => 100
        ]);

        // Create Wallet
        Wallet::create([
            'id'        => (string) Str::uuid(),
            'trader_id' => $trader->id,
            'balance'   => 0,
        ]);

        AuditLogger::log('CREATE_VENDOR', [
            'vendor_id' => $trader->id,
            'name'      => $trader->name,
            'scale'     => $trader->scale
        ]);

        return \response()->json($trader, 201);
    }

    /**
     * @param  string  $id
     * @return Trader
     */
    public function show($id): Trader
    {
        return Trader::with('wallet')->findOrFail($id);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $trader = Trader::findOrFail($id);
        
        $data = $request->validate([
            'name'  => 'string|max:255',
            'nik'   => 'string',
            'phone' => 'string',
        ]);

        $trader->update($data);

        AuditLogger::log('UPDATE_VENDOR', [
            'vendor_id' => $trader->id,
            'changes'   => $data
        ]);

        return \response()->json($trader);
    }

    /**
     * @param  string  $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $trader = Trader::findOrFail($id);
        $trader->delete();

        AuditLogger::log('DELETE_VENDOR', [
            'vendor_id'   => $id,
            'vendor_name' => $trader->name
        ]);

        return \response()->json(['status' => 'success']);
    }

    /**
     * @param  string  $id
     * @return JsonResponse
     */
    public function applyReward($id): JsonResponse
    {
        $trader = Trader::findOrFail($id);
        if ($trader->scale !== 'besar' || $trader->reputation_score <= 80) {
            return \response()->json(['error' => 'Trader is not eligible for reward.'], 400);
        }

        AuditLogger::log('APPLY_REWARD', [
            'vendor_id'  => $trader->id,
            'reputation' => $trader->reputation_score
        ]);

        return \response()->json(['success' => true, 'message' => 'Reward applied successfully']);
    }
}
