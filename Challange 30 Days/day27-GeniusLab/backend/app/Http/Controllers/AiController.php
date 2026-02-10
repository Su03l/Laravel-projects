<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Ai\GenerateRequest;
use App\Services\AiGenerationService;
use App\Services\ImageGenerationService;
use App\Services\AudioService;
use App\Models\AiModel;
use App\Traits\ApiResponse;

class AiController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AiGenerationService $textService,
        protected ImageGenerationService $imageService,
        protected AudioService $audioService
    ) {}

    // 1. Text, Vision & Code Generation (Streamed)
    public function generate(GenerateRequest $request)
    {
        // ملاحظة: الـ Stream لا يستخدم ApiResponse Trait لأنه نوع خاص من الردود
        return $this->textService->generate(
            $request->user(),
            $request->prompt,
            $request->model_slug,
            $request->chat_id,
            $request->file('image'),
            $request->file('code_file') 
        );
    }

    // 2. Image Generation
    public function generateImage(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string',
            'model_slug' => 'required|exists:ai_models,api_slug',
            'chat_id' => 'nullable|exists:chats,id'
        ]);

        $result = $this->imageService->generate(
            $request->user(),
            $request->prompt,
            $request->model_slug,
            $request->chat_id
        );

        return $this->success($result, 'Image generated successfully');
    }

    // 3. Audio Generation
    public function generateAudio(Request $request)
    {
        $request->validate(['text' => 'required|string|max:4096']);

        $audioUrl = $this->audioService->textToSpeech($request->text);

        return $this->success(['audio_url' => $audioUrl], 'Audio generated successfully');
    }

    // 4. List Models
    public function models()
    {
        $models = AiModel::where('is_active', true)->get();
        return $this->success($models);
    }
}
