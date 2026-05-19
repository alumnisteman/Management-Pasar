<?php

namespace App\Http\Controllers;

use App\Models\WasteLog;
use App\Models\Setting;
use App\Models\Bill;
use App\Models\Trader;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Str;

class WasteController extends Controller
{
    public function index()
    {
        return response()->json(WasteLog::with(['market', 'zone', 'trader', 'slot'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'market_id' => 'required|exists:markets,id',
            'zone_id' => 'required|exists:zones,id',
            'trader_id' => 'nullable|exists:traders,id',
            'slot_id' => 'nullable|exists:slots,id',
            'volume_kg' => 'required|numeric',
            'type' => 'required|string',
        ]);

        $log = WasteLog::create(array_merge($validated, [
            'status' => 'collected',
            'collected_at' => now()
        ]));

        return response()->json($log, 201);
    }

    public function generateMonthlyBills()
    {
        // Get the base rate from settings, default to 50000 if not found
        $baseRateSetting = Setting::where('key', 'waste_base_price')->first();
        $baseRate = $baseRateSetting ? (float)$baseRateSetting->value : 50000;

        $traders = Trader::where('status', 'active')->get();
        $billsCreated = 0;

        foreach ($traders as $trader) {
            // Check if bill for current month already exists
            // Since Bill table lacks 'type' by default, we'll assume a new bill every run.
            // In a complete implementation, we should add 'type' or 'description' to the Bill model.
            
            Bill::create([
                'id' => (string) Str::uuid(),
                'trader_id' => $trader->id,
                'amount' => $baseRate, // Optionally multiply by slot size
                'status' => 'unpaid',
                'due_date' => Carbon::now()->addDays(14)
            ]);
            $billsCreated++;
        }

        return response()->json(['message' => "$billsCreated waste bills generated successfully at Rp $baseRate / trader."]);
    }
}
