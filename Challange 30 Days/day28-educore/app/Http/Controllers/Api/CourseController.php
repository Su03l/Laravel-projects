<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Http\Resources\CourseResource;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of published courses with search support.
     */
    public function index(Request $request)
    {
        $query = Course::with('teacher')
            ->where('is_published', true);

        // Support for search by title
        if ($request->has('q')) {
            $query->where('title', 'like', '%' . $request->q . '%');
        }

        $courses = $query->latest()->paginate(10);

        return CourseResource::collection($courses);
    }

    /**
     * Display the specified course details.
     */
    public function show($slug)
    {
        $course = Course::with(['teacher', 'chapters.lessons'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return new CourseResource($course);
    }
}
