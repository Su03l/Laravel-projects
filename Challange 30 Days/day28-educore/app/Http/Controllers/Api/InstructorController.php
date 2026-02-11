<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Chapter;
use App\Models\Enrollment;
use App\Http\Resources\CourseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InstructorController extends Controller
{
    /**
     * Create a new course draft.
     */
    public function storeCourse(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id'
        ]);

        $course = Course::create([
            'teacher_id' => $request->user()->id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(5),
            'is_published' => false,
        ]);

        return new CourseResource($course);
    }

    /**
     * Add a chapter to a course.
     */
    public function storeChapter(Request $request, $courseId)
    {
        $course = Course::where('teacher_id', $request->user()->id)->findOrFail($courseId);

        $request->validate(['title' => 'required']);

        $chapter = $course->chapters()->create([
            'title' => $request->title,
            'sort_order' => $course->chapters()->count() + 1
        ]);

        return response()->json($chapter);
    }

    /**
     * Add a lesson to a chapter.
     */
    public function storeLesson(Request $request, $chapterId)
    {
        $chapter = Chapter::whereHas('course', function($q) use ($request) {
            $q->where('teacher_id', $request->user()->id);
        })->findOrFail($chapterId);

        $request->validate([
            'title' => 'required',
            'video_url' => 'required|url',
            'duration_minutes' => 'required|integer'
        ]);

        $lesson = $chapter->lessons()->create([
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'video_url' => $request->video_url,
            'duration_minutes' => $request->duration_minutes,
            'is_free_preview' => $request->boolean('is_free'),
        ]);

        return response()->json($lesson);
    }

    /**
     * Publish the course.
     */
    public function publish($courseId, Request $request)
    {
        $course = Course::where('teacher_id', $request->user()->id)->findOrFail($courseId);

        if ($course->chapters()->doesntExist()) {
            return response()->json(['error' => 'Cannot publish empty course'], 400);
        }

        $course->update(['is_published' => true]);
        return response()->json(['message' => 'Course is Live']);
    }

    /**
     * Get instructor analytics.
     */
    public function analytics(Request $request)
    {
        $totalRevenue = Enrollment::whereHas('course', function($q) use ($request) {
            $q->where('teacher_id', $request->user()->id);
        })->sum('paid_amount');

        $totalStudents = Enrollment::whereHas('course', function($q) use ($request) {
            $q->where('teacher_id', $request->user()->id);
        })->count();

        return response()->json([
            'revenue' => $totalRevenue,
            'students' => $totalStudents,
        ]);
    }
}
