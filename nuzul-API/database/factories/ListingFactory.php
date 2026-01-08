<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Listing>
 */
class ListingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amenities = collect(['مسبح', 'واي فاي', 'مجلس خارجي', 'منطقة شواء', 'ألعاب أطفال'])
            ->random(rand(2, 5))
            ->values()
            ->toArray();

        return [
            'user_id' => User::factory(),
            'title' => fake()->randomElement(['شاليهات الفخامة', 'استراحة الروقان', 'منتجع النسيم', 'شاليه كلاسيك']),
            'description' => fake()->realText(100),
            'city' => fake()->randomElement(['الرياض', 'جدة', 'الطائف', 'الخبر']),
            'address' => fake()->streetAddress(),
            'price_per_night' => fake()->numberBetween(300, 1500),
            'capacity' => fake()->numberBetween(2, 20),
            'amenities' => $amenities,
            'image_url' => 'https://placehold.co/600x400/2c3e50/ffffff?text=Chalet',
        ];
    }
}
