<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class students extends Model
{
    /** @use HasFactory<\Database\Factories\StudentsFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
    ];

    public function courses()
    {
        return $this->belongsToMany(
            Courses::class,
            'course_student',
            'student_id',
            'course_id'
        );
    }
}
