<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Employee extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory;

    protected $guarded = [];

    public function scopeFilter(Builder $query, array $filters)
    {
        $query->when($filters['department'] ?? false, fn($q, $val) => $q->where('department', $val))
            ->when($filters['min_salary'] ?? false, fn($q, $val) => $q->where('salary', '>=', $val))
            ->when($filters['year'] ?? false, fn($q, $val) => $q->whereYear('joined_at', $val)); // فلترة بالسنة
    }
}
