<?php

namespace App\Http\Controllers;

use App\Models\PriceLog;
use Illuminate\Http\Request;

class PriceLogController extends Controller
{
    /**
     * List all price logs with optional filters.
     */
    public function index(Request $request)
    {
        $query = PriceLog::query();
        if ($request->has('slot_id')) {
            $query->where('slot_id', $request->input('slot_id'));
        }
        if ($request->has('date')) {
            $query->whereDate('recorded_at', $request->input('date'));
        }
        $logs = $query->orderByDesc('recorded_at')->paginate(20);
        return response()->json($logs);
    }

    /**
     * Show a single price log entry.
     */
    public function show($id)
    {
        $log = PriceLog::findOrFail($id);
        return response()->json($log);
    }
}
?>
