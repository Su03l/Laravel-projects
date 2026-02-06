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
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // تعيين الدور تلقائياً كـ "Customer"
        $user->assignRole('Customer');


        return response()->json([
            'message' => 'تم إنشاء الحساب بنجاح',
            'user' => $user,
            'role' => 'Customer',
        ], 201);
    }

    // تسجيل الدخول (Login)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // التحقق من صحة البيانات
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'بيانات الدخول غير صحيحة'
            ], 401);
        }

        // التحقق من الحظر
        if (!$user->is_active) {
            return response()->json([
                'message' => 'تم تعطيل هذا الحساب، يرجى مراجعة الإدارة'
            ], 403);
        }

        // تحديث وقت آخر ظهور
        $user->update(['last_login_at' => now()]);

        // جلب الدور (أول دور للمستخدم)
        $role = $user->getRoleNames()->first();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'تم تسجيل الدخول',
            'user' => $user,
            'role' => $role,
            'token' => $token
        ]);
    }

    // تسجيل الخروج
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'تم تسجيل الخروج'
        ]);
    }
}
