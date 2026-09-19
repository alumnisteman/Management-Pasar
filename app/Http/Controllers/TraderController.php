<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use Illuminate\Http\Request;

class TraderController extends Controller
{
    public function index(Request $request)
    {
        $query = Trader::with(['market', 'stall']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('permit_number', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json($query->paginate($request->input('per_page', 15)));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20|unique:traders,nik',
            'permit_number' => 'nullable|string|max:50',
            'status' => 'required|in:active,inactive,suspended,pending',
            'market_id' => 'nullable|string|exists:markets,id',
            'stall_id' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'type' => 'nullable|string|max:50',
            'scale' => 'nullable|string|max:50',
            'jenis_dagangan' => 'nullable|string|max:100',
            'tanggal_masuk' => 'nullable|date',
            'foto' => 'nullable|string',
        ]);

        $trader = Trader::create($validated);

        return response()->json([
            'message' => 'Trader created successfully',
            'data' => $trader
        ], 201);
    }

    public function show($id)
    {
        $trader = Trader::with(['market', 'stall', 'wallet', 'permits'])->findOrFail($id);
        return response()->json($trader);
    }

    public function update(Request $request, $id)
    {
        $trader = Trader::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'nik' => 'nullable|string|max:20|unique:traders,nik,' . $id,
            'permit_number' => 'nullable|string|max:50',
            'status' => 'sometimes|required|in:active,inactive,suspended,pending',
            'market_id' => 'nullable|string|exists:markets,id',
            'stall_id' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'type' => 'nullable|string|max:50',
            'scale' => 'nullable|string|max:50',
            'jenis_dagangan' => 'nullable|string|max:100',
            'tanggal_masuk' => 'nullable|date',
            'foto' => 'nullable|string',
        ]);

        $trader->update($validated);

        return response()->json([
            'message' => 'Trader updated successfully',
            'data' => $trader
        ]);
    }

    public function destroy($id)
    {
        $trader = Trader::findOrFail($id);
        $trader->delete();

        return response()->json(['message' => 'Trader deleted successfully']);
    }
}
