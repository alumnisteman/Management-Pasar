<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Models\Market;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $queryStr = $request->input('q', '');

        if (empty($queryStr)) {
            return response()->json(['query' => '', 'traders' => [], 'markets' => []]);
        }

        $traders = collect([]);
        if (\Illuminate\Support\Facades\Schema::hasTable('traders')) {
            $tQuery = Trader::query();
            $tQuery->where(function ($q) use ($queryStr) {
                if (\Illuminate\Support\Facades\Schema::hasColumn('traders', 'name')) {
                    $q->orWhere('name', 'like', "%{$queryStr}%");
                }
                if (\Illuminate\Support\Facades\Schema::hasColumn('traders', 'nik')) {
                    $q->orWhere('nik', 'like', "%{$queryStr}%");
                }
                if (\Illuminate\Support\Facades\Schema::hasColumn('traders', 'permit_number')) {
                    $q->orWhere('permit_number', 'like', "%{$queryStr}%");
                }
            });
            $traders = $tQuery->limit(10)->get();
        }

        $markets = collect([]);
        if (\Illuminate\Support\Facades\Schema::hasTable('markets')) {
            $mQuery = Market::query();
            $mQuery->where(function ($q) use ($queryStr) {
                if (\Illuminate\Support\Facades\Schema::hasColumn('markets', 'name')) {
                    $q->orWhere('name', 'like', "%{$queryStr}%");
                }
                if (\Illuminate\Support\Facades\Schema::hasColumn('markets', 'kode_pasar')) {
                    $q->orWhere('kode_pasar', 'like', "%{$queryStr}%");
                }
            });
            $markets = $mQuery->limit(10)->get();
        }

        return response()->json([
            'query' => $queryStr,
            'traders' => $traders,
            'markets' => $markets
        ]);
    }
}
