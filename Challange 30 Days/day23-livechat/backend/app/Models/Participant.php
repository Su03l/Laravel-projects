<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;

    protected $table = 'participants';

    protected $fillable = [
        'conversation_id',
        'user_id',
        'is_admin', // خاص بالمجموعات (مشرف)
        'joined_at'
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'joined_at' => 'datetime'
    ];

    // ربط مع المستخدم
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ربط مع المحادثة
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
}
