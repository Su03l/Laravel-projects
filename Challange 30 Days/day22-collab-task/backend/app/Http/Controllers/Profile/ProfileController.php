<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        // نرجع اليوزر مع الاسم الكامل (الـ Accessor اللي سويناه)
        return response()->json([
            'user' => $request->user()->append('full_name')
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'job_title' => 'nullable|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'username' => 'required|string|unique:users,username,' . $user->id,
        ]);

        $user->update($request->only(['first_name', 'last_name', 'email', 'username', 'job_title']));

        return response()->json([
            'message' => 'تم تحديث البروفايل',
            'user' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ]
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'كلمة المرور الحالية غير صحيحة'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        $user->tokens()->delete();

        $newToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'تم تغيير كلمة المرور بنجاح، يرجى استخدام التوكن الجديد',
            'token' => $newToken
        ]);
    }
}
