<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $guarded = [];

    // this for get user who did activity
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // this for get task that did activity
    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
