<?php

namespace App\Http\Controllers\UserProfile;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'type', 'avatar', 'bio')->paginate(10);

        return response()->json($users);
    }

    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'bio' => 'nullable|string',
            'avatar' => 'nullable|string',
            'website' => 'nullable|url',
            'cv_path' => 'nullable|string',
        ]);

        $user->update($request->only([
            'name',
            'email',
            'bio',
            'avatar',
            'website',
            'cv_path'
        ]));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
