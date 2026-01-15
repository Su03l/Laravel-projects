<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;

class FileController extends Controller
{
    public function index()
    {
        return response()->json(File::latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,png,pdf,docx|max:2048',
        ]);

        $uploadedFile = $request->file('file');

        $path = $uploadedFile->store('uploads', 'public');

        $file = File::create([
            'name' => $uploadedFile->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $uploadedFile->getMimeType(),
            'size' => $uploadedFile->getSize(),
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'file' => $file
        ], 201);
    }

    public function show($id)
    {
        $file = File::findOrFail($id);
        return response()->json($file);
    }

    public function update(Request $request, $id)
    {
        $file = File::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $file->update([
            'name' => $request->name
        ]);

        return response()->json([
            'message' => 'File renamed successfully',
            'file' => $file
        ]);
    }

    public function destroy($id)
    {
        $file = File::findOrFail($id);
        $file->delete();

        return response()->json([
            'message' => 'File moved to trash'
        ]);
    }

    public function trash()
    {
        $files = File::onlyTrashed()->get();
        return response()->json($files);
    }

    public function restore($id)
    {
        $file = File::withTrashed()->findOrFail($id);

        $file->restore();

        return response()->json([
            'message' => 'File restored successfully'
        ]);
    }
}
