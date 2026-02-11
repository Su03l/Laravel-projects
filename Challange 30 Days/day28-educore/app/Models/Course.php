<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    /**
     * Get the teacher who owns the course.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the chapters for the course.
     */
    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class)->orderBy('sort_order');
    }

    /**
     * Get all lessons for the course through chapters.
     */
    public function lessons(): HasManyThrough
    {
        return $this->hasManyThrough(Lesson::class, Chapter::class);
    }

    /**
     * Get the students enrolled in the course.
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments')
                    ->withPivot('paid_amount', 'completed_at', 'certificate_id');
    }

    /**
     * Get the reviews for the course.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
