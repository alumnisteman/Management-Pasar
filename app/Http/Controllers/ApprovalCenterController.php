<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ApprovalCenterController extends Controller
{
    /**
     * Ambil daftar approval dari tabel approvals (atau permits pending).
     * Menggunakan tabel 'permits' sebagai sumber persetujuan SIPTU jika 'approvals' tidak ada.
     */
    public function index(Request $request)
    {
        $status = $request->input('status', 'PENDING');

        // Gunakan tabel approvals jika ada
        if (Schema::hasTable('approvals')) {
            $approvals = DB::table('approvals')
                ->where('status', $status)
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json($approvals);
        }

        // Fallback: gunakan permits yang statusnya 'pending' sebagai approval request
        $pendingPermits = DB::table('permits')
            ->join('traders', 'permits.trader_id', '=', 'traders.id')
            ->join('slots', 'permits.slot_id', '=', 'slots.id')
            ->where('permits.status', 'pending')
            ->orderBy('permits.created_at', 'desc')
            ->select([
                'permits.id',
                DB::raw("'SIPTU_APPROVAL' as type"),
                'traders.name as requested_by',
                DB::raw("JSON_OBJECT('slot', slots.code, 'permit', permits.permit_number) as details"),
                DB::raw("'PENDING' as status"),
                'permits.created_at',
            ])
            ->get();

        return response()->json($pendingPermits);
    }

    /**
     * Buat approval request baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type'         => 'required|string|max:100',
            'requested_by' => 'required|string|max:255',
            'details'      => 'required|array',
        ]);

        if (!Schema::hasTable('approvals')) {
            return response()->json(['message' => 'Tabel approvals belum tersedia. Jalankan migrasi terlebih dahulu.'], 503);
        }

        $id = (string) \Illuminate\Support\Str::uuid();
        DB::table('approvals')->insert([
            'id'           => $id,
            'type'         => $validated['type'],
            'requested_by' => $validated['requested_by'],
            'details'      => json_encode($validated['details']),
            'status'       => 'PENDING',
            'approved_by'  => null,
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        // Tulis ke audit_log
        $this->writeAuditLog('APPROVAL_CREATED', $validated['requested_by'], [
            'type'    => $validated['type'],
            'details' => $validated['details'],
        ]);

        return response()->json(['message' => 'Approval request berhasil dibuat.', 'id' => $id], 201);
    }

    /**
     * Proses approval (APPROVE / REJECT).
     */
    public function process(Request $request, $id)
    {
        $validated = $request->validate([
            'action'       => 'required|in:APPROVE,REJECT',
            'processed_by' => 'required|string|max:255',
            'notes'        => 'nullable|string',
        ]);

        $newStatus = $validated['action'] === 'APPROVE' ? 'APPROVED' : 'REJECTED';

        if (Schema::hasTable('approvals')) {
            $approval = DB::table('approvals')->where('id', $id)->first();
            if (!$approval) {
                return response()->json(['message' => 'Approval tidak ditemukan.'], 404);
            }

            DB::table('approvals')->where('id', $id)->update([
                'status'      => $newStatus,
                'approved_by' => $validated['processed_by'],
                'notes'       => $validated['notes'] ?? null,
                'updated_at'  => now(),
            ]);

            // Jika approval terkait SIPTU, update status permit
            if ($approval && str_contains($approval->type, 'SIPTU')) {
                $details = json_decode($approval->details, true);
                if (!empty($details['permit_id'])) {
                    DB::table('permits')->where('id', $details['permit_id'])->update([
                        'status'     => $newStatus === 'APPROVED' ? 'active' : 'rejected',
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Fallback: update permit langsung jika tidak ada tabel approvals
        if (!Schema::hasTable('approvals')) {
            DB::table('permits')->where('id', $id)->update([
                'status'     => $newStatus === 'APPROVED' ? 'active' : 'rejected',
                'updated_at' => now(),
            ]);
        }

        $this->writeAuditLog("APPROVAL_{$newStatus}", $validated['processed_by'], [
            'approval_id' => $id,
            'notes'       => $validated['notes'],
        ]);

        return response()->json(['message' => "Approval request berhasil {$newStatus}."]);
    }

    /**
     * Tulis log ke tabel audit_logs.
     */
    private function writeAuditLog(string $action, string $actor, array $details = [])
    {
        if (!Schema::hasTable('audit_logs')) return;

        DB::table('audit_logs')->insert([
            'id'         => (string) \Illuminate\Support\Str::uuid(),
            'action'     => $action,
            'actor'      => $actor,
            'details'    => json_encode($details),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
