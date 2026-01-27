<?php

namespace Database\Factories;

use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    protected $model = Job::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // قائمة وظائف تقنية واقعية
        $titles = [
            'مطور واجهات أمامية (React)', 'مطور باك إند (Laravel)',
            'مهندس برمجيات', 'مدير مشاريع تقنية',
            'مصمم تجربة مستخدم (UI/UX)', 'مهندس DevOps',
            'محلل بيانات', 'مطور تطبيقات جوال (Flutter)',
            'مهندس أمن سيبراني', 'مسؤول قواعد بيانات'
        ];

        $cities = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'الخبر', 'عن بعد', 'دبي'];

        return [
            'title' => $this->faker->randomElement($titles),
            'description' => "نبحث عن " . $this->faker->jobTitle() . " للانضمام لفريقنا. \n\n" . $this->faker->paragraph(5),
            'location' => $this->faker->randomElement($cities),
            'work_type' => $this->faker->randomElement(['full-time', 'part-time', 'contract', 'freelance']),
            'salary' => $this->faker->numberBetween(4000, 25000),
        ];
    }
}
