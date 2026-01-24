<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;


    protected $fillable = [
        'name', 'email', 'phone', 'national_id', 'dob', 'password',
        'account_number', 'iban', 'wallet_balance'
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function beneficiaries()
    {
        return $this->hasMany(Beneficiary::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $user->account_number = '100' . rand(1000000, 9999999);

            $user->iban = 'SA' . rand(10, 99) . 'PAYF' . $user->account_number;

            $user->wallet_balance = 1000.00;
        });
    }
}
