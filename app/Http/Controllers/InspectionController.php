<?php








namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class InspectionController extends Controller
{
    /**
     * Ambil daftar inspeksi dari tabel patrol_logs (atau inspections jika ada).
     */
    public function index(Request $request)
    {
        // Parse optional date filters (YYYY-MM-DD)
        $startDate = $request->query('start_date');
        $endDate   = $request->query('end_date');

        $dateFilter = function ($query) use ($startDate, $endDate) {
            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }
        };

        // Use inspections table if it exists
        if (Schema::hasTable('inspections')) {
            $query = DB::table('inspections');
            $dateFilter($query);
            $rows = $query->orderBy('created_at', 'desc')
                ->limit(100)
                ->get();
            return response()->json($rows);
        }

        // Fallback: patrol_logs with joins
        if (Schema::hasTable('patrol_logs')) {
            $query = DB::table('patrol_logs')
                ->leftJoin('slots', 'patrol_logs.slot_id', '=', 'slots.id')
                ->select([
                    'patrol_logs.id',
                    'slots.code as stall_code',
                    'patrol_logs.cleanliness_score',
                    'patrol_logs.security_status',
                    'patrol_logs.notes',
                    'patrol_logs.officer_id as inspector_id',
                    'patrol_logs.created_at',
                ]);
            $dateFilter($query);
            $rows = $query->orderBy('patrol_logs.created_at', 'desc')
                ->limit(100)
                ->get()
                ->map(fn($r) => [
                    'id'               => $r->id,
                    'stall_code'       => $r->stall_code ?? '-',
                    'cleanliness_status' => $r->cleanliness_score >= 4 ? 'GOOD' : ($r->cleanliness_score >= 3 ? 'FAIR' : 'POOR'),
                    'cleanliness_score'=> $r->cleanliness_score,
                    'security_status'  => strtoupper($r->security_status ?? 'SECURE'),
                    'notes'            => $r->notes ?? '',
                    'inspector_id'     => $r->inspector_id,
                    'created_at'       => $r->created_at,
                ]);
            return response()->json($rows);
        }

        return response()->json([]);
    }

    /**
     * Export inspeksi ke CSV dengan optional date filter.
     */
    public function exportCsv(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate   = $request->query('end_date');
        $dateFilter = function ($query) use ($startDate, $endDate) {
            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }
        };

        if (Schema::hasTable('inspections')) {
            $query = DB::table('inspections');
            $dateFilter($query);
            $data = $query->orderBy('created_at', 'desc')->get();
        } elseif (Schema::hasTable('patrol_logs')) {
            $query = DB::table('patrol_logs')
                ->leftJoin('slots', 'patrol_logs.slot_id', '=', 'slots.id')
                ->select([
                    'patrol_logs.id',
                    'slots.code as stall_code',
                    'patrol_logs.cleanliness_score',
                    'patrol_logs.security_status',
                    'patrol_logs.notes',
                    'patrol_logs.officer_id as inspector_id',
                    'patrol_logs.created_at',
                ]);
            $dateFilter($query);
            $data = $query->orderBy('patrol_logs.created_at', 'desc')->get();
        } else {
            $data = collect();
        }

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="inspections_' . now()->format('Ymd_His') . '.csv"',
        ];

        $callback = function () use ($data) {
            $handle = fopen('php://output', 'w');
            // Header row
            fputcsv($handle, [
                'ID', 'Stall Code', 'Cleanliness Score', 'Security Status', 'Notes', 'Inspector ID', 'Created At'
            ]);
            foreach ($data as $row) {
                fputcsv($handle, [
                    $row->id ?? $row['id'],
                    $row->stall_code ?? $row['stall_code'] ?? '-',
                    $row->cleanliness_score ?? $row['cleanliness_score'] ?? '',
                    $row->security_status ?? $row['security_status'] ?? '',
                    $row->notes ?? $row['notes'] ?? '',
                    $row->inspector_id ?? $row['inspector_id'] ?? '',
                    $row->created_at ?? $row['created_at'] ?? '',
                ]);
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Simpan hasil inspeksi lapangan ke database.
     * Juga otomatis memperbarui status lapak jika ditemukan pelanggaran.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'stall_code'        => 'required|string|max:50',
            'trader_name'       => 'nullable|string|max:255',
            'inspector_name'    => 'required|string|max:255',
            'cleanliness_status'=> 'required|in:GOOD,FAIR,POOR',
            'security_status'   => 'required|in:SECURE,WARNING,BREACH',
            'payment_verified'  => 'required|boolean',
            'notes'             => 'nullable|string',
            'photo'             => 'nullable|string',
        ]);

        $id = (string) Str::uuid();

        // Coba simpan ke tabel inspections jika ada
        if (Schema::hasTable('inspections')) {
            DB::table('inspections')->insert([
                'id'                => $id,
                'stall_code'        => $validated['stall_code'],
                'trader_name'       => $validated['trader_name'] ?? 'N/A',
                'inspector_name'    => $validated['inspector_name'],
                'cleanliness_status'=> $validated['cleanliness_status'],
                'security_status'   => $validated['security_status'],
                'payment_verified'  => $validated['payment_verified'],
                'notes'             => $validated['notes'] ?? '',
                'photo'             => $validated['photo'] ?? null,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }

        // Juga simpan ke patrol_logs (tabel real yang ada di DB)
        if (Schema::hasTable('patrol_logs') && Schema::hasColumn('patrol_logs', 'slot_id')) {
            $slot = DB::table('slots')->where('code', $validated['stall_code'])->first();
            if ($slot) {
                $cleanScore = ['GOOD' => 5, 'FAIR' => 3, 'POOR' => 1][$validated['cleanliness_status']] ?? 3;
                DB::table('patrol_logs')->insert([
                    'id'               => (string) Str::uuid(),
                    'slot_id'          => $slot->id,
                    'officer_id'       => (string) Str::uuid(), // akan diganti dengan user auth
                    'cleanliness_score'=> $cleanScore,
                    'security_status'  => strtolower($validated['security_status']),
                    'notes'            => $validated['notes'] ?? '',
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);

                // Jika BREACH, update status lapak ke maintenance
                if ($validated['security_status'] === 'BREACH') {
                    DB::table('slots')->where('id', $slot->id)->update([
                        'status'     => 'maintenance',
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Tulis audit log
        if (Schema::hasTable('audit_logs')) {
            DB::table('audit_logs')->insert([
                'id'         => (string) Str::uuid(),
                'action'     => 'INSPECTION_SUBMITTED',
                'actor'      => $validated['inspector_name'],
                'details'    => json_encode(['stall_code' => $validated['stall_code'], 'security' => $validated['security_status'], 'cleanliness' => $validated['cleanliness_status']]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Inspeksi berhasil disimpan.', 'id' => $id], 201);
    }
}
