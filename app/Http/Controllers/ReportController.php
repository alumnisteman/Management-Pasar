<?php

namespace App\Http\Controllers;

use App\Models\Slot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ReportController extends Controller
{
    /**
     * Return JSON summary for Pelataran slots.
     */
    public function pelataranReport()
    {
        $total    = Slot::where('category', 'pelataran')->count();
        $occupied = Slot::where('category', 'pelataran')
                        ->where('status', 'occupied')
                        ->count();
        $empty    = $total - $occupied;
        $revenue  = Slot::where('category', 'pelataran')
                        ->where('status', 'occupied')
                        ->sum('price');

        return response()->json([
            'total_slots'   => $total,
            'occupied'      => $occupied,
            'empty'         => $empty,
            'total_revenue' => $revenue,
        ]);
    }

    /**
     * Export Pelataran report as CSV file.
     */
    public function exportPelataranCsv()
    {
        $headers = [
            'Content-Type'        => 'text/csv',
            'Cache-Control'       => 'no-cache, no-store, must-revalidate',
            'Pragma'              => 'no-cache',
            'Expires'             => '0',
        ];

        $callback = function () {
            $handle = fopen('php://output', 'w');
            // Header row
            fputcsv($handle, ['Kode Lapak', 'Status', 'Harga', 'Zona', 'Blok', 'Pemilik', 'Pedagang']);

            $slots = Slot::where('category', 'pelataran')
                         ->with(['zone', 'block', 'owner_name', 'trader'])
                         ->get();
            foreach ($slots as $slot) {
                fputcsv($handle, [
                    $slot->kode_lapak,
                    $slot->status,
                    $slot->price,
                    $slot->zone ? $slot->zone->name : '',
                    $slot->block ? $slot->block->name : '',
                    $slot->owner_name ?? '',
                    $slot->trader ? $slot->trader->name : '',
                ]);
            }
            fclose($handle);
        };

        return Response::stream($callback, 200, $headers)
                       ->header('Content-Disposition', 'attachment; filename="pelataran_report.csv"');
    }
}
