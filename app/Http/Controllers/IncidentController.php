<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        if (!Schema::hasTable('incidents')) {
            return response()->json([]);
        }

        $query = DB::table('incidents')->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json($query->limit(50)->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'market_id' => 'nullable|string',
            'reporter_name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'severity' => 'nullable|string|in:LOW,MEDIUM,HIGH,CRITICAL',
            'description' => 'required|string',
        ]);

        $id = (string) Str::uuid();

        if (Schema::hasTable('incidents')) {
            DB::table('incidents')->insert([
                'id' => $id,
                'market_id' => $validated['market_id'] ?? null,
                'reporter_name' => $validated['reporter_name'],
                'type' => $validated['type'],
                'severity' => $validated['severity'] ?? 'LOW',
                'description' => $validated['description'],
                'status' => 'OPEN',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Incident reported successfully', 'id' => $id], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:OPEN,INVESTIGATING,RESOLVED,CLOSED',
        ]);

        if (Schema::hasTable('incidents')) {
            DB::table('incidents')->where('id', $id)->update([
                'status' => $validated['status'],
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Incident status updated']);
    }
}
