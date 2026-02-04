<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'phone' => 'required|string|unique:users,phone|min:10',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'about' => 'Hey there! I am using LiveChat.',
        ]);


        return response()->json([
            'message' => 'تم إنشاء الحساب بنجاح',
            'user' => $user,
        ], 201);
    }

    // 2. تسجيل الدخول (Login)
    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('phone', $request->phone)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'رقم الجوال أو كلمة المرور غير صحيحة'
            ], 401);
        }

        // تحديث الحالة إلى "متصل"
        $user->update(['is_online' => true]);

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'تم تسجيل الدخول',
            'user' => $user,
            'token' => $token
        ]);
    }

    // 3. تسجيل الخروج (Logout)
    public function logout(Request $request)
    {
        $user = $request->user();

        // تحديث الحالة إلى "غير متصل" وتسجيل وقت الخروج
        $user->update([
            'is_online' => false,
            'last_seen_at' => now(),
        ]);

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'تم تسجيل الخروج'
        ]);
    }
}
