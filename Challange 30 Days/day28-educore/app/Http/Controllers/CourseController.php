<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Http\Resources\CourseResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    // this for display all courses 
    public function index()
    {
        $courses = Course::with(['teacher'])
            ->withCount('lessons')
            ->where('is_published', true)
            ->latest()
            ->paginate(12);

        // تحويل البيانات إلى مصفوفة بسيطة لضمان وصولها بشكل صحيح لـ Inertia
        $resource = CourseResource::collection($courses);

        return Inertia::render('Marketplace/Browse', [
            'courses' => $resource,
            'pagination' => [
                'links' => $courses->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $courses->currentPage(),
                    'last_page' => $courses->lastPage(),
                    'total' => $courses->total(),
                ]
            ]
        ]);
    }

    // this for display course details
    public function show(Course $course)
    {
        if (!$course->is_published) {
            abort(404);
        }

        $course->load(['teacher', 'chapters.lessons']);

        return Inertia::render('Marketplace/CourseDetails', [
            'course' => new CourseResource($course)
        ]);
    }
}
