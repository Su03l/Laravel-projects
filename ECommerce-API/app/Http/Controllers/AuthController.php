<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|confirmed|min:6'
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
        ]);

//        $token = $user->createToken('ecom_token')->plainTextToken;
//
        return response()->json([
            'message' => 'تم إنشاء الحساب بنجاح ',
            'user' => $user,
//            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'بيانات الدخول غير صحيحة '
            ], 401);
        }

        $token = $user->createToken('ecom_token')->plainTextToken;

        return response()->json([
            'message' => 'أهلاً بك مجدداً ',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح '
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        return response()->json([
            'message' => 'تم تحديث بياناتك الشخصية بنجاح ',
            'user' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6|confirmed'
        ]);

        $user = $request->user();

        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'message' => 'كلمة المرور الحالية غير صحيحة '
            ], 400);
        }

        $user->update([
            'password' => Hash::make($data['new_password'])
        ]);

        return response()->json([
            'message' => 'تم تغيير كلمة المرور بنجاح '
        ]);
    }

}
