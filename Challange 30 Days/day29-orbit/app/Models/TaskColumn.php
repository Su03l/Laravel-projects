<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskColumn extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks()
    {
        // ترتيب المهام دائماً حسب الـ Position
        return $this->hasMany(Task::class)->orderBy('position');
    }
}
