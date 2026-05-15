<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProxyController extends Controller
{
    public function proxy(Request $request, $path = '')
    {
        $targetUrl = 'http://dashboard/' . $path;
        
        $response = Http::withHeaders($request->header())
            ->send($request->method(), $targetUrl, [
                'query' => $request->query(),
                'body' => $request->getContent(),
            ]);

        return response($response->body(), $response->status())
            ->withHeaders($response->headers());
    }
}
