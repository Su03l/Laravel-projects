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
        'name',
        'email',
        'password',
        'phone',
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    //create a  new wallet after register auto
    protected static function booted()
    {
        static::created(function ($user) {
            $accountNumber = '100' . str_pad(mt_rand(1, 9999999), 7, '0', STR_PAD_LEFT);

            $iban = 'SA' . mt_rand(10, 99) . 'NBZK' . $accountNumber;

            $user->wallet()->create([
                'balance' => 0,
                'currency' => 'SAR',
                'account_number' => $accountNumber,
                'iban' => $iban,
            ]);
        });
    }
}
