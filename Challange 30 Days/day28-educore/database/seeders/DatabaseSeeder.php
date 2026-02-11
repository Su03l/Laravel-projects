<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Course;
use App\Models\Chapter;
use App\Models\Lesson;
use App\Models\Review;
use App\Models\Enrollment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin & Instructors
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@educore.io',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $instructors = User::factory(10)->create(['role' => 'instructor']);
        $students = User::factory(50)->create(['role' => 'student']);

        // 2. Create Categories
        $categories = Category::factory(8)->create();

        // 3. Create Courses
        $courses = Course::factory(250)->recycle($instructors)->recycle($categories)->create();

        // 4. Add Content to each course
        $courses->each(function ($course) use ($students) {
            // Create 3-5 chapters per course
            $chapters = Chapter::factory(rand(3, 5))->create([
                'course_id' => $course->id
            ]);

            $chapters->each(function ($chapter, $index) {
                // Create 3-6 lessons per chapter
                Lesson::factory(rand(3, 6))->create([
                    'chapter_id' => $chapter->id,
                    'sort_order' => $index + 1
                ]);
            });

            // 5. Random Enrollments (10-30 students per course)
            $enrolledStudents = $students->random(rand(10, 30));
            foreach ($enrolledStudents as $student) {
                $student->enroll($course, $course->price);

                // 6. Random Reviews
                if (rand(0, 1)) {
                    Review::create([
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                        'rating' => rand(3, 5),
                        'comment' => 'This is a great course, I learned a lot!',
                    ]);
                }
            }
        });
    }
}
