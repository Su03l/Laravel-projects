<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class courses extends Model
{
    /** @use HasFactory<\Database\Factories\CoursesFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'code',
    ];
    public function students()
    {
        return $this->belongsToMany(
            Students::class,
            'course_student',
            'course_id',
            'student_id'
        );
    }
}
