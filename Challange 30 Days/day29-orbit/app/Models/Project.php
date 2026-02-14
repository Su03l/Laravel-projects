<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $guarded = [];

    // this for get workspace that project belong to
    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    // this for get columns that project belong to
    public function columns()
    {
        // ترتيب الأعمدة دائماً حسب الـ Position
        return $this->hasMany(TaskColumn::class)->orderBy('position');
    }

    // this for get tasks that project belong to
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
