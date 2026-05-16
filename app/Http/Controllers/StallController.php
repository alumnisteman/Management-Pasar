<?php

namespace App\Http\Controllers;

use App\Models\Slot;
use App\Services\AuditLogger;
use Illuminate\Http\Request;

class StallController extends Controller
{
    /**
     * Display a listing of stalls.
     */
    public function index()
    {
        return response()->json(Slot::orderBy('code', 'asc')->paginate(30));
    }

    /**
     * Display the specified stall.
     */
    public function show($id)
    {
        return response()->json(Slot::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $slot = Slot::findOrFail($id);
        
        $data = $request->validate([
            'code' => 'string|max:50',
            'category' => 'string|in:basah,kering,kuliner,umum'
        ]);

        $slot->update($data);

        AuditLogger::log('UPDATE_SLOT', [
            'slot_id' => $id,
            'changes' => $data
        ]);

        return response()->json($slot);
    }

    public function store(Request $request)
    {
        \Log::info('Store Slot Request All:', $request->all());
        \Log::info('Store Slot Request Raw:', ['content' => $request->getContent()]);
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:slots,code',
            'category' => 'required|string|in:gold,silver,bronze,basah,kering,kuliner,umum',
            'price' => 'nullable|numeric'
        ]);

        $slot = Slot::create([
            'code' => $data['code'],
            'category' => $data['category'],
            'price' => $data['price'] ?? 15000,
            'status' => 'active'
        ]);

        AuditLogger::log('CREATE_SLOT', [
            'slot_id' => $slot->id,
            'code' => $slot->code
        ]);

        return response()->json($slot, 201);
    }
}
