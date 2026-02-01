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
        $format = $request->input('format', 'svg');

        $qr = QrCode::size(200);

        if ($format === 'png') {
            $qr->format('png');
            $image = $qr->generate($text);
            return response($image)->header('Content-Type', 'image/png');
        }

        $image = $qr->generate($text);
        return response($image)->header('Content-Type', 'image/svg+xml');
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
            // استخدام CoinGecko كبديل أكثر موثوقية ومجاني
            // نطلب سعر البيتكوين مقابل الدولار، اليورو، والباوند
            $response = Http::timeout(5)->get('https://api.coingecko.com/api/v3/simple/price', [
                'ids' => 'bitcoin',
                'vs_currencies' => 'usd,gbp,eur'
            ]);

            if ($response->successful()) {
                $data = $response->json();

                // التأكد من وجود البيانات قبل القراءة
                if (!isset($data['bitcoin'])) {
                    throw new \Exception('Invalid data format');
                }

                $prices = $data['bitcoin'];

                // تحويل الهيكلية لتطابق ما يتوقعه الفرونت إند (BPI Format)
                return response()->json([
                    'bpi' => [
                        'USD' => [
                            'code' => 'USD',
                            'rate' => number_format($prices['usd'], 2),
                            'description' => 'United States Dollar',
                            'rate_float' => $prices['usd']
                        ],
                        'GBP' => [
                            'code' => 'GBP',
                            'rate' => number_format($prices['gbp'], 2),
                            'description' => 'British Pound Sterling',
                            'rate_float' => $prices['gbp']
                        ],
                        'EUR' => [
                            'code' => 'EUR',
                            'rate' => number_format($prices['eur'], 2),
                            'description' => 'Euro',
                            'rate_float' => $prices['eur']
                        ],
                    ],
                    'time' => [
                        'updated' => Carbon::now()->toIso8601String(),
                        'updatedISO' => Carbon::now()->toIso8601String(),
                    ],
                    'disclaimer' => 'Data provided by CoinGecko API'
                ]);
            }

            throw new \Exception('Failed to fetch from CoinGecko');
        } catch (\Exception $e) {
            // بيانات احتياطية (Mock) في حال فشل الاتصال
            // نستخدم أرقام واقعية تقريبية للبيتكوين
            return response()->json([
                'bpi' => [
                    'USD' => [
                        'code' => 'USD',
                        'rate' => '96,400.00',
                        'description' => 'United States Dollar',
                        'rate_float' => 96400.00
                    ],
                    'GBP' => [
                        'code' => 'GBP',
                        'rate' => '76,200.00',
                        'description' => 'British Pound Sterling',
                        'rate_float' => 76200.00
                    ],
                    'EUR' => [
                        'code' => 'EUR',
                        'rate' => '90,100.00',
                        'description' => 'Euro',
                        'rate_float' => 90100.00
                    ]
                ],
                'disclaimer' => 'Mock Data (API Unavailable)',
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
