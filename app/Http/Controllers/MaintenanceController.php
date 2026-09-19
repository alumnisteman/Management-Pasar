<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceTicket;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MaintenanceController extends Controller
{
    // List all tickets
    public function index()
    {
        return response()->json(MaintenanceTicket::with('workOrders')->orderByDesc('created_at')->get());
    }

    // Create a new ticket (e.g., from inspection listener)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date'    => 'nullable|date',
        ]);

        $ticket = MaintenanceTicket::create([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date'    => $validated['due_date'] ?? null,
        ]);

        return response()->json($ticket, 201);
    }

    // Show single ticket with work orders
    public function show(string $id)
    {
        $ticket = MaintenanceTicket::with('workOrders')->findOrFail($id);
        return response()->json($ticket);
    }

    // Update ticket status or assignment
    public function update(Request $request, string $id)
    {
        $ticket = MaintenanceTicket::findOrFail($id);
        $validated = $request->validate([
            'status'               => 'sometimes|in:OPEN,IN_PROGRESS,RESOLVED,CLOSED',
            'assigned_technician_id'=> 'sometimes|nullable|uuid',
            'due_date'             => 'sometimes|nullable|date',
        ]);
        $ticket->update($validated);
        return response()->json($ticket);
    }

    // Delete ticket
    public function destroy(string $id)
    {
        MaintenanceTicket::destroy($id);
        return response()->json(null, 204);
    }
}
?>
