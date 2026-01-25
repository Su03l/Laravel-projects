<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => $this->faker->sentence(6),
            'content' => $this->faker->paragraphs(5, true),
            'image' => 'https://picsum.photos/seed/' . fake()->uuid() . '/800/600',
        ];
    }
}
