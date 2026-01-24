<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beneficiary extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'beneficiary_user_id',
        'alias_name'
    ];

    public function beneficiaryUser()
    {
        return $this->belongsTo(User::class, 'beneficiary_user_id');
    }
}
