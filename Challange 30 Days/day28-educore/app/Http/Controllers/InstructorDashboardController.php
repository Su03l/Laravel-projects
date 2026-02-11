<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Chapter;
use App\Models\Lesson;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InstructorDashboardController extends Controller
{
    // this for display instructor dashboard
    public function index(Request $request)
    {
        $user = $request->user();

        $courses = Course::where('teacher_id', $user->id)
            ->withCount('students')
            ->latest()
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'students' => $course->students_count,
                    'revenue' => number_format($course->students_count * $course->price, 2) . ' ر.س',
                    'status' => $course->is_published ? 'منشور' : 'مسودة',
                ];
            });

        $totalStudents = Enrollment::whereHas('course', function($q) use ($user) {
            $q->where('teacher_id', $user->id);
        })->count();

        $totalRevenue = Enrollment::whereHas('course', function($q) use ($user) {
            $q->where('teacher_id', $user->id);
        })->sum('paid_amount');

        return Inertia::render('Instructor/Dashboard', [
            'courses' => $courses,
            'stats' => [
                'totalStudents' => number_format($totalStudents),
                'totalCourses' => $courses->count(),
                'totalRevenue' => number_format($totalRevenue, 2) . ' ر.س',
                'avgRating' => '4.9',
            ]
        ]);
    }

    // this for store new course
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
        ]);

        $course = Course::create([
            'teacher_id' => $request->user()->id,
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(5),
            'description' => $validated['description'],
            'price' => $validated['price'],
            'is_published' => false,
        ]);

        return redirect()->route('instructor.courses.builder', $course->id)
            ->with('success', 'تم إنشاء الدورة بنجاح!');
    }

    // this for display course builder
    public function builder(Course $course)
    {
        $this->authorizeInstructor($course);

        return Inertia::render('Instructor/CourseBuilder', [
            'course' => $course->load('chapters.lessons'),
        ]);
    }

    // this for publish course
    public function publish(Course $course)
    {
        $this->authorizeInstructor($course);
        $course->update(['is_published' => !$course->is_published]);

        return back()->with('success', $course->is_published ? 'تم نشر الدورة بنجاح!' : 'تم تحويل الدورة إلى مسودة.');
    }

    // this for store new chapter
    public function storeChapter(Request $request, Course $course)
    {
        $this->authorizeInstructor($course);
        $request->validate(['title' => 'required|string|max:255']);

        $course->chapters()->create([
            'title' => $request->title,
            'sort_order' => $course->chapters()->count() + 1
        ]);

        return back()->with('success', 'تم إضافة الفصل بنجاح.');
    }

    // this for update chapter
    public function updateChapter(Request $request, Chapter $chapter)
    {
        $this->authorizeInstructor($chapter->course);
        $request->validate(['title' => 'required|string|max:255']);
        $chapter->update(['title' => $request->title]);
        return back()->with('success', 'تم تحديث الفصل.');
    }

    // this for destroy chapter
    public function destroyChapter(Chapter $chapter)
    {
        $this->authorizeInstructor($chapter->course);
        $chapter->delete();
        return back()->with('success', 'تم حذف الفصل.');
    }

    // Lessons
    public function storeLesson(Request $request, Chapter $chapter)
    {
        $this->authorizeInstructor($chapter->course);
        $request->validate([
            'title' => 'required|string|max:255',
            'video_url' => 'nullable|url',
        ]);

        $chapter->lessons()->create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(3),
            'video_url' => $request->video_url,
            'duration_minutes' => 10, // افتراضي
        ]);

        return back()->with('success', 'تم إضافة الدرس بنجاح.');
    }

    public function updateLesson(Request $request, Lesson $lesson)
    {
        $this->authorizeInstructor($lesson->chapter->course);
        $request->validate(['title' => 'required|string|max:255']);
        $lesson->update($request->only('title', 'video_url'));
        return back()->with('success', 'تم تحديث الدرس.');
    }

    public function destroyLesson(Lesson $lesson)
    {
        $this->authorizeInstructor($lesson->chapter->course);
        $lesson->delete();
        return back()->with('success', 'تم حذف الدرس.');
    }

    protected function authorizeInstructor(Course $course)
    {
        if ($course->teacher_id !== auth()->id()) {
            abort(403);
        }
    }
}
