<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $guarded = [];

    // this for get column that task belong to
    public function column()
    {
        return $this->belongsTo(TaskColumn::class, 'task_column_id');
    }

    // this for get project that task belong to
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // this for get user who assigned to task
    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // this for get comments that task have
    public function comments()
    {
        return $this->hasMany(Comment::class)->latest();
    }

    public function activities()
    {
        return $this->hasMany(Activity::class)->latest();
    }
}
