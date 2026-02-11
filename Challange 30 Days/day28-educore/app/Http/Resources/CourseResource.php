<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user('sanctum');
        $progressPercentage = 0;

        if ($user) {
            $totalLessons = $this->lessons()->count();
            if ($totalLessons > 0) {
                $completedLessons = $user->progress()
                    ->whereIn('lesson_id', $this->lessons()->pluck('lessons.id'))
                    ->where('is_completed', true)
                    ->count();
                $progressPercentage = round(($completedLessons / $totalLessons) * 100);
            }
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'thumbnail' => $this->thumbnail,
            'price_formatted' => $this->price == 0 ? 'Free' : '$' . number_format($this->price, 2),
            'rating' => (float) $this->average_rating,
            'reviews_count' => (int) $this->reviews_count,
            'user_progress' => $progressPercentage,
            'teacher' => [
                'id' => $this->teacher->id,
                'name' => $this->teacher->name,
            ],
            'chapters' => ChapterResource::collection($this->whenLoaded('chapters')),
            'created_at' => $this->created_at->format('Y-m-d'),
        ];
    }
}
