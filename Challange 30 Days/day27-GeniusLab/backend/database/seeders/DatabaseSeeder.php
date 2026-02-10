<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AiModel;
use App\Models\User;
use App\Models\CreditPackage;
use App\Models\AiTemplate;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (!User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        // The Golden Trio 🏆
        $models = [
            [
                'name' => 'DeepSeek V3 (Coder)',
                'api_slug' => 'deepseek/deepseek-chat',
                'type' => 'text',
                'cost_credits' => 1,
                'description' => 'The trending open-weight model. Exceptional at coding & logic.',
                'system_instruction' => 'You are an expert Senior Software Engineer.',
                'is_active' => true,
            ],
            [
                'name' => 'GPT-4o Mini',
                'api_slug' => 'openai/gpt-4o-mini',
                'type' => 'text',
                'cost_credits' => 5,
                'description' => 'Smart and cost-effective model from OpenAI.',
                'system_instruction' => 'You are a helpful AI assistant.',
                'is_active' => true,
            ],
            [
                'name' => 'Claude 3 Haiku',
                'api_slug' => 'anthropic/claude-3-haiku',
                'type' => 'text',
                'cost_credits' => 5,
                'description' => 'Fast and intelligent model from Anthropic.',
                'system_instruction' => 'You are a highly intelligent assistant.',
                'is_active' => true,
            ],
            [
                'name' => 'Flux 1 (Image)',
                'api_slug' => 'black-forest-labs/flux-1-schnell',
                'type' => 'image',
                'cost_credits' => 10,
                'description' => 'Generate high-quality images instantly.',
                'system_instruction' => 'Generate professional images.',
                'is_active' => true,
            ],
        ];

        // Deactivate old models first (Optional cleanup)
        AiModel::query()->update(['is_active' => false]);

        foreach ($models as $model) {
            AiModel::updateOrCreate(
                ['api_slug' => $model['api_slug']],
                $model
            );
        }

        if (CreditPackage::count() == 0) {
            CreditPackage::create(['name' => 'Starter Pack', 'credits' => 100, 'price' => 0]);
            CreditPackage::create(['name' => 'Pro Pack', 'credits' => 1000, 'price' => 0]);
        }

        // Templates
        AiTemplate::updateOrCreate(['name' => 'SEO Blog Writer'], [
            'icon' => 'pen-tool',
            'description' => 'Generate high-ranking blog articles instantly.',
            'prompt_pattern' => "Act as an SEO expert. Write a comprehensive blog post about '{topic}'. Target keywords: {keywords}. Tone: {tone}.",
            'fields' => [
                ['name' => 'topic', 'label' => 'Article Topic', 'type' => 'text', 'placeholder' => 'e.g., Digital Marketing'],
                ['name' => 'keywords', 'label' => 'Keywords', 'type' => 'text', 'placeholder' => 'e.g., SEO, Growth'],
                ['name' => 'tone', 'label' => 'Tone of Voice', 'type' => 'select', 'options' => ['Professional', 'Funny', 'Casual']]
            ]
        ]);
        // ... other templates
    }
}
