<?php

namespace App\Http\Controllers;

use App\Models\Block;
use Illuminate\Http\Request;

class BlockController extends Controller
{
    public function index(Request $request)
    {
        if (!\Illuminate\Support\Facades\Schema::hasTable('blocks')) {
            return response()->json([]);
        }

        $query = \Illuminate\Support\Facades\Schema::hasTable('zones') ? Block::with(['zone']) : Block::query();

        if ($request->has('market_id') && \Illuminate\Support\Facades\Schema::hasColumn('blocks', 'market_id')) {
            $query->where('market_id', $request->input('market_id'));
        }

        if ($request->has('zona_id') && \Illuminate\Support\Facades\Schema::hasColumn('blocks', 'zona_id')) {
            $query->where('zona_id', $request->input('zona_id'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'market_id' => 'nullable|string|exists:markets,id',
            'zona_id' => 'nullable|string|exists:zones,id',
            'kode_blok' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'lantai' => 'nullable|string|default:1',
            'kapasitas' => 'nullable|integer|default:0',
        ]);

        $block = Block::create($validated);

        return response()->json([
            'message' => 'Block created successfully',
            'data' => $block
        ], 201);
    }

    public function show($id)
    {
        $block = Block::with(['zone', 'slots'])->findOrFail($id);
        return response()->json($block);
    }

    public function update(Request $request, $id)
    {
        $block = Block::findOrFail($id);

        $validated = $request->validate([
            'market_id' => 'nullable|string|exists:markets,id',
            'zona_id' => 'nullable|string|exists:zones,id',
            'kode_blok' => 'nullable|string|max:50',
            'name' => 'sometimes|required|string|max:255',
            'lantai' => 'nullable|string',
            'kapasitas' => 'nullable|integer',
        ]);

        $block->update($validated);

        return response()->json([
            'message' => 'Block updated successfully',
            'data' => $block
        ]);
    }

    public function destroy($id)
    {
        $block = Block::findOrFail($id);
        $block->delete();

        return response()->json(['message' => 'Block deleted successfully']);
    }
}
