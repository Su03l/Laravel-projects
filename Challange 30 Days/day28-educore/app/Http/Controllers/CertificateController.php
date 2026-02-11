<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    // this for certificates page
    public function index(Request $request)
    {
        $user = $request->user();

        $completedCourses = Enrollment::where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->with('course.teacher')
            ->get()
            ->map(function ($enrollment) {
                return [
                    'id' => $enrollment->id,
                    'course_id' => $enrollment->course->id,
                    'title' => $enrollment->course->title,
                    'instructor' => $enrollment->course->teacher->name,
                    'date' => $enrollment->completed_at->format('Y-m-d'),
                    'image' => $enrollment->course->thumbnail_url ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
                ];
            });

        return Inertia::render('Dashboard/Certificates', [
            'certificates' => $completedCourses
        ]);
    }

    // this for 
    public function viewHTML($enrollmentId)
    {
        $enrollment = Enrollment::with(['course', 'user'])->findOrFail($enrollmentId);

        $data = [
            'student_name' => $enrollment->user->name,
            'course_title' => $enrollment->course->title,
            'date' => $enrollment->completed_at ? $enrollment->completed_at->format('F d, Y') : now()->format('F d, Y'),
            'certificate_id' => 'CERT-' . strtoupper(substr(md5($enrollment->id), 0, 8))
        ];

        return view('pdf.certificate', $data);
    }

    // this for download 
    public function download(Request $request, $enrollmentId)
    {
        $enrollment = Enrollment::where('user_id', $request->user()->id)
            ->where('id', $enrollmentId)
            ->whereNotNull('completed_at')
            ->with('course')
            ->firstOrFail();

        $data = [
            'student_name' => $request->user()->name,
            'course_title' => $enrollment->course->title,
            'date' => $enrollment->completed_at->format('F d, Y'),
            'certificate_id' => 'CERT-' . strtoupper(substr(md5($enrollment->id), 0, 8))
        ];

        // تنظيف اسم الكورس ليكون صالحاً كاسم ملف
        $safeCourseTitle = Str::slug($enrollment->course->title);
        $fileName = "EduCore-Certificate-{$safeCourseTitle}.pdf";

        $pdf = Pdf::loadView('pdf.certificate', $data);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download($fileName);
    }
}
