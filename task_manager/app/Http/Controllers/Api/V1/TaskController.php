<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use App\Http\Requests\V1\Tasks\StoreTaskRequest;
use App\Http\Requests\V1\Tasks\UpdateTaskRequest;
use App\Http\Resources\V1\TaskResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\QueryBuilder\QueryBuilder;

// <-- هام جداً
use Spatie\QueryBuilder\AllowedFilter;


class TaskController extends Controller
{

    public function index(Request $request)
    {
        $baseQuery = Task::whereHas('project', function ($query) {
            $query->where('user_id', Auth::id());
        });

        $tasks = QueryBuilder::for($baseQuery)
            ->allowedFilters([
                'title',
                'status',
                'priority',
                AllowedFilter::exact('project_id'),
            ])
            ->allowedSorts(['title', 'due_date', 'created_at', 'priority'])
            ->latest()
            ->get();

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request)
    {
        $project = Project::findOrFail($request->project_id);

        $this->authorize('view', $project);

        $task = $project->tasks()->create($request->validated());

        if ($request->hasFile('image')) {
            $task->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return new TaskResource($task);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);

        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        if ($request->has('project_id')) {
            $newProject = Project::findOrFail($request->project_id);
            $this->authorize('view', $newProject);
        }

        $task->update($request->validated());

        return new TaskResource($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json([
            'message' => 'تم حذف المهمة بنجاح'
        ], 204);
    }
}
