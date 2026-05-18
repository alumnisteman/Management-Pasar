<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trader;
use App\Models\Stall;
use App\Models\Slot;

class SearchController extends Controller
{
    /**
     * Search resources using Laravel Scout.
     */
    public function search(Request $request)
    {
        $query = $request->input('query');
        $type = $request->input('type', 'all');
        $limit = $request->input('limit', 15);

        if (empty($query)) {
            return response()->json([
                'success' => true,
                'results' => []
            ]);
        }

        $results = [];

        if ($type === 'traders' || $type === 'all') {
            $results['traders'] = Trader::search($query)->take($limit)->get();
        }

        if ($type === 'stalls' || $type === 'all') {
            $results['stalls'] = Stall::search($query)->take($limit)->get();
        }

        if ($type === 'slots' || $type === 'all') {
            $results['slots'] = Slot::search($query)->take($limit)->get();
        }

        return response()->json([
            'success' => true,
            'query' => $query,
            'type' => $type,
            'results' => $results
        ]);
    }
}
