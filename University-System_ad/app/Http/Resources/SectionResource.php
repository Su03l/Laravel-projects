<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
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
            'section_code' => $this->section_number,
            'schedule' => [
                'days' => $this->days,
                'start' => $this->time_start,
                'end' => $this->time_end,
            ],
            'instructor' => $this->professor_name,
            'availability' => [
                'capacity' => $this->capacity,
                'status' => $this->capacity > 0 ? 'Open' : 'Closed',
            ],
            'course_details' => new CourseResource($this->whenLoaded('course')),
        ];
    }
}
