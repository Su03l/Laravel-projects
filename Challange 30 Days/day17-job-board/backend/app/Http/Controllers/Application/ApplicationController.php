<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function store(Request $request, $job_id)
    {
        $user = $request->user();

        if ($user->type !== 'seeker') {
            return response()->json([
                'message' => 'فقط الباحثين عن عمل يمكنهم التقديم'
            ], 403);
        }

        $existing = Application::where('user_id', $user->id)
            ->where('job_id', $job_id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'لقد قمت بالتقديم مسبقاً'
            ], 400);
        }

        $request->validate([
            'cover_letter' => 'nullable|string'
        ]);

        $application = Application::create([
            'user_id' => $user->id,
            'job_id' => $job_id,
            'cover_letter' => $request->cover_letter,
        ]);

        return response()->json([
            'message' => 'تم التقديم بنجاح',
            'application' => $application
        ], 201);
    }

    public function myApplications(Request $request)
    {
        $applications = Application::with('job.company')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($applications);
    }

    public function getJobApplications(Request $request, $job_id)
    {
        $job = Job::findOrFail($job_id);

        if ($request->user()->id !== $job->user_id) {
            return response()->json([
                'message' => 'غير مصرح لك برؤية المتقدمين'
            ], 403);
        }

        $applications = $job->applications()
            ->with('user:id,name,email,avatar,cv_path,bio')
            ->get();

        return response()->json($applications);
    }

    public function update(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        if ($request->user()->id !== $application->user_id) {
            return response()->json([
                'message' => 'هذا الطلب لا يخصك'
            ], 403);
        }

        if ($application->status !== 'pending') {
            return response()->json([
                'message' => 'عذراً، لا يمكن تعديل الطلب بعد أن تمت مراجعته من قبل الشركة'
            ], 400);
        }

        $request->validate([
            'cover_letter' => 'required|string',
        ]);

        $application->update([
            'cover_letter' => $request->input('cover_letter'),
        ]);

        return response()->json([
            'message' => 'تم تحديث طلب التقديم بنجاح',
            'application' => $application
        ]);
    }

    public function changeStatus(Request $request, $id)
    {
        $application = Application::with('job')->findOrFail($id);

        if ($request->user()->id !== $application->job->user_id) {
            return response()->json([
                'message' => 'غير مصرح لك باتخاذ إجراء على هذا الطلب'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:accepted,rejected,pending'
        ]);

        $application->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'تم تغيير حالة الطلب بنجاح إلى ' . $request->status,
            'application' => $application
        ]);
    }
    public function destroy(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        if ($request->user()->id !== $application->user_id) {
            return response()->json([
                'message' => 'غير مصرح لك'
            ], 403);
        }

        $application->delete();

        return response()->json([
            'message' => 'تم سحب الطلب بنجاح'
        ]);
    }
}
