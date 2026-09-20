<?php

namespace App\Http\Controllers;

use App\Models\Slot;
use App\Models\Trader;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Events\MarketDataUpdated;

class GridController extends Controller
{
    public function book(Request $request)
    {
        $data = $request->validate([
            'slot_id' => 'required|exists:slots,id',
            'vendor_id' => 'required|exists:traders,id',
            'shift' => 'required|string',
            'date' => 'required|date',
        ]);
        
        // Update slot status to occupied
        $slot = Slot::with(['zone.market', 'block'])->findOrFail($data['slot_id']);
        
        $mCode = $slot->zone->market->kode_pasar ?? 'M';
        $zCode = strtoupper($slot->zone->kode_zona ?? 'ZON');
        $bCode = strtoupper($slot->block->kode_blok ?? 'BLK');
        $sNum = $slot->code; 
        
        $permitNumber = "SIPTU-{$mCode}-{$zCode}-{$bCode}-{$sNum}";
        $qrPayload = "VERIFY-{$permitNumber}";

        // Create the Permit record
        $permit = \App\Models\Permit::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'permit_number' => $permitNumber,
            'trader_id' => $data['vendor_id'],
            'slot_id' => $data['slot_id'],
            'issued_at' => now(),
            'expires_at' => now()->addYear(),
            'status' => 'active',
            'qr_code_payload' => $qrPayload
        ]);

        $slot->status = 'occupied';
        $slot->save();

        // Sync Trader permit number and status
        $trader = Trader::findOrFail($data['vendor_id']);
        $trader->permit_number = $permitNumber;
        $trader->status = 'active';
        $trader->expired_at = now()->addYear();
        $trader->save();

        // Log the booking action
        \App\Services\AuditLogger::log('BOOK_SLOT_PERMIT', [
            'slot_id' => $slot->id,
            'vendor_id' => $data['vendor_id'],
            'permit_number' => $permitNumber,
            'qr' => $qrPayload,
        ]);

        // Dispatch background job for WhatsApp Notification
        \App\Jobs\SendWhatsAppNotification::dispatch(
            $trader->phone ?? '0800000000', 
            "Halo {$trader->name}, Lapak {$slot->code} Anda berhasil dibooking. Izin digital Anda: {$permitNumber}",
            ['permit' => $permitNumber]
        );

        try {
            broadcast(new MarketDataUpdated("Lapak {$slot->code} telah berhasil dibooking oleh {$trader->name}", 'success'));
        } catch (\Exception $e) {
            \Log::warning("Broadcasting failed: " . $e->getMessage());
        }

        return response()->json(['qr_code' => $qrPayload, 'permit' => $permit]);
    }

    public function slots() { return Slot::with(['priceLogs', 'zone', 'trader'])->get(); }

    public function heatmap()
    {
        // Fetch slots with a count of transactions in the last 24h as 'intensity'
        $heatmapData = Slot::select('slots.*', DB::raw('(SELECT COUNT(*) FROM transactions WHERE transactions.slot_id = slots.id AND transactions.created_at >= NOW() - INTERVAL 1 DAY) as intensity'))
            ->get();
            
        return response()->json($heatmapData);
    }

    public function exportHeatmap(Request $request)
    {
        $marketId = $request->query('market_id');
        $query = Slot::query();
        if ($marketId) $query->where('market_id', $marketId);
        $slots = $query->get();

        return view('heatmap_report', ['slots' => $slots, 'date' => now()->toDateString()]);
    }

    public function verify($qr)
    {
        return response()->json(['qr' => $qr, 'status' => 'valid']);
    }

    public function dynamicPricing(Request $request)
    {
        $marketId = $request->query('market_id');
        $query = Slot::query();
        if ($marketId) $query->where('market_id', $marketId);
        
        $total = $query->count();
        $occupied = Slot::where('status', 'occupied')->count();
        $occupancy = ($total > 0) ? ($occupied / $total) * 100 : 0;
        
        $basePrice = (int) (\App\Models\Setting::where('key', 'price_daily_standard')->first()->value ?? 15000);
        $multiplier = 1.0;
        
        if ($occupancy > 90) $multiplier = 1.3;
        elseif ($occupancy > 75) $multiplier = 1.15;
        elseif ($occupancy < 30) $multiplier = 0.85;
        
        return response()->json([
            'occupancy' => round($occupancy, 1) . '%',
            'base_price' => $basePrice,
            'multiplier' => $multiplier,
            'dynamic_price' => round($basePrice * $multiplier),
            'trend' => $multiplier > 1 ? 'UP' : ($multiplier < 1 ? 'DOWN' : 'STABLE')
        ]);
    }
}
