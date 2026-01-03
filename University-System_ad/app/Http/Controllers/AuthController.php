<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'university_id' => 'required|string|unique:users,university_id',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|confirmed|min:6',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'university_id' => $data['university_id'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

//        $token = $user->createToken('uni_token')->plainTextToken;

        return response()->json([
            'message' => 'تم التسجيل بنجاح',
            'user' => $user,
//            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required',  //يقبل ايميل او رقم الاجمعي
            'password' => 'required',
        ]);

        $user = User::where('email', $request->login_id)
            ->orWhere('university_id', $request->login_id)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'بيانات الدخول خاطئة',
            ], 401);
        }

        $token = $user->createToken('uni_token')->plainTextToken;

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح',
        ]);
    }


}
