<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return $this->error('بيانات الدخول غير صحيحة', 401);
        }

        $user = Auth::user();

        $user->load(['employee.department']);

        $token = $user->createToken('auth_token')->plainTextToken;


        return $this->success([
            'user' => $user,
            'token' => $token,
            'role' => $user->role // Enum value
        ], 'تم تسجيل الدخول بنجاح');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'تم تسجيل الخروج');
    }
}
