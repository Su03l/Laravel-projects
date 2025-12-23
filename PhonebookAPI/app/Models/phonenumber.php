<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class phonenumber extends Model
{
    /** @use HasFactory<\Database\Factories\PhonenumberFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'number',
        'email',
        'relation'
    ];
}
