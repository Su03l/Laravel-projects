<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    // traits
    use ApiResponseTrait;

    // the update method for change password
    public function update(ChangePasswordRequest $request)
    {
        $user = $request->user();
        $user->update(['password' => Hash::make($request->new_password)]);

        return $this->successResponse(null, 'Password changed successfully');
    }
}
