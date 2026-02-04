<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conversation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'is_group', 'group_name', 'group_image', 'admin_id',
        'is_locked', 'is_phone_hidden',
        'last_message_preview', 'last_message_at'
    ];

    protected $casts = [
        'is_group' => 'boolean',
        'is_locked' => 'boolean',
        'is_phone_hidden' => 'boolean',
        'last_message_at' => 'datetime',
    ];

    // المشاركين
    public function participants()
    {
        return $this->hasMany(Participant::class);
    }

    // المستخدمين مباشرة (عبر جدول المشاركين)
    public function users()
    {
        return $this->belongsToMany(User::class, 'participants');
    }

    // الرسائل
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
