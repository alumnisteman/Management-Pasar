<?php

namespace App\Http\Controllers;

use App\Models\PatrolLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PatrolController extends Controller
{
    /**
     * Update officer GPS position.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ping(Request $request)
    {
        /** @var \Illuminate\Http\Request $request */
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'device_id' => 'required|exists:devices,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $log = PatrolLog::create([
            'id' => (string) Str::uuid(),
            'user_id' => $data['user_id'],
            'device_id' => $data['device_id'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'pinged_at' => \now(),
        ]);

        return \response()->json(['status' => 'success', 'pinged_at' => $log->pinged_at]);
    }

    /**
     * Get live positions of all active officers.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function livePositions()
    {
        // Get the latest ping for each user within the last 15 minutes
        $positions = PatrolLog::with('user')
            ->select('user_id', 'latitude', 'longitude', 'pinged_at')
            ->where('pinged_at', '>=', \now()->subMinutes(15))
            ->orderBy('pinged_at', 'desc')
            ->get()
            ->unique('user_id');

        return \response()->json($positions);
    }
}
