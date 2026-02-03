<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'file_path',
        'file_name',
        'file_type',
        'task_id',
        'user_id'
    ];

    // نضيف الحقل الجديد للـ JSON
    protected $appends = ['url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessor لتحويل المسار إلى رابط كامل
    public function getUrlAttribute()
    {
        // إذا كان المسار يبدأ بـ http (رابط خارجي) نرجعه كما هو
        if (filter_var($this->file_path, FILTER_VALIDATE_URL)) {
            return $this->file_path;
        }

        // غير ذلك، نستخدم Storage::url لجلب الرابط العام
        return asset('storage/' . $this->file_path);
    }
}
