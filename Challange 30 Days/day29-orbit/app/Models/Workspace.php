<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'workspace_user')
                    ->withPivot('role');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
