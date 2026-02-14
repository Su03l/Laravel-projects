<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskColumn extends Model
{
    use HasFactory;

    protected $guarded = [];

    // this for get project that column belong to
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // this for get tasks that column have
    public function tasks()
    {
        // ترتيب المهام دائماً حسب الـ Position
        return $this->hasMany(Task::class)->orderBy('position');
    }
}
