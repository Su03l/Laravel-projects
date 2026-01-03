<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'title' => $this->name,
            'credits_hours' => $this->credits,
            // نعرض عدد الشعب المتوفرة فقط
            'available_sections_count' => $this->sections_count ?? 0,
        ];
    }
}
