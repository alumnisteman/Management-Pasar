<?php

namespace App\Http\Controllers;

use App\Models\Market;
use Illuminate\Http\Request;

class MarketController extends Controller
{
    public function index(Request $request)
    {
        if (!\Illuminate\Support\Facades\Schema::hasTable('markets')) {
            return response()->json([]);
        }

        $query = \Illuminate\Support\Facades\Schema::hasTable('zones') ? Market::with(['zones']) : Market::query();

        if ($request->has('status') && \Illuminate\Support\Facades\Schema::hasColumn('markets', 'status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_pasar' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'status' => 'nullable|string|default:aktif',
            'is_active' => 'nullable|boolean',
        ]);

        $market = Market::create($validated);

        return response()->json([
            'message' => 'Market created successfully',
            'data' => $market
        ], 201);
    }

    public function show($id)
    {
        $market = Market::with(['zones', 'slots', 'traders'])->findOrFail($id);
        return response()->json($market);
    }

    public function update(Request $request, $id)
    {
        $market = Market::findOrFail($id);

        $validated = $request->validate([
            'kode_pasar' => 'nullable|string|max:50',
            'name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'status' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $market->update($validated);

        return response()->json([
            'message' => 'Market updated successfully',
            'data' => $market
        ]);
    }

    public function destroy($id)
    {
        $market = Market::findOrFail($id);
        $market->delete();

        return response()->json(['message' => 'Market deleted successfully']);
    }
}
