<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::query();
        
        // Simple search
        if ($request->has('q')) {
            $query->where('title', 'like', '%' . $request->q . '%');
        }
        
        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        // Paginate for infinite scroll
        $news = $query->orderBy('published_at', 'desc')->paginate(15);
        
        return response()->json($news);
    }
}
