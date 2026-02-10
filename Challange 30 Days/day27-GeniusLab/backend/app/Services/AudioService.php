<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AudioService
{
    public function textToSpeech(string $text, string $voice = 'alloy')
    {
        // 1. الاتصال بـ API الصوت
        $response = OpenAI::audio()->speech([
            'model' => 'tts-1',
            'input' => $text,
            'voice' => $voice, // أصوات مختلفة: alloy, echo, fable, onyx, nova, shimmer
        ]);

        // 2. حفظ ملف الصوت MP3 محلياً 💾
        $filename = 'audio-generations/' . Str::random(40) . '.mp3';
        Storage::disk('public')->put($filename, $response);

        return Storage::url($filename); // إرجاع الرابط الدائم
    }
}
