<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::with('comments')->latest()->get();
        return response()->json($videos);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url',
        ]);

        $video = Video::create($data);

        return response()->json([
            'message' => 'Video created successfully',
            'video' => $video
        ], 201);
    }

    public function show($id)
    {
        $video = Video::with('comments')->findOrFail($id);
        return response()->json($video);
    }

    public function update(Request $request, $id)
    {
        $video = Video::findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url',
        ]);

        $video->update($data);

        return response()->json([
            'message' => 'Video updated successfully',
            'video' => $video
        ]);
    }

    public function destroy($id)
    {
        $video = Video::findOrFail($id);
        $video->comments()->delete();
        $video->delete();

        return response()->json(['message' => 'Video deleted successfully']);
    }
}
