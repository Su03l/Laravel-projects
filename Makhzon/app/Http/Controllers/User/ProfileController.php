<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ChangePasswordRequest;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return new UserResource($request->user());
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();

        $user->update($request->validated());

        return response()->json([
            'message' => 'اها حدثت ممتاز ',
            'user' => new UserResource($user),
        ]);
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $user = $request->user();

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'ايه غيرت بس لا تنساه بعدين',
        ]);
    }
}
