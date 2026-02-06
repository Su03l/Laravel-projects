<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid', 'ref_id', 'user_id', 'category_id', 'assigned_to',
        'title', 'description', 'priority', 'status',
        'sla_due_at', 'is_resolved', 'resolved_at'
    ];

    protected $casts = [
        'sla_due_at' => 'datetime',
        'resolved_at' => 'datetime',
        'is_resolved' => 'boolean',
    ];

    //  Boot Logic: توليد الأرقام تلقائياً عند الإنشاء
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ticket) {
            // 1. إنشاء UUID
            $ticket->uuid = (string)Str::uuid();

            // 2. إنشاء رقم مرجعي مميز (مثال: TKT-8329)
            $ticket->ref_id = 'TKT-' . strtoupper(Str::random(6));
        });
    }

    // العلاقات
    public function user() // العميل
    {
        return $this->belongsTo(User::class);
    }

    public function assignedAgent() // الموظف
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function category() // القسم
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

// دالة مساعدة لمعرفة آخر رد (عشان نعرضه في القائمة)
    public function latestComment()
    {
        return $this->hasOne(Comment::class)->latestOfMany();
    }
}
