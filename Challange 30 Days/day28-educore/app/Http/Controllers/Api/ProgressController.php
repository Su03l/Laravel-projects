<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Services\ProgressService;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(protected ProgressService $progressService) {}

    /**
     * Update the completion status of a lesson.
     */
    public function update(Request $request, $lessonId)
    {
        $lesson = Lesson::with('chapter.course')->findOrFail($lessonId);

        // Check if the user is enrolled in the course
        if (!$request->user()->can('view', $lesson->chapter->course)) {
            if ($request->header('X-Inertia')) {
                return back()->withErrors(['error' => 'أنت غير مشترك في هذه الدورة.']);
            }
            return response()->json([
                'error' => 'You are not enrolled in this course.'
            ], 403);
        }

        $result = $this->progressService->markAsCompleted($request->user(), $lesson);

        if ($request->header('X-Inertia')) {
            return back()->with('success', 'تم تحديث التقدم بنجاح!');
        }

        return response()->json([
            'message' => 'Progress updated',
            'data' => $result
        ]);
    }
}
