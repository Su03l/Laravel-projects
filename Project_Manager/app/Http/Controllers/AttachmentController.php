<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:2048', // Max 2MB
            'type' => 'required|in:project,task',
            'id'   => 'required|integer'
        ]);

        $model = match($request->type) {
            'project' => Project::findOrFail($request->id),
            'task'    => Task::findOrFail($request->id),
        };

        $path = $request->file('file')->store('uploads', 'public');

        $attachment = $model->attachments()->create([
            'file_path' => $path,
            'file_name' => $request->file('file')->getClientOriginalName(),
        ]);

        return response()->json([
            'message' => 'تم رفع الملف بنجاح ',
            'data' => $attachment
        ], 201);
    }

    public function destroy(Attachment $attachment)
    {
        if (Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return response()->json(['message' => 'تم حذف الملف نهائياً ️']);
    }
}
