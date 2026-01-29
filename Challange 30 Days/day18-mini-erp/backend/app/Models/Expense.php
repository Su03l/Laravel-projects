<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'project_id',
        'title',
        'amount',
        'expense_date',
        'user_id'
    ];
    protected $casts = [
        'expense_date' => 'date',   // عشان تقدر تستخدم ->format('Y-m-d')
        'amount' => 'decimal:2', // عشان يضمن أنها رقم بفواصل عشرية
    ];

    // 2. العلاقات (Relationships)

    // المصروف يتبع لمشروع معين
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // المصروف تم تسجيله بواسطة موظف معين
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

