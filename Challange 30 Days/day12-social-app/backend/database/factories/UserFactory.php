<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        $firstNames = [
            'أحمد',
            'محمد',
            'عبدالله',
            'سعود',
            'فهد',
            'خالد',
            'ناصر',
            'تركي',
            'فيصل',
            'عبدالعزيز',
            'راشد',
            'ماجد',
            'سلمان',
            'بدر',
            'طلال',
            'وليد',
            'حسام',
            'ياسر',
            'زياد',
            'ريان',
            'سيف',
            'مشعل',
            'نايف',
            'عمر',
            'علي',
            'حمزة',
            'أيمن',
            'أسامة'
        ];

        $lastNames = [
            'الشمري',
            'العتيبي',
            'القحطاني',
            'الدوسري',
            'الغامدي',
            'المطيري',
            'الزهراني',
            'المالكي',
            'الحربي',
            'العنزي',
            'السبيعي',
            'التميمي',
            'الجهني',
            'الشهري',
            'البقمي',
            'الرويلي',
            'البلوي',
            'الخالدي'
        ];

        $englishUsernames = [
            'ahmed',
            'mohammed',
            'abdullah',
            'saud',
            'fahad',
            'khaled',
            'nasser',
            'turki',
            'faisal',
            'aziz',
            'rashid',
            'majed',
            'salman',
            'bader',
            'talal',
            'waleed',
            'hussam',
            'yasser',
            'ziad',
            'ryan',
            'saif',
            'mishal',
            'naif',
            'omar',
            'ali',
            'hamza',
            'ayman',
            'osama'
        ];

        return [
            'name' => $this->faker->randomElement($firstNames) . ' ' . $this->faker->randomElement($lastNames),
            'username' => $this->faker->randomElement($englishUsernames) . '_' . $this->faker->unique()->numberBetween(100, 999),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password123'),
            'remember_token' => Str::random(10),
        ];
    }
}
