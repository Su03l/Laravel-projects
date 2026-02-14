<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Workspace;
use App\Models\Project;
use App\Models\TaskColumn;
use App\Models\Task;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. المستخدم البطل
        $user = User::factory()->create([
            'name' => 'Dr. Orbit',
            'email' => 'admin@orbit.com',
        ]);

        // 2. Workspace
        $workspace = Workspace::create([
            'name' => 'Orbit Tech',
            'slug' => 'orbit-tech',
            'owner_id' => $user->id
        ]);

        // ربط المستخدم بالـ Workspace
        $workspace->members()->attach($user->id, ['role' => 'admin']);

        // 3. Project
        $project = Project::create([
            'workspace_id' => $workspace->id,
            'name' => 'SaaS Launch 🚀',
            'description' => 'Launching the new LMS system.',
            'bg_color' => 'bg-gradient-to-r from-blue-500 to-cyan-500'
        ]);

        // 4. Columns
        $columns = ['To Do', 'In Progress', 'Review', 'Done'];
        foreach ($columns as $index => $title) {
            $col = TaskColumn::create([
                'project_id' => $project->id,
                'name' => $title,
                'position' => $index
            ]);

            // 5. Tasks (3 tasks per column)
            for ($i = 1; $i <= 3; $i++) {
                Task::create([
                    'task_column_id' => $col->id,
                    'project_id' => $project->id,
                    'title' => "Task $i in $title",
                    'position' => $i,
                    'assigned_to' => $user->id
                ]);
            }
        }
    }
}
