<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class AnnouncementController extends Controller
{
    public function index()
    {
        if (!Schema::hasTable('announcements')) {
            return response()->json([]);
        }

        $announcements = DB::table('announcements')
            ->orderBy('created_at', 'desc')
            ->limit(30)
            ->get();

        return response()->json($announcements);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_market_id' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'priority' => 'nullable|string|in:LOW,NORMAL,HIGH,URGENT',
        ]);

        $id = (string) Str::uuid();

        if (Schema::hasTable('announcements')) {
            DB::table('announcements')->insert([
                'id' => $id,
                'title' => $validated['title'],
                'content' => $validated['content'],
                'target_market_id' => $validated['target_market_id'] ?? null,
                'category' => $validated['category'] ?? 'GENERAL',
                'priority' => $validated['priority'] ?? 'NORMAL',
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Announcement published successfully', 'id' => $id], 201);
    }

    public function destroy($id)
    {
        if (Schema::hasTable('announcements')) {
            DB::table('announcements')->where('id', $id)->delete();
        }

        return response()->json(['message' => 'Announcement deleted']);
    }
}
