<?php

namespace App\Http\Controllers;

use App\Models\ScanLog;
use Illuminate\Http\Request;

class FieldOpsController extends Controller
{
    public function scan(Request $request)
    {
        $request->validate([
            'permit_number' => 'required|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        ScanLog::create([
            'user_id' => auth()->id() ?? 1, // Default to admin for now if no auth
            'permit_number' => $request->permit_number,
            'lat' => $request->lat,
            'lng' => $request->lng,
            'scanned_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Scan recorded successfully'
        ]);
    }
}
