<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(Project::withCount('tasks')->get());
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'due_date' => 'required|date'
        ]);

        $project = Project::create($fields);

        return response()->json([
            'message' => 'تم إنشاء المشروع ',
            'data' => $project],
            201);
    }

    public function show(Project $project)
    {
        return response()->json($project->load(['tasks', 'notes', 'attachments']));
    }

    public function update(Request $request, Project $project)
    {
        $project->update($request->all());
        return response()->json(['message' => 'تم تحديث المشروع ', 'data' => $project]);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['message' => 'تم حذف المشروع ️']);
    }
}
