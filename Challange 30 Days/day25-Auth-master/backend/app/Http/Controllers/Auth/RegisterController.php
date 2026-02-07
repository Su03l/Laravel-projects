<?php

namespace App\Http\Controllers\Auth;

use App\Actions\RegisterNewUserAction;
use App\DTOs\RegisterUserDTO;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function register(Request $request, RegisterNewUserAction $action)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed', // إضافة confirmed
            'phone' => 'required',
        ]);

        $dto = RegisterUserDTO::fromRequest($request);

        $user = $action->execute($dto);

        return response()->json([
            'message' => 'تم التسجيل، تحقق من الكود',
            'data' => new UserResource($user), // 👈 نستخدم Resource العامة
        ]);
    }
}
