<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@app.com',
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Regular Employee',
            'email' => 'user@app.com',
            'role' => 'user',
            'password' => bcrypt('password'),
        ]);

        \App\Models\User::factory(10)
            ->has(\App\Models\Task::factory()->count(5))
            ->create();
    }
}
