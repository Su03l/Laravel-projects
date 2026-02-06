<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'body',
        'is_internal',
        'attachment_path'
    ];

    protected $casts = [
        'is_internal' => 'boolean',
    ];

    // علاقة مع الكاتب
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // علاقة مع التذكرة
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
