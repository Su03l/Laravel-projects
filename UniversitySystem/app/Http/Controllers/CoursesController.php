<?php

namespace App\Http\Controllers;

use App\Models\courses;

use App\Http\Requests\StorecoursesRequest;
use App\Http\Requests\UpdatecoursesRequest;

class CoursesController extends Controller
{

    public function index()
    {
        return response()->json(courses::with('students')->get());
    }


    public function store(StorecoursesRequest $request)
    {
        $data = $request->validated();
        $courses = courses::create($data);

        return response()->json([
            'message' => 'تم انشاء المادة بنجاح',
            'course' => $courses
        ], 201);
    }

    public function show(courses $course)
    {
        $course->load('students');
        return response()->json($course);
    }

    public function update(UpdatecoursesRequest $request, courses $course)
    {
        $data = $request->validated();
        $course->update($data);

        return response()->json([
            'message' => 'تم تحديث بيانات المادة بنجاح',
            'course' => $course
        ]);
    }

    public function destroy(courses $course)
    {
        $course->delete();
        return response()->json([
            'message' => 'تم حذف المادة بنجاح',
            'course' => $course
            ]);
    }
}
