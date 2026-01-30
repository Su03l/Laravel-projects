<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Link extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'original_url',
        'short_code',
        'visits'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
