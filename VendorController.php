<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use App\Events\MarketDataUpdated;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        $query = Trader::with('wallet');
        
        if ($request->has('page')) {
            $paginator = $query->paginate($request->get('per_page', 10));
            $paginator->getCollection()->transform(function($trader) {
                $trader->wallet_balance = $trader->wallet->balance ?? 0;
                return $trader;
            });
            return $paginator;
        }

        return $query->get()->map(function($trader) {
            $trader->wallet_balance = $trader->wallet->balance ?? 0;
            return $trader;
        });
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'nullable|string',
            'scale' => 'string|in:eceran,kecil,menengah,besar',
            'location_type' => 'string|in:kios,jalanan'
        ]);

        $trader = Trader::create([
            'name' => $data['name'],
            'nik' => $data['nik'],
            'type' => 'tetap',
            'status' => 'active',
            'scale' => $data['scale'] ?? 'eceran',
            'location_type' => $data['location_type'] ?? 'jalanan',
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

        try {
            broadcast(new MarketDataUpdated("Pedagang baru: {$trader->name} telah terdaftar", 'success'));
        } catch (\Exception $e) {
            \Log::warning("Broadcasting failed: " . $e->getMessage());
        }

        return response()->json($trader, 201);
    }

    public function update(Request $request, $id)
    {
        $trader = Trader::findOrFail($id);
        
        $data = $request->validate([
            'name' => 'string|max:255',
            'nik' => 'string|nullable',
            'phone' => 'string|nullable',
        ]);

        $trader->update($data);

        AuditLogger::log('UPDATE_VENDOR', [
            'vendor_id' => $trader->id,
            'changes' => $data
        ]);

        try {
            broadcast(new MarketDataUpdated("Data Pedagang: {$trader->name} telah diperbarui", 'info'));
        } catch (\Exception $e) {
            \Log::warning("Broadcasting failed: " . $e->getMessage());
        }

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

    public function relocate(Request $request, $id)
    {
        $request->validate([
            'new_slot_id' => 'required|exists:slots,id'
        ]);

        $trader = Trader::findOrFail($id);
        $oldSlotId = $trader->stall_id;
        $newSlotId = $request->new_slot_id;

        // Update Old Slot
        if ($oldSlotId) {
            $oldSlot = \App\Models\Slot::find($oldSlotId);
            if ($oldSlot) {
                $oldSlot->status = 'empty';
                $oldSlot->save();
            }
        }

        // Update Trader
        $trader->stall_id = $newSlotId;
        $trader->save();

        // Update New Slot
        $newSlot = \App\Models\Slot::findOrFail($newSlotId);
        $newSlot->status = 'occupied';
        $newSlot->save();

        AuditLogger::log('RELOCATE_VENDOR', [
            'vendor_id' => $trader->id,
            'old_slot_id' => $oldSlotId,
            'new_slot_id' => $newSlotId
        ]);

        try {
            broadcast(new MarketDataUpdated("Pedagang {$trader->name} telah direlokasi ke {$newSlot->code}", 'warning'));
        } catch (\Exception $e) {
            \Log::warning("Broadcasting failed: " . $e->getMessage());
        }

        return response()->json(['message' => 'Relokasi berhasil', 'trader' => $trader]);
    }
}
