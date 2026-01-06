<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transaction extends Model
{
    protected $guarded = [];

    // create the number of order auto
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($transaction) {
            $transaction->uuid = 'TRX-' . strtoupper(Str::random(10));
        });
    }

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    public function relatedWallet()
    {
        return $this->belongsTo(Wallet::class, 'related_wallet_id');
    }
}
