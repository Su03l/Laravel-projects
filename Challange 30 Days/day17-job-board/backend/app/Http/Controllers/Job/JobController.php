<?php

namespace App\Http\Controllers\Job;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Tag;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = Job::with(['company:id,name,avatar', 'tags'])->latest();

        // فلتر بالعنوان أو الوصف
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // فلتر بالموقع
        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // فلتر بنوع العمل (Full-time, etc..)
        if ($request->filled('work_type')) {
            $query->where('work_type', $request->work_type);
        }

        // فلتر بالمهارات (Tags) - الجزء المتقدم
        // مثال: ?tags=laravel,react
        if ($request->filled('tags')) {
            $tags = explode(',', $request->tags);
            $query->whereHas('tags', function ($q) use ($tags) {
                $q->whereIn('name', $tags);
            });
        }

        return response()->json($query->paginate(10));
    }

    public function show($id)
    {
        $job = Job::with(['company', 'tags'])->findOrFail($id);
        return response()->json($job);
    }

    public function store(Request $request)
    {
        if ($request->user()->type !== 'company') {
            return response()->json([
                'message' => 'فقط الشركات يمكنها نشر وظائف'
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'work_type' => 'required|in:full-time,part-time,contract,freelance',
            'salary' => 'nullable|numeric',
            'tags' => 'required|array',
            'tags.*' => 'string',
        ]);

        // إنشاء الوظيفة
        $job = $request->user()->jobs()->create($request->only([
            'title', 'description', 'location', 'work_type', 'salary'
        ]));

        // معالجة المهارات (Tags Logic)
        $tagIds = [];
        foreach ($request->tags as $tagName) {
            $tag = Tag::firstOrCreate(['name' => strtolower($tagName)]);
            $tagIds[] = $tag->id;
        }

        // ربط التاقز بالوظيفة (في الجدول الوسيط)
        $job->tags()->sync($tagIds);

        return response()->json([
            'message' => 'Job posted successfully',
            'job' => $job->load('tags')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        if ($request->user()->id !== $job->user_id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string',
            'work_type' => 'sometimes|in:full-time,part-time,contract,freelance',
            'salary' => 'nullable|numeric',
            'tags' => 'sometimes|array',
        ]);

        $job->update($request->except('tags'));

        if ($request->has('tags')) {
            $tagIds = [];
            foreach ($request->tags as $tagName) {
                $tag = Tag::firstOrCreate(['name' => strtolower($tagName)]);
                $tagIds[] = $tag->id;
            }
            $job->tags()->sync($tagIds);
        }

        return response()->json([
            'message' => 'Job updated successfully',
            'job' => $job->load('tags')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        if ($request->user()->id !== $job->user_id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $job->delete(); // Soft delete

        return response()->json([
            'message' => 'Job deleted successfully'
        ]);
    }
}
