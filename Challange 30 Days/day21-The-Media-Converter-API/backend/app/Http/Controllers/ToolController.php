<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ToolController extends Controller
{
    public function humanTime()
    {
        Carbon::setLocale('ar');
        return response()->json([
            'future' => Carbon::now()->addDays(5)->diffForHumans(),
            'past' => Carbon::now()->subHours(3)->diffForHumans(),
            'today' => Carbon::now()->translatedFormat('l j F Y')
        ]);
    }

    public function qrCode(Request $request)
    {
        $text = $request->input('text', 'Laravel');
        $qr = QrCode::size(200)->generate($text);
        return response($qr)->header('Content-Type', 'image/svg+xml');
    }

    public function textFormat(Request $request)
    {
        $text = $request->input('text', 'laravel framework');
        return response()->json([
            'slug' => Str::slug($text),
            'upper' => Str::upper($text),
        ]);
    }

    public function cryptoPrice()
    {
        try {
            // محاولة الاتصال مع إلغاء التحقق من SSL (يحل مشاكل اللوكال)
            // وتحديد مهلة 3 ثواني فقط عشان ما يعلق
            $response = Http::withoutVerifying()->timeout(3)->get('https://api.coindesk.com/v1/bpi/currentprice.json');

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Failed to fetch');
        } catch (\Exception $e) {
            // في حال فشل الاتصال (وهذا اللي يصير معك)، نرجع داتا وهمية
            // عشان الفرونت إند يشتغل وما يوقف
            return response()->json([
                'bpi' => [
                    'USD' => [
                        'code' => 'USD',
                        'rate' => '42,000.00', // سعر وهمي
                        'description' => 'United States Dollar',
                        'rate_float' => 42000.00
                    ]
                ],
                'disclaimer' => 'This is MOCK data because API connection failed.',
                'time' => [
                    'updated' => Carbon::now()->toIso8601String()
                ]
            ]);
        }
    }

    public function generateUuid()
    {
        return response()->json([
            'uuid_1' => Str::uuid(),
            'uuid_2' => Str::uuid(),
            'uuid_3' => Str::uuid(),
        ]);
    }


    public function imageTest()
    {
        // إنشاء صورة جديدة (عرض 600، ارتفاع 200)
        $image = Image::create(600, 200)
            ->fill('#3498db'); // لون الخلفية أزرق

        // تحويلها لـ PNG
        $encoded = $image->toPng();

        // إرجاعها كصورة (ولليس JSON)
        return response($encoded)->header('Content-Type', 'image/png');
    }
}
