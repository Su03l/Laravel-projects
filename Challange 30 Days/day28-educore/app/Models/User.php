<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // أضفنا الـ role هنا
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // دوال التحقق من الأدوار
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isInstructor(): bool
    {
        return $this->role === 'instructor' || $this->role === 'admin';
    }

    /**
     * Courses taught by the user.
     */
    public function teachingCourses(): HasMany
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    /**
     * Courses the user is enrolled in.
     */
    public function enrolledCourses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'enrollments')
                    ->withPivot('paid_amount', 'completed_at', 'certificate_id');
    }

    /**
     * User's progress in lessons.
     */
    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }

    /**
     * Enroll the user in a course.
     */
    public function enroll(Course $course, float $price)
    {
        return $this->enrolledCourses()->attach($course->id, ['paid_amount' => $price]);
    }
}
