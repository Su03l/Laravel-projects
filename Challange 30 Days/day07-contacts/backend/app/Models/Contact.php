<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;


class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'country_code',
        'phone',
        'details',
        'photo'
    ];

    //// Accessor: حقل وهمي اسمه 'full_phone' يرجع الرقم كاملاً
    protected function fullPhone(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->country_code . ' ' . $this->phone,
        );
    }

    // لإظهار الحقل الوهمي في الـ JSON
    protected $appends = ['full_phone', 'photo_url'];

    public function scopeFilter($query, $searchTerm)
    {
        if ($searchTerm) {
            return $query->where(function ($q) use ($searchTerm) {
                $q->where('first_name', 'like', "%{$searchTerm}%")
                    ->orWhere('last_name', 'like', "%{$searchTerm}%")
                    ->orWhere('phone', 'like', "%{$searchTerm}%")
                    ->orWhere('details', 'like', "%{$searchTerm}%");
            });
        }

        return $query;
    }

    protected function photoUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->photo ? url(Storage::url($this->photo)) : null;
            },
        );
    }
}
