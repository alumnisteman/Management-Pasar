<?php

namespace App\Http\Controllers;

use App\Models\EmergencyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EmergencyController extends Controller
{
    public function index()
    {
        // For command center view
        return response()->json(EmergencyReport::whereIn('status', ['reported', 'responding'])->get());
    }

    public function reportEmergency(Request $request)
    {
        $validated = $request->validate([
            'reporter_id' => 'required|string',
            'reporter_type' => 'required|string', // Trader, Customer, User
            'type' => 'required|string',
            'description' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $report = EmergencyReport::create(array_merge($validated, [
            'id' => (string) Str::uuid(),
            'status' => 'reported'
        ]));

        // In a real scenario, this should trigger an Event/WebSocket broadcast to the CommandCenter/Patrol
        
        return response()->json($report, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $report = EmergencyReport::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:reported,responding,resolved'
        ]);

        $report->update(['status' => $validated['status']]);

        return response()->json($report);
    }
}
