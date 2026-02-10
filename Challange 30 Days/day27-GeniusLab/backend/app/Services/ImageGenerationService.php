<?php

namespace App\Services;

use App\Models\User;
use App\Models\AiModel;
use App\Models\Chat;
use App\Models\Message;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageGenerationService
{
    public function generate(User $user, string $prompt, string $modelSlug, ?int $chatId = null)
    {
        $model = AiModel::where('api_slug', $modelSlug)->where('type', 'image')->firstOrFail();

        // 1. إدارة الشات (نفس المنطق السابق)
        if ($chatId) {
            $chat = Chat::where('user_id', $user->id)->findOrFail($chatId);
        } else {
            $chat = Chat::create(['user_id' => $user->id, 'title' => 'Image: ' . substr($prompt, 0, 20)]);
        }

        // حفظ طلب المستخدم
        Message::create(['chat_id' => $chat->id, 'role' => 'user', 'content' => $prompt]);

        // 2. الاتصال بـ API لتوليد الصورة 🖼️
        // ملاحظة: هذا الطلب قد يستغرق 5-10 ثواني
        $response = OpenAI::images()->create([
            'model' => $model->api_slug,
            'prompt' => $prompt,
            'n' => 1, // صورة واحدة
            'size' => '1024x1024',
            'response_format' => 'url', // يرجع رابط
        ]);

        $imageUrl = $response->data[0]->url;

        // 3. (مهم جداً) تحميل الصورة إلى سيرفرنا 💾
        // روابط DALL-E مؤقتة وتنتهي بعد ساعة، لازم نحفظها عندنا
        $imageContent = file_get_contents($imageUrl);
        $filename = 'generated-images/' . Str::random(40) . '.png';
        Storage::disk('public')->put($filename, $imageContent);

        $localUrl = Storage::url($filename); // الرابط الدائم على سيرفرنا

        // 4. حفظ الرد في الرسائل (نحفظ الرابط)
        $aiMessage = Message::create([
            'chat_id' => $chat->id,
            'role' => 'assistant',
            'content' => $localUrl, // المحتوى هنا هو رابط الصورة
            // يفضل إضافة عمود 'type' لجدول الرسائل مستقبلاً لتمييز النص عن الصورة
        ]);

        return [
            'chat_id' => $chat->id,
            'image_url' => $localUrl,
            'message_id' => $aiMessage->id
        ];
    }
}
