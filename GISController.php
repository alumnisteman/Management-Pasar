<?php

namespace App\Http\Controllers;

use App\Models\Stall;
use Illuminate\Http\Request;

class GISController extends Controller
{
    public function getStalls()
    {
        $stalls = Stall::all();

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $stalls->map(function($stall){
                return [
                    'type' => 'Feature',
                    'geometry' => [
                        'type' => 'Point',
                        'coordinates' => [
                            (float) $stall->lng,
                            (float) $stall->lat
                        ]
                    ],
                    'properties' => [
                        'code' => $stall->code,
                        'status' => $stall->status
                    ]
                ];
            })
        ]);
    }
}
