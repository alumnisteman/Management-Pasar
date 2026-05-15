<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use Illuminate\Http\Request;

class TraderController extends Controller
{
    public function index() { return Trader::all(); }

    public function store(Request $request)
    {
        return Trader::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $trader = Trader::findOrFail($id);
        $trader->update($request->all());
        return $trader;
    }

    public function destroy($id)
    {
        Trader::destroy($id);
        return response()->json(['success' => true]);
    }
}
