<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\EnrollmentService;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(protected EnrollmentService $enrollmentService) {}

    /**
     * Enroll the authenticated user in a course.
     */
    public function store(Request $request, $courseId)
    {
        $course = Course::findOrFail($courseId);

        try {
            $this->enrollmentService->enroll($request->user(), $course);

            // التحقق مما إذا كان الطلب قادماً من Inertia
            if ($request->header('X-Inertia')) {
                // التوجيه لصفحة "دروسي" مع رسالة نجاح
                return redirect()->route('my-learning')->with('success', 'تم الاشتراك في الدورة بنجاح! نتمنى لك رحلة تعليمية ممتعة.');
            }

            return response()->json([
                'message' => 'Enrolled successfully',
                'course_id' => $course->id
            ], 201);

        } catch (\Exception $e) {
            if ($request->header('X-Inertia')) {
                return back()->with('error', 'حدث خطأ أثناء الاشتراك: ' . $e->getMessage());
            }

            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
