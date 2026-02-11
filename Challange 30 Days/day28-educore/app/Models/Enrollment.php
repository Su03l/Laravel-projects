<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    public $timestamps = false; // لأننا نستخدم enrolled_at و completed_at يدوياً أو عبر الـ DB

    protected $fillable = [
        'user_id',
        'course_id',
        'paid_amount',
        'enrolled_at',
        'completed_at'
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
