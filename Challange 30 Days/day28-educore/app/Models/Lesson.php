<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'chapter_id',
        'title',
        'slug',
        'content',
        'video_url',
        'duration_minutes',
        'sort_order',
        'is_free_preview'
    ];

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function progress()
    {
        return $this->hasMany(Progress::class);
    }
}
