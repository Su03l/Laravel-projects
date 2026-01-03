<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    // show the all courses
    public function index(Request $request)
    {
        $query = Course::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where('code', 'LIKE', "%{$searchTerm}%")
                ->orWhere('name', 'LIKE', "%{$searchTerm}%");
        }

        $courses = $query->withCount('sections')->orderBy('code')->get();

        return response()->json([
            'message' => 'Available Courses',
            'data' => CourseResource::collection($courses)
        ]);


    }

    // add new course
    public function store(Request $request)
    {
        $fields = $request->validate([
            'code' => 'required|string|unique:courses,code', // مثل CS101
            'name' => 'required|string',
            'credits' => 'required|integer|min:1|max:6',
            'description' => 'nullable|string'
        ]);

        $course = Course::create($fields);

        return response()->json([
            'message' => 'تم إضافة المقرر الدراسي بنجاح ',
            'data' => $course
        ], 201);
    }

    // show one course
    public function show($id)
    {
        $course = Course::with('sections')->findOrFail($id);

        return response()->json([
            'message' => 'Course Details',
            'data' => new CourseResource($course)
        ]);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $fields = $request->validate([
            'code' => 'required|string|unique:courses,code,' . $id,
            'name' => 'required|string',
            'credits' => 'required|integer|min:1|max:6',
            'description' => 'nullable|string'
        ]);

        $course->update($fields);

        return response()->json([
            'message' => 'تم تحديث بيانات المقرر بنجاح ',
            'data' => $course
        ]);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete(); // الشعب المرتبطة بتنحذف تلقائياً بسبب

        return response()->json([
            'message' => 'تم حذف المقرر الدراسي من النظام'
        ]);
    }

}
