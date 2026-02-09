<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class RoomImage extends Model
{
    use HasFactory;

    protected $fillable = ['room_id', 'image_path', 'is_featured'];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        $path = trim($this->image_path);
        if (str_starts_with($path, 'http')) {
            return $path;
        }
        return asset(Storage::url($path));
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
