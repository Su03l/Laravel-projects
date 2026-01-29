<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'manager_id',
        'name',
        'description',
        'budget',
        'status',
        'start_date',
        'deadline'
    ];

    protected $appends = ['progress'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function getProgressAttribute()
    {
        if ($this->tasks()->count() == 0) {
            return 0;
        }

        $totalTasks = $this->tasks()->count();
        $completedTasks = $this->tasks()->where('status', 'completed')->count();

        return round(($completedTasks / $totalTasks) * 100, 2);
    }
}
