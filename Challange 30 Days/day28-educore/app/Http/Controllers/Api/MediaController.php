<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    /**
     * Handle file uploads for courses and lessons.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,png,mp4,pdf|max:102400', // 100MB Max
        ]);

        // Determine folder based on mime type
        $folder = str_contains($request->file->getMimeType(), 'video') ? 'videos' : 'images';

        // Store file in public storage
        $path = $request->file('file')->store($folder, 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
            'type' => $folder
        ]);
    }
}
