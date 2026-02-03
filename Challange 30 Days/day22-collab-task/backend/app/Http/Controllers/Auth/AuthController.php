<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'username' => 'required|string|max:20|unique:users|alpha_dash', // فقط حروف وأرقام وشرطات
            'email' => 'required|email|unique:users',
            'password' => [
                'required',
                'confirmed',
                Password::min(8) // أقل شي 8
                ->letters()  // لازم حروف
                ->mixedCase() // كابيتال وسمول
                ->numbers()   // لازم أرقام
                ->symbols()   // لازم رموز (!@#$)
            ]
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);


        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }

    // 2. تسجيل الدخول (Login) مع تسجيل وقت الدخول
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // التحقق من صحة البيانات
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'بيانات الدخول غير صحيحة'
            ], 401);
        }

        // تحقق أمني: هل الحساب محظور؟
        if (!$user->is_active) {
            return response()->json([
                'message' => 'تم تعطيل هذا الحساب، راجع الإدارة'
            ], 403);
        }

        // تحديث آخر ظهور
        $user->update(['last_login_at' => now()]);

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => $user,
            'token' => $token,
            'expires_in' => '120 minutes'
        ]);
    }

    // 3. تسجيل الخروج (Logout)
    public function logout(Request $request)
    {
        // حذف التوكن الحالي فقط
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'تم تسجيل الخروح بنجاح'
        ]);
    }
}
