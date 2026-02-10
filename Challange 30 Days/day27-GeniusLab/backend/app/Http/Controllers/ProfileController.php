<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponse;

class ProfileController extends Controller
{
    use ApiResponse;

    // Show User Profile
    public function show(Request $request)
    {
        return $this->success(new UserResource($request->user()));
    }

    // Update User Profile
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->name = $request->name;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return $this->success(new UserResource($user), 'Profile updated successfully.');
    }

    /**
     * Toggle Two-Factor Authentication.
     */
    public function toggleTwoFactor(Request $request)
    {
        $request->validate(['enable' => 'required|boolean']);

        $user = $request->user();
        $user->two_factor_enabled = $request->enable;
        $user->save();

        $status = $user->two_factor_enabled ? 'enabled' : 'disabled';
        return $this->success(new UserResource($user), "Two-Factor Authentication $status.");
    }
}
