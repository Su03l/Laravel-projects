<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Http\Requests\V1\Projects\StoreProjectRequest;
use App\Http\Requests\V1\Projects\UpdateProjectRequest;
use App\Http\Resources\V1\ProjectResource;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;


class ProjectController extends Controller
{

    public function index(Request $request)
    {
        $baseQuery = $request->user()->projects()->withCount('tasks');

        $projects = QueryBuilder::for($baseQuery)
                ->allowedFilters(['title'])
            ->allowedSorts(['title', 'created_at', 'tasks_count'])
        ->latest()
        ->get();

        return ProjectResource::collection($projects);
    }

    public function store(StoreProjectRequest $request)
    {
        $project = $request->user()->projects()->create($request->validated());

        return new ProjectResource($project);
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);

        $project->loadCount('tasks');

        return new ProjectResource($project);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return new ProjectResource($project);
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project); // الحماي

        $project->delete();

        return response()->json([
            'message' => 'تم حذف المشروع بنجاح'
        ], 204);
    }
}
