<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function run(): array
    {
        return [];
    }

    public function definition(): array
    {
        $types = ['income', 'expense'];
        $type = $this->faker->randomElement($types);

        $titles = [
            'income' => [
                'مبيعات خدمات برمجية',
                'استشارة تقنية',
                'أرباح إعلانات',
                'بيع منتجات رقمية',
                'دفعة مشروع تطوير',
                'اشتراك سنوي عميل',
                'عمولة تسويق بالعمولة',
            ],
            'expense' => [
                'فاتورة كهرباء المكتب',
                'اشتراك سيرفرات AWS',
                'رواتب موظفين',
                'أدوات مكتبية',
                'إعلانات فيسبوك',
                'تجديد دومين الموقع',
                'إيجار مقر الشركة',
                'صيانة أجهزة',
            ]
        ];

        $companies = [
            'شركة الحلول الرقمية',
            'مؤسسة التقنية الحديثة',
            'متجر الأمل التجاري',
            'شركة الاتصالات المتكاملة',
            'مكتب الاستشارات الهندسية',
            'شركة الخدمات اللوجستية',
            'مطعم الضيافة',
            'شركة النقل السريع'
        ];

        return [
            'user_id' => User::factory(),
            'title' => $this->faker->randomElement($titles[$type]),
            'amount' => $type === 'income'
                ? $this->faker->randomFloat(2, 500, 5000)
                : $this->faker->randomFloat(2, 50, 1500),
            'type' => $type,
            'company_name' => $this->faker->randomElement($companies),
            'date' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
        ];
    }
}
