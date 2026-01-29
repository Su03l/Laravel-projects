<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Models\Project;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use ApiResponse;

    // 1. عرض المشاريع (مع الفلتر)
    public function index(Request $request)
    {
        $query = Project::with(['client:id,company_name', 'manager:id,name']);

        // فلتر بحالة المشروع
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // فلتر بمشاريع عميل معين
        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        $projects = $query->latest()->paginate(10);

        return $this->success($projects);
    }

    // 2. إنشاء مشروع جديد
    public function store(StoreProjectRequest $request)
    {
        $project = Project::create($request->validated());

        return $this->success($project, 'تم إنشاء المشروع بنجاح', 201);
    }

    // 3. عرض تفاصيل المشروع (مع المهام ونسبة الإنجاز)
    public function show(Project $project)
    {
        // نحمل العميل + المدير + المهام ومين ماسكها
        $project->load(['client', 'manager', 'tasks.assignee']);

        // نسبة الإنجاز بتجي تلقائياً بسبب $appends في المودل
        return $this->success($project);
    }

    // 4. تحديث المشروع (مثلاً تغيير الحالة)
    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'status' => 'in:pending,active,completed,hold',
            'name' => 'string',
            'budget' => 'numeric'
        ]);

        $project->update($data);

        return $this->success($project, 'تم تحديث المشروع');
    }

    // 5. حذف المشروع
    public function destroy(Project $project)
    {
        $project->delete();
        return $this->success(null, 'تم حذف المشروع');
    }
}
