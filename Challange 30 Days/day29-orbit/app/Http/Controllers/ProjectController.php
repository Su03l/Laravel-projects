<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TaskColumn;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    // this for create project
    public function store(Request $request)
    {
        $validated = $request->validate([
            'workspace_id' => 'required|exists:workspaces,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project = Project::create($validated);

        // إنشاء أعمدة افتراضية للمشروع الجديد
        $defaultColumns = ['قيد الانتظار', 'جاري العمل', 'مراجعة', 'مكتمل'];
        foreach ($defaultColumns as $index => $name) {
            TaskColumn::create([
                'project_id' => $project->id,
                'name' => $name,
                'position' => $index
            ]);
        }

        return redirect()->route('projects.show', $project->id);
    }

    // this for show project
    public function show(Project $project)
    {
        $project->load([
            'workspace.members',
            'columns.tasks.assignee',
            'columns.tasks.comments.user',
            'columns.tasks.activities.user'
        ]);

        return Inertia::render('Project/Board', [
            'project' => $project,
            'columns' => $project->columns,
            'members' => $project->workspace->members
        ]);
    }

    // this for move column
    public function moveColumn(Request $request, TaskColumn $column)
    {
        $request->validate(['position' => 'required|numeric']);
        $column->update(['position' => $request->position]);
        return back();
    }
}
