<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Http;

use Intervention\Image\Laravel\Facades\Image;

class ToolController extends Controller
{
    // --- 1. الوقت ---
    public function humanTime()
    {
        Carbon::setLocale('ar');
        return response()->json([
            'future' => Carbon::now()->addDays(5)->diffForHumans(),
            'past' => Carbon::now()->subHours(3)->diffForHumans(),
            'today' => Carbon::now()->translatedFormat('l j F Y')
        ]);
    }

    // --- 2. الباركود ---
    public function qrCode(Request $request)
    {
        $text = $request->input('text', 'Laravel is awesome');
        $qr = QrCode::size(200)->generate($text);
        return response($qr)->header('Content-Type', 'image/svg+xml');
    }

    // --- 3. النصوص ---
    public function textFormat(Request $request)
    {
        $text = $request->input('text', '  laravel framework  ');
        return response()->json([
            'original' => $text,
            'slug' => Str::slug($text),
            'upper' => Str::upper($text),
            'trim' => trim($text),
            'limit' => Str::limit($text, 5)
        ]);
    }

    // --- 4. العملات ---
    public function cryptoPrice()
    {
        $response = Http::get('https://api.coindesk.com/v1/bpi/currentprice.json');
        return $response->json();
    }

    // --- 5. UUID ---
    public function generateUuid()
    {
        return response()->json([
            'id_1' => Str::uuid(),
            'id_2' => Str::orderedUuid(),
            'random_string' => Str::random(40)
        ]);
    }

    public function imageTest()
    {
        $image = Image::create(600, 200) // العرض والارتفاع
        ->fill('#3498db'); // لون الخلفية (أزرق سماوي)

        // تحويل الصورة إلى صيغة PNG
        $encoded = $image->toPng();

        // إرجاع الصورة للمتصفح مباشرة
        return response($encoded)->header('Content-Type', 'image/png');
    }
}
