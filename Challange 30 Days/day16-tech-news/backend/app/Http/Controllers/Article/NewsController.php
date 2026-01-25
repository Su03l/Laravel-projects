<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NewsController extends Controller
{
    public function index()
    {
        $apiKey = config('services.newsapi.key');

        if (!$apiKey) {
            return response()->json([
                'message' => 'API Key not configured'
            ], 500);
        }

        $response = Http::get("https://newsapi.org/v2/top-headlines", [
            'apiKey' => $apiKey,
            'category' => 'technology',
            'country' => 'us',
            'pageSize' => 10,
        ]);

        if ($response->successful()) {
            return response()->json($response->json());
        }

        return response()->json([
            'message' => 'فشل جلب الأخبار'
        ], 500);
    }
}
