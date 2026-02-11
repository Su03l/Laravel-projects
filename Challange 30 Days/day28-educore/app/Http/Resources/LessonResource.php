<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user('sanctum');

        // Check access permission
        $hasAccess = $this->is_free_preview || ($user && $user->can('view', $this->chapter->course));

        // Check completion status
        $isCompleted = false;
        if ($user) {
            $isCompleted = $user->progress()
                ->where('lesson_id', $this->id)
                ->where('is_completed', true)
                ->exists();
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'duration' => $this->duration_minutes . ' min',
            'is_free' => (bool) $this->is_free_preview,
            'type' => 'video',
            'video_url' => $this->when($hasAccess, $this->video_url),
            'content' => $this->when($hasAccess, $this->content),
            'is_locked' => !$hasAccess,
            'is_completed' => $isCompleted,
        ];
    }
}
