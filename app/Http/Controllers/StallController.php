<?php

namespace App\Http\Controllers;

use App\Models\Stall;
use Illuminate\Http\Request;

class StallController extends Controller
{
    public function index(Request $request)
    {
        $query = Stall::with(['market', 'block']);

        if ($request->has('market_id')) {
            $query->where('market_id', $request->input('market_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json($query->paginate($request->input('per_page', 20)));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'market_id' => 'nullable|string|exists:markets,id',
            'block_id' => 'nullable|string|exists:blocks,id',
            'code' => 'required|string|max:50',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'status' => 'required|in:active,occupied,vacant,maintenance',
        ]);

        $stall = Stall::create($validated);

        return response()->json([
            'message' => 'Stall created successfully',
            'data' => $stall
        ], 201);
    }

    public function show($id)
    {
        $stall = Stall::with(['market', 'block', 'traders'])->findOrFail($id);
        return response()->json($stall);
    }

    public function update(Request $request, $id)
    {
        $stall = Stall::findOrFail($id);

        $validated = $request->validate([
            'market_id' => 'nullable|string|exists:markets,id',
            'block_id' => 'nullable|string|exists:blocks,id',
            'code' => 'sometimes|required|string|max:50',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'status' => 'sometimes|required|in:active,occupied,vacant,maintenance',
        ]);

        $stall->update($validated);

        return response()->json([
            'message' => 'Stall updated successfully',
            'data' => $stall
        ]);
    }

    public function destroy($id)
    {
        $stall = Stall::findOrFail($id);
        $stall->delete();

        return response()->json(['message' => 'Stall deleted successfully']);
    }
}
