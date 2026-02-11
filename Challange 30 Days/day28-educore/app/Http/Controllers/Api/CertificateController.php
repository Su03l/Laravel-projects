<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\CertificateService;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function __construct(protected CertificateService $certificateService) {}

    public function download(Request $request, $courseId)
    {
        $course = Course::findOrFail($courseId);

        try {
            $pdf = $this->certificateService->generate($request->user(), $course);

            // اسم الملف عند التحميل
            $filename = 'Certificate-' . $course->slug . '.pdf';

            return $pdf->download($filename);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }
}
