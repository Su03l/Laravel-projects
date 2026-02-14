<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    public function columns()
    {
        // ترتيب الأعمدة دائماً حسب الـ Position
        return $this->hasMany(TaskColumn::class)->orderBy('position');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
