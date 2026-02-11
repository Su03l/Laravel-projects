<?php

namespace App\Services;

use App\Models\User;
use App\Models\Course;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use Exception;

class CertificateService
{
    /**
     * Generate a certificate for a user who completed a course.
     */
    public function generate(User $user, Course $course)
    {
        // 1. Get enrollment data
        $enrollment = $user->enrolledCourses()
                           ->where('course_id', $course->id)
                           ->first();

        // 2. Eligibility check (Has the course been completed?)
        if (!$enrollment || is_null($enrollment->pivot->completed_at)) {
            throw new Exception("You have not completed this course yet.");
        }

        // 3. Create a unique certificate ID if it doesn't exist
        if (is_null($enrollment->pivot->certificate_id)) {
            $certId = Str::upper(Str::random(10));
            $user->enrolledCourses()->updateExistingPivot($course->id, [
                'certificate_id' => $certId
            ]);
            $enrollment->pivot->certificate_id = $certId;
        }

        // 4. Prepare data for the view
        $data = [
            'student_name' => $user->name,
            'course_title' => $course->title,
            'date' => \Carbon\Carbon::parse($enrollment->pivot->completed_at)->format('F j, Y'),
            'certificate_id' => $enrollment->pivot->certificate_id,
        ];

        // 5. Load and configure PDF
        $pdf = Pdf::loadView('pdf.certificate', $data);
        $pdf->setPaper('a4', 'landscape');

        return $pdf;
    }
}
