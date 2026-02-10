<?php

namespace App\Http\Requests\Ai;

use Illuminate\Foundation\Http\FormRequest;

class GenerateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'prompt' => 'required|string',
            'model_slug' => 'required|exists:ai_models,api_slug',
            'chat_id' => 'nullable|exists:chats,id',
            'image' => 'nullable|image|max:5120', // 5MB Max
            // نسمح بملفات الكود (حجم أقصى 2MB مثلاً للملفات النصية كافي جداً)
            'code_file' => 'nullable|file|mimes:php,js,py,html,css,json,sql,java,cpp,txt,ts,tsx,jsx,vue,blade.php|max:2048',
        ];
    }
}
