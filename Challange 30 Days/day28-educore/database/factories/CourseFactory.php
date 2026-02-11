<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CourseFactory extends Factory
{
    public function definition(): array
    {
        $title = $this->faker->sentence(4);
        return [
            'teacher_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(5),
            'description' => $this->faker->paragraphs(3, true),
            'price' => $this->faker->randomElement([0, 19.99, 49.99, 99.99, 149.99]),
            'thumbnail' => 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800',
            'is_published' => true,
            'average_rating' => $this->faker->randomFloat(2, 3, 5),
            'reviews_count' => $this->faker->numberBetween(10, 500),
        ];
    }
}
