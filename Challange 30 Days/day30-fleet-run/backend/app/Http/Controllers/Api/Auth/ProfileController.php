<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\Auth\UserResource;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    use ApiResponseTrait;

    public function show(Request $request)
    {
        return $this->successResponse(new UserResource($request->user()));
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $user->update($request->only('name', 'email'));

        if ($user->role === 'driver' && $request->has('license_number')) {
            $user->driver()->update(['license_number' => $request->license_number]);
        }

        return $this->successResponse(new UserResource($user), 'Profile updated successfully');
    }
}
