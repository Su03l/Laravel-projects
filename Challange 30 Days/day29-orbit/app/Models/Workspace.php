<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    use HasFactory;

    protected $guarded = [];

    // this for get projects that workspace have
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    // this for get members that workspace have
    public function members()
    {
        return $this->belongsToMany(User::class, 'workspace_user')
                    ->withPivot('role');
    }

    // this for get owner that workspace have
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
