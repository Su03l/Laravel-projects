<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $guarded = [];

    // this for get user who did comment
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // this for get task that did comment
    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
