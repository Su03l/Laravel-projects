<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $notes = $request->user()->notes()->latest()->get();
        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $note = $request->user()->notes()->create($fields);

        return response()->json([
            'message' => 'تم حفظ المذكرة ',
            'data' => $note
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $note = $request->user()->notes()->findOrFail($id);
        return response()->json($note);
    }

    public function update(Request $request, $id)
    {
        $note = $request->user()->notes()->findOrFail($id);

        $fields = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);

        $note->update($fields);

        return response()->json([
            'message' => 'تم تعديل المذكرة ',
            'data' => $note
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $note = $request->user()->notes()->findOrFail($id);

        $note->delete();

        return response()->json([
            'message' => 'تم حذف المذكرة '
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        // إذا ما كتب شي في البحث، نرجع له كل مذكراته
        if (!$query) {
            return response()->json($request->user()->notes);
        }

        $notes = $request->user()->notes()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%$query%")
                    ->orWhere('content', 'like', "%$query%");
            })
            ->latest()
            ->get();

        return response()->json([
            'message' => 'نتائج البحث في مذكراتك ',
            'count' => $notes->count(),
            'data' => $notes
        ]);
    }
}
