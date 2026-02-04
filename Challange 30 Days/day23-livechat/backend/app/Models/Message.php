<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'conversation_id',
        'user_id',
        'body',
        'type',
        'attachment_url',
        'is_read',
        'read_at',
        'reply_to_id',
        'is_edited'
    ];

    protected $casts = [
        'is_edited' => 'boolean',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    // المرسل
    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // المحادثة التابعة لها
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    // الرسالة الأصلية (في حالة الرد)
    public function replyTo()
    {
        return $this->belongsTo(Message::class, 'reply_to_id');
    }

    //  علاقة مع جدول الرسائل المخفية (للميزة: حذف لدي فقط)
    public function hiddenFor()
    {
        return $this->hasMany(HiddenMessage::class);
    }
}
