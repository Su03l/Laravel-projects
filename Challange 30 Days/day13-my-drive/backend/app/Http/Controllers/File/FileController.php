<?php

namespace App\Http\Controllers\File;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function index()
    {
        $files = Auth::user()->files()->whereNull('folder_id')->latest()->get();

        return response()->json($files);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240',
            'folder_id' => 'nullable|exists:folders,id'
        ]);

        $uploadedFile = $request->file('file');

        $path = $uploadedFile->store('uploads');

        $fileRecord = Auth::user()->files()->create([
            'name' => $uploadedFile->getClientOriginalName(),
            'path' => $path,
            'size' => $uploadedFile->getSize(),
            'mime_type' => $uploadedFile->getMimeType(),
            'folder_id' => $request->folder_id
        ]);

        return response()->json([
            'message' => 'File uploaded',
            'file' => $fileRecord
        ]);
    }

    public function download($id)
    {
        $file = Auth::user()->files()->findOrFail($id);

        return Storage::download($file->path, $file->name);
    }

    public function destroy($id)
    {
        $file = Auth::user()->files()->findOrFail($id);

        if (Storage::exists($file->path)) {
            Storage::delete($file->path);
        }

        $file->delete();

        return response()->json([
            'message' => 'File deleted'
        ]);
    }
}
