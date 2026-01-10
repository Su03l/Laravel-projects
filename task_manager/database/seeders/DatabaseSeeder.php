<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $myUser = User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'username' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
        ]);

        Project::factory(3)->create(['user_id' => $myUser->id])
            ->each(function ($project) {
                Task::factory(5)->create(['project_id' => $project->id]);
            });

        User::factory(10)->create()->each(function ($user) {
            Project::factory(2)->create(['user_id' => $user->id])
                ->each(function ($project) {
                    Task::factory(3)->create(['project_id' => $project->id]);
                });
        });
    }
}
