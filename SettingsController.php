<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        return response()->json(Setting::all());
    }

    public function update(Request $request)
    {
        $settings = $request->all();
        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        return response()->json(['status' => 'success']);
    }

    public function getGroup($group)
    {
        return response()->json(Setting::where('group', $group)->get()->pluck('value', 'key'));
    }
}
