<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{

    public function run(): void
    {
        $categories = [
            ['name' => 'الدعم التقني', 'slug' => 'tech-support'],
            ['name' => 'المبيعات والفواتير', 'slug' => 'billing'],
            ['name' => 'استفسارات عامة', 'slug' => 'general'],
            ['name' => 'الإبلاغ عن خطأ', 'slug' => 'bug-report'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
