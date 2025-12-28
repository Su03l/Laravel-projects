<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
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
        // 1. إنشاء 5 مشاريع
        $projects = Project::factory(5)->create();

        foreach ($projects as $project) {
            // لكل مشروع، أضف ملاحظتين
            $project->notes()->createMany([
                ['body' => 'ملاحظة عامة على المشروع'],
                ['body' => 'تذكير بموعد التسليم'],
            ]);

            // وأضف 3 مهام للمشروع
            $tasks = Task::factory(3)->create([
                'project_id' => $project->id
            ]);

            // لكل مهمة، أضف ملاحظة واحدة
            foreach ($tasks as $task) {
                $task->notes()->create([
                    'body' => 'ملاحظة مهمة جداً على التاسك'
                ]);
            }
        }
    }
}
