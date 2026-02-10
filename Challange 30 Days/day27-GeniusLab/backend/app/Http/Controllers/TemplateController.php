<?php

namespace App\Http\Controllers;

use App\Models\AiTemplate;
use Illuminate\Http\Request;
use App\Services\AiGenerationService;
use App\Traits\ApiResponse;

class TemplateController extends Controller
{
    use ApiResponse;

    public function __construct(protected AiGenerationService $aiService) {}

    // 1. عرض القوالب المتاحة
    public function index()
    {
        $templates = AiTemplate::where('is_active', true)->get();
        return $this->success($templates);
    }

    // 2. تنفيذ القالب (Generate from Template)
    public function generate(Request $request, $id)
    {
        $template = AiTemplate::findOrFail($id);

        // التحقق من المدخلات ديناميكياً بناءً على الحقول في القالب
        $request->validate([
            'inputs' => 'required|array',
            'model_slug' => 'required|exists:ai_models,api_slug'
        ]);

        // دمج البيانات داخل القالب (Replace Placeholders)
        $finalPrompt = $template->prompt_pattern;
        foreach ($request->inputs as $key => $value) {
            // تأكد من أن القيمة نصية لتجنب الأخطاء
            if (is_string($value)) {
                $finalPrompt = str_replace("{{$key}}", $value, $finalPrompt);
            }
        }

        // إرسال البرومبت الجاهز للمحرك (نفس دالة الشات)
        // ملاحظة: هنا نستخدم الستريم مباشرة، لذا لا نستخدم ApiResponse Trait
        return $this->aiService->generate(
            $request->user(),
            $finalPrompt,
            $request->model_slug
        );
    }
}
