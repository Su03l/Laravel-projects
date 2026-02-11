<?php

namespace Database\Factories;

use App\Models\Chapter;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LessonFactory extends Factory
{
    public function definition(): array
    {
        $title = $this->faker->sentence(4);
        return [
            'chapter_id' => Chapter::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => $this->faker->paragraphs(2, true),
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'duration_minutes' => $this->faker->numberBetween(5, 45),
            'sort_order' => 1,
            'is_free_preview' => $this->faker->boolean(20),
        ];
    }
}
