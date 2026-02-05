<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'phone',
        'password',
        'avatar',
        'about',
        'is_online',
        'last_seen_at',
        'chat_lock_pin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'chat_lock_pin',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'last_seen_at' => 'datetime',
            'is_online' => 'boolean',
        ];
    }

    /**
     * تحويل مسار الصورة إلى رابط كامل تلقائياً
     */
    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? url('storage/' . $value) : null,
        );
    }

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'participants')
            ->withPivot('is_admin', 'joined_at')
            ->latest('last_message_at');
    }
}
