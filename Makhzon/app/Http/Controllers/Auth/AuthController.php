<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

//        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'مبروك يوحش على الحساب',
//            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['
            message' => 'راجع مرة ثانية '
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        $user->tokens()->delete();

        $expiration = $request->boolean('remember_me') ? now()->addMonth() : now()->addDay();

        $token = $user->createToken('auth_token', ['*'], $expiration)->plainTextToken;

        return response()->json([
            'message' => 'تم تسجيل الدخول',
            'token' => $token,
            'expires_at' => $expiration->format('Y-m-d H:i:s'),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'راح توحشنا'
        ]);
    }
}
