<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Job;
use App\Models\Tag;
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
        $techTags = [
            'Laravel', 'PHP', 'React', 'Vue', 'JavaScript',
            'Python', 'Java', 'Docker', 'AWS', 'SQL',
            'Git', 'DevOps', 'Agile', 'English'
        ];

        $tags = collect();
        foreach ($techTags as $tagName) {
            $tags->push(Tag::create(['name' => $tagName]));
        }

        $this->command->info('Tags Created!');

        // 1. إنشاء 20 شركة (بدلاً من 50 لتوفير الذاكرة)
        $companies = User::factory()
            ->company()
            ->count(20)
            ->create();

        $this->command->info('20 Companies Created!');

        // 2. كل شركة تنشر وظائف
        $jobs = collect();
        foreach ($companies as $company) {
            $companyJobs = Job::factory()
                ->count(rand(2, 4))
                ->create(['user_id' => $company->id]);

            foreach ($companyJobs as $job) {
                $job->tags()->attach($tags->random(rand(2, 4))->pluck('id'));
                $jobs->push($job);
            }
        }

        $this->command->info('Jobs Posted & Tagged!');

        // 3. إنشاء 100 باحث عن عمل (بدلاً من 450)
        $seekers = User::factory()
            ->count(100)
            ->create(['type' => 'seeker']);

        $this->command->info('100 Seekers Created!');

        // 4. محاكاة التقديم على الوظائف
        foreach ($seekers as $seeker) {
            $randomJobs = $jobs->random(rand(1, 2));

            foreach ($randomJobs as $job) {
                Application::create([
                    'user_id' => $seeker->id,
                    'job_id' => $job->id,
                    'cover_letter' => 'مرحباً، أنا مهتم جداً بهذه الوظيفة ولدي الخبرة المطلوبة.',
                    'status' => 'pending'
                ]);
            }
        }

        $this->command->info('Applications Submitted! Setup Complete.');
    }
}
