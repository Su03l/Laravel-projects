<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'wallet_balance',      // 💰 الرصيد
        'otp_code',            // 🔐 كود التحقق
        'otp_expires_at',      // ⏳ وقت الانتهاء
        'two_factor_enabled',  // 🛡️ حالة المصادقة الثنائية
        'email_verified_at',   // ✅ تفعيل الإيميل
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',            // 🛑 لا ترجع الكود أبداً في الـ API
        'otp_expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'otp_expires_at' => 'datetime', // 🕒 عشان نتعامل معه كـ Carbon
        'two_factor_enabled' => 'boolean',
    ];

    // علاقة العمليات المالية
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // علاقة المحادثات
    public function chats()
    {
        return $this->hasMany(Chat::class);
    }
}
