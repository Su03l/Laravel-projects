<?php

namespace App\Http\Controllers\Media;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf,doc|max:5120',
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('uploads', 'public');

            return response()->json([
                'message' => 'File uploaded successfully',
                'path' => $path,
                'url' => asset('storage/' . $path)
            ], 200);
        }

        return response()->json([
            'error' => 'No file uploaded'
        ], 400);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        $path = $request->input('path');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);

            return response()->json([
                'message' => 'File deleted successfully'
            ]);
        }

        return response()->json([
            'message' => 'File not found'
        ], 404);
    }
}
