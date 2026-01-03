<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // إذا كان المستخدم "مشرف"
        if ($user->role === 'advisor') {
            // هات الطلاب اللي الـ advisor_id حقهم هو رقمي
            $myStudents = $user->students;

            return response()->json([
                'message' => 'قائمة الطلاب تحت إشرافك ',
                'count' => $myStudents->count(),
                'data' => $myStudents
            ]);
        }

        return response()->json([
            'message' => 'غير مصرح لك'
        ], 403);
    }

    // show for the current student
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    //update profile
    public function update(Request $request)
    {
        $user = $request->user();

        $fields = $request->validate([
            'name' => 'sometimes|string',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($fields);

        return response()->json([
            'message' => 'تم تحديث البيانات ',
            'user' => $user
        ]);
    }

    // change Password
    public function changePassword(Request $request)
    {
        $fields = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6|confirmed'
        ]);

        $user = $request->user();

        if (!Hash::check($fields['current_password'], $user->password)) {
            return response()->json([
                'message' => 'كلمة المرور الحالية غير صحيحة '
            ], 400);
        }

        $user->update(['password' => Hash::make($fields['new_password'])]);

        return response()->json([
            'message' => 'تم تغيير كلمة المرور بنجاح '
        ]);
    }

}
