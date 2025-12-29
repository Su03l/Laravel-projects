<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    /** @use HasFactory<\Database\Factories\PropertyFactory> */
    use HasFactory;

    protected $guarded = [];

    public function scopeWithCity(Builder $query, $city)
    {
        return $query->where('city', 'like', "%{$city}%");
    }

    public function scopeWithStatus(Builder $query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeWithType(Builder $query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopePriceBetween(Builder $query, $min, $max)
    {
        // إذا حدد الاثنين
        if ($min && $max) return $query->whereBetween('price', [$min, $max]);
        // إذا حدد بس الحد الأدنى
        if ($min) return $query->where('price', '>=', $min);
        // إذا حدد بس الحد الأقصى
        if ($max) return $query->where('price', '<=', $max);

        return $query;
    }

    public function scopeAreaAround(Builder $query, $area)
    {
        $tolerance = 20;
        return $query->whereBetween('area', [$area - $tolerance, $area + $tolerance]);
    }


    public function scopeFilter(Builder $query, array $filters)
    {
        $query->when($filters['city'] ?? false, fn($q, $val) => $q->withCity($val))
            ->when($filters['type'] ?? false, fn($q, $val) => $q->withType($val))
            ->when($filters['status'] ?? false, fn($q, $val) => $q->withStatus($val))
            ->when($filters['rooms'] ?? false, fn($q, $val) => $q->where('rooms', '>=', $val))

            // للمساحة التقريبية
            ->when($filters['area'] ?? false, fn($q, $val) => $q->areaAround($val))

            // للسعر (نرسل القيمتين min و max)
            ->priceBetween($filters['min_price'] ?? null, $filters['max_price'] ?? null);
    }
}
