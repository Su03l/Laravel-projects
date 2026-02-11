<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\CourseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile.
     */
    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|min:8|confirmed',
        ]);

        $user->name = $request->name;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Get the courses the authenticated user is enrolled in.
     */
    public function myCourses(Request $request)
    {
        $courses = $request->user()
            ->enrolledCourses()
            ->with(['teacher', 'chapters'])
            ->get();

        return CourseResource::collection($courses);
    }
}
