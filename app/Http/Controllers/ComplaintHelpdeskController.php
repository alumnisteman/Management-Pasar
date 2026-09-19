<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ComplaintHelpdeskController extends Controller
{
    /**
     * Ambil daftar pengaduan dari tabel complaints, join dengan trader & slot.
     */
    public function index(Request $request)
    {
        $query = DB::table('complaints')
            ->leftJoin('traders', 'complaints.trader_id', '=', 'traders.id')
            ->leftJoin('slots', 'complaints.slot_id', '=', 'slots.id')
            ->select([
                'complaints.*',
                'traders.name as trader_name',
                'traders.phone as trader_phone',
                'slots.code as stall_code',
            ]);

        if ($request->has('status')) {
            $query->where('complaints.status', strtoupper($request->input('status')));
        }

        if ($request->has('priority')) {
            $query->where('complaints.priority', strtoupper($request->input('priority')));
        }

        if ($request->has('slot_id')) {
            $query->where('complaints.slot_id', $request->input('slot_id'));
        }

        $complaints = $query->orderBy('complaints.created_at', 'desc')->get();

        // Summary statistik
        $summary = [
            'total'       => DB::table('complaints')->count(),
            'open'        => DB::table('complaints')->whereIn('status', ['OPEN', 'open'])->count(),
            'in_progress' => DB::table('complaints')->whereIn('status', ['IN_PROGRESS', 'ASSIGNED', 'in_progress', 'assigned'])->count(),
            'resolved'    => DB::table('complaints')->whereIn('status', ['RESOLVED', 'CLOSED', 'resolved', 'closed'])->count(),
        ];

        return response()->json([
            'data'    => $complaints,
            'summary' => $summary,
        ]);
    }

    /**
     * Buat tiket pengaduan baru (dari pedagang atau petugas).
     * Otomatis terhubung ke tabel traders & slots.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category'      => 'required|string|max:100',
            'location'      => 'required|string|max:255',
            'priority'      => 'required|in:LOW,MEDIUM,HIGH,URGENT,low,medium,high,urgent',
            'reporter_name' => 'required|string|max:255',
            'description'   => 'required|string',
            'stall_code'    => 'nullable|string|max:50',
            'photo'         => 'nullable|string',
        ]);

        // Lookup slot_id dan trader_id dari stall_code jika ada
        $slotId   = null;
        $traderId = null;
        if (!empty($validated['stall_code'])) {
            $slot = DB::table('slots')->where('code', strtoupper($validated['stall_code']))->first();
            if ($slot) {
                $slotId = $slot->id;
                // Cari trader aktif di slot ini
                $assignment = DB::table('assignments')->where('slot_id', $slotId)->first();
                $traderId   = $assignment->trader_id ?? null;
            }
        }

        $ticketNo = 'TCK-' . date('Y') . '-' . str_pad(rand(1, 99999), 4, '0', STR_PAD_LEFT);
        $id       = (string) Str::uuid();

        DB::table('complaints')->insert([
            'id'               => $id,
            'ticket_number'    => $ticketNo,
            'trader_id'        => $traderId,
            'slot_id'          => $slotId,
            'category'         => $validated['category'],
            'location'         => $validated['location'],
            'priority'         => strtoupper($validated['priority']),
            'reporter_name'    => $validated['reporter_name'],
            'description'      => $validated['description'],
            'photo'            => $validated['photo'] ?? null,
            'status'           => 'OPEN',
            'assigned_to'      => null,
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);

        // Tulis ke audit_log
        if (Schema::hasTable('audit_logs')) {
            DB::table('audit_logs')->insert([
                'id'         => (string) Str::uuid(),
                'action'     => 'COMPLAINT_CREATED',
                'actor'      => $validated['reporter_name'],
                'details'    => json_encode(['ticket' => $ticketNo, 'priority' => $validated['priority'], 'location' => $validated['location']]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'message'       => 'Tiket pengaduan berhasil dibuat.',
            'ticket_number' => $ticketNo,
            'id'            => $id,
        ], 201);
    }

    /**
     * Update status tiket pengaduan + tulis audit log.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status'           => 'required|in:OPEN,ASSIGNED,IN_PROGRESS,RESOLVED,CLOSED',
            'assigned_to'      => 'nullable|string|max:255',
            'resolution_notes' => 'nullable|string',
        ]);

        $complaint = DB::table('complaints')->where('id', $id)->first();
        if (!$complaint) {
            return response()->json(['message' => 'Tiket tidak ditemukan.'], 404);
        }

        DB::table('complaints')->where('id', $id)->update([
            'status'           => $validated['status'],
            'assigned_to'      => $validated['assigned_to'] ?? $complaint->assigned_to,
            'resolution_notes' => $validated['resolution_notes'] ?? null,
            'updated_at'       => now(),
        ]);

        // Jika RESOLVED, update status lapak kembali ke occupied
        if ($validated['status'] === 'RESOLVED' && $complaint->slot_id) {
            DB::table('slots')->where('id', $complaint->slot_id)
                ->where('status', 'maintenance')
                ->update(['status' => 'occupied', 'updated_at' => now()]);
        }

        // Tulis audit log
        if (Schema::hasTable('audit_logs')) {
            DB::table('audit_logs')->insert([
                'id'         => (string) Str::uuid(),
                'action'     => 'COMPLAINT_STATUS_UPDATED',
                'actor'      => $validated['assigned_to'] ?? 'System',
                'details'    => json_encode(['ticket_id' => $id, 'new_status' => $validated['status'], 'resolution' => $validated['resolution_notes']]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => "Tiket pengaduan berhasil diperbarui ke status {$validated['status']}."]);
    }
}
