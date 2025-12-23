<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employees extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeesFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'department_id',
        'role'
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Departments::class);
    }
}
