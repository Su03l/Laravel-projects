<?php

namespace App\Http\Controllers;

use App\Models\CitySearch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherController extends Controller
{
    public function show($city)
    {
        $cleanCity = strtolower(trim($city));

        $stats = CitySearch::firstOrCreate(
            ['name' => $cleanCity],
            ['count' => 0]
        );
        $stats->increment('count');

        $weatherData = Cache::remember("weather_{$cleanCity}", 3600, function () use ($cleanCity) {

            $apiKey = config('services.openweather.key');

            if (!$apiKey) {
                throw new \Exception('Weather API Key is missing in config');
            }

            $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
                'q' => $cleanCity,
                'appid' => $apiKey,
                'units' => 'metric',
                'lang' => 'ar'
            ]);

            if ($response->failed()) {
                return null;
            }

            return $response->json();
        });

        if (!$weatherData) {
            return response()->json(['error' => 'City not found or API error'], 404);
        }

        return response()->json([
            'city' => $weatherData['name'],
            'search_stats' => [
                'total_searches' => $stats->count,
                'is_trending' => $stats->count > 10
            ],
            'weather' => [
                'temp' => round($weatherData['main']['temp']) . '°C',
                'description' => $weatherData['weather'][0]['description'],
                'humidity' => $weatherData['main']['humidity'] . '%',
                'wind_speed' => $weatherData['wind']['speed'] . ' m/s',
                'icon' => "https://openweathermap.org/img/wn/{$weatherData['weather'][0]['icon']}@4x.png",
            ],
            'cached' => Cache::has("weather_{$cleanCity}")
        ]);
    }

    public function topCities()
    {
        return response()->json(
            CitySearch::orderByDesc('count')->take(5)->get()
        );
    }
}
