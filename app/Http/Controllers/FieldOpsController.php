<?php

namespace App\Http\Controllers;

use App\Models\ScanLog;
use Illuminate\Http\Request;

class FieldOpsController extends Controller
{
    /**
     * Record a field operation scan.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function scan(Request $request)
    {
        /** @var \Illuminate\Http\Request $request */
        $request->validate([
            'permit_number' => 'required|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        ScanLog::create([
            'user_id' => \auth()->id() ?? 1, // Default to admin for now if no auth
            'permit_number' => $request->input('permit_number'),
            'lat' => $request->input('lat'),
            'lng' => $request->input('lng'),
            'scanned_at' => \now()
        ]);

        return \response()->json([
            'success' => true,
            'message' => 'Scan recorded successfully'
        ]);
    }
}
