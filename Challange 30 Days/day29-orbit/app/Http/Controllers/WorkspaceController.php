<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WorkspaceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $workspace = Workspace::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(4),
            'owner_id' => $request->user()->id,
        ]);

        // إضافة المالك كعضو بصلاحية أدمن
        $workspace->members()->attach($request->user()->id, ['role' => 'admin']);

        return back();
    }

    public function show(Request $request, Workspace $workspace)
    {
        // تأكد إن المستخدم عضو بالمساحة
        abort_unless($workspace->members()->where('user_id', $request->user()->id)->exists(), 403);

        $workspace->load([
            'projects' => function ($query) {
                $query->withCount('tasks')->latest();
            },
            'members',
            'owner',
        ]);
        $workspace->loadCount(['projects', 'members']);

        return \Inertia\Inertia::render('Workspace/Show', [
            'workspace' => $workspace,
        ]);
    }
}
