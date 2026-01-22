<?php

namespace App\Http\Controllers\Folder;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    public function index()
    {
        $folders = Auth::user()->folders()->latest()->get();
        return response()->json($folders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $folder = Auth::user()->folders()->create([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Folder created',
            'folder' => $folder
        ]);
    }

    public function show($id)
    {
        $folder = Auth::user()->folders()->with('files')->findOrFail($id);

        return response()->json($folder);
    }

    public function update(Request $request, $id)
    {
        $folder = Auth::user()->folders()->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $folder->update([
            'name' => $request->name,
        ]);
        return response()->json([
            'message' => 'Folder updated',
            'folder' => $folder
        ]);
    }

    public function destroy($id)
    {
        $folder = Auth::user()->folders()->findOrFail($id);

        $folder->delete();
        return response()->json([
            'message' => 'Folder deleted',
        ]);
    }
}
