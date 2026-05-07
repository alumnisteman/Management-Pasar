<?php

namespace App\Http\Controllers;

use App\Models\Slot;
use App\Models\Trader;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        
        // Update slot status to blocked (occupied)
        $slot = Slot::findOrFail($data['slot_id']);
        $slot->status = 'blocked';
        $slot->save();
        
        // Generate a simple QR payload
        $qrPayload = 'QR-' . (string) \Illuminate\Support\Str::uuid();
        
        // Log the booking action
        \App\Services\AuditLogger::log('BOOK_SLOT', [
            'slot_id' => $slot->id,
            'vendor_id' => $data['vendor_id'],
            'qr' => $qrPayload,
        ]);
        
        return response()->json(['qr_code' => $qrPayload]);
    }

    public function slots() { return Slot::with(['priceLogs'])->get(); }

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
