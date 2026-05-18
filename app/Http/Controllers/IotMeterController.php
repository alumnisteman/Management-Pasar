<?php

namespace App\Http\Controllers;

use App\Models\Slot;
use App\Models\SmartMeterReading;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Str;

class IotMeterController extends Controller
{
    public function index(Request $request)
    {
        $slotId = $request->query('slot_id');
        $type = $request->query('type');
        
        $query = SmartMeterReading::with('slot');
        if ($slotId) $query->where('slot_id', $slotId);
        if ($type) $query->where('type', $type);
        
        // Return latest 100 readings
        $readings = $query->orderBy('recorded_at', 'desc')->take(100)->get();
        
        // Calculate dynamic cost sum
        $totalCost = $query->sum('cost');
        
        return response()->json([
            'readings' => $readings,
            'total_cost' => $totalCost,
            'status' => 'active'
        ]);
    }

    public function storeSimulation(Request $request)
    {
        $data = $request->validate([
            'slot_id' => 'required|exists:slots,id',
            'type' => 'required|in:electricity,water',
            'reading' => 'required|numeric',
            'cost' => 'required|numeric'
        ]);

        $reading = SmartMeterReading::create([
            'id' => (string) Str::uuid(),
            'slot_id' => $data['slot_id'],
            'type' => $data['type'],
            'reading' => $data['reading'],
            'cost' => $data['cost'],
            'recorded_at' => Carbon::now()
        ]);

        // Simulated threshold warning check
        $isAlert = false;
        $message = "Reading successfully recorded.";
        
        if ($data['type'] === 'electricity' && $data['reading'] > 500) {
            $isAlert = true;
            $message = "⚠️ WARNING: Peringatan korsleting/penggunaan listrik berlebih pada Slot " . Slot::find($data['slot_id'])->code;
        } elseif ($data['type'] === 'water' && $data['reading'] > 50) {
            $isAlert = true;
            $message = "⚠️ WARNING: Peringatan kebocoran air/penggunaan air berlebih pada Slot " . Slot::find($data['slot_id'])->code;
        }

        if ($isAlert) {
            \App\Services\AuditLogger::log('IOT_ALERT', [
                'slot_id' => $data['slot_id'],
                'type' => $data['type'],
                'reading' => $data['reading'],
                'message' => $message
            ]);
        }

        return response()->json([
            'message' => $message,
            'reading' => $reading,
            'alert' => $isAlert
        ]);
    }
}
