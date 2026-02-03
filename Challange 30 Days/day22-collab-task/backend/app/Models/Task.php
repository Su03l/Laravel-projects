<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'is_completed',
        'priority',
        'start_date',
        'end_date',
        'user_id',
        'group_id',
        'assigned_to'
    ];

    // علاقة مع المنشئ
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // علاقة مع المجموعة
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // علاقة مع الشخص المكلف
    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }
}
