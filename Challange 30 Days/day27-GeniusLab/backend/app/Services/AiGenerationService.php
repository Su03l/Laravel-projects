<?php

namespace App\Services;

use App\Models\User;
use App\Models\AiModel;
use App\Models\Transaction;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Log;

class AiGenerationService
{
    public function generate(User $user, string $prompt, string $modelSlug, ?int $chatId = null, $image = null, $codeFile = null)
    {
        $model = AiModel::where('api_slug', $modelSlug)->where('is_active', true)->firstOrFail();

        // Handle Chat
        if ($chatId) {
            $chat = \App\Models\Chat::where('user_id', $user->id)->findOrFail($chatId);
        } else {
            $title = $codeFile ? 'Code Analysis' : substr($prompt, 0, 30) . '...';
            $chat = \App\Models\Chat::create([
                'user_id' => $user->id,
                'title' => $title,
            ]);
        }

        // Process Content
        $codeContent = "";
        $attachmentPath = null;
        $userMessageContent = $prompt;

        // Handle Image
        $base64Image = null;
        $mimeType = null;
        if ($image) {
            $path = $image->store('chat-images', 'public');
            $imageUrl = asset('storage/' . $path);
            $base64Image = base64_encode(file_get_contents($image->getRealPath()));
            $mimeType = $image->getMimeType();
            $userMessageContent .= "\n[Image Attached: $imageUrl]";
        }

        // Handle Code File
        if ($codeFile) {
            $path = $codeFile->store('code-uploads', 'public');
            $attachmentPath = asset('storage/' . $path);

            $fileContent = file_get_contents($codeFile->getRealPath());
            $fileName = $codeFile->getClientOriginalName();
            $fileExtension = $codeFile->getClientOriginalExtension();

            $codeContent = "\n\n--- BEGIN FILE: {$fileName} ---\n";
            $codeContent .= "```{$fileExtension}\n";
            $codeContent .= $fileContent;
            $codeContent .= "\n```\n--- END FILE ---\n";

            $userMessageContent .= "\n[File Attached: $attachmentPath]";
            $userMessageContent .= $codeContent;
        }

        // Save User Message
        $currentMessage = \App\Models\Message::create([
            'chat_id' => $chat->id,
            'role' => 'user',
            'content' => $userMessageContent,
        ]);

        // Build Payload
        $messagesPayload = [];

        // System Prompt
        $systemPrompt = $model->system_instruction ?? "You are a helpful AI assistant.";
        if ($codeFile) {
            $systemPrompt .= " The user has attached a code file. Analyze it carefully, check for bugs, security issues, and performance improvements.";
        }
        $messagesPayload[] = ['role' => 'system', 'content' => $systemPrompt];

        // History
        $history = $chat->messages()
            ->where('id', '!=', $currentMessage->id)
            ->latest()
            ->take(6)
            ->get()
            ->reverse();

        foreach ($history as $msg) {
            $messagesPayload[] = ['role' => $msg->role, 'content' => $msg->content];
        }

        // Current Message
        if ($image) {
            $messagesPayload[] = [
                'role' => 'user',
                'content' => [
                    ['type' => 'text', 'text' => $prompt . $codeContent],
                    ['type' => 'image_url', 'image_url' => ['url' => "data:$mimeType;base64,$base64Image"]]
                ]
            ];
        } else {
            $messagesPayload[] = ['role' => 'user', 'content' => $prompt . $codeContent];
        }

        // Stream Response
        return response()->stream(function () use ($chat, $model, $messagesPayload, $user) {

            try {
                $stream = OpenAI::chat()->createStreamed([
                    'model' => $model->api_slug,
                    'messages' => $messagesPayload,
                ]);

                $fullAiResponse = "";

                foreach ($stream as $response) {
                    $text = $response->choices[0]->delta->content;
                    if ($text) {
                        echo $text;
                        $fullAiResponse .= $text;
                        if (ob_get_level() > 0) ob_flush();
                        flush();
                    }
                }

                // Save AI Response
                \App\Models\Message::create([
                    'chat_id' => $chat->id, 'role' => 'assistant', 'content' => $fullAiResponse,
                ]);

                // Deduct Credits
                $user->decrement('wallet_balance', $model->cost_credits);
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'usage',
                    'credits' => -$model->cost_credits,
                    'description' => "Generated content with {$model->name}",
                ]);

            } catch (Exception $e) {
                // Log the error
                Log::error("AI Generation Error: " . $e->getMessage());
                // Send error to frontend
                echo "\n\n[SYSTEM ERROR]: " . $e->getMessage();
            }

        }, 200, [
            'Cache-Control' => 'no-cache',
            'Content-Type' => 'text/event-stream',
        ]);
    }
}
