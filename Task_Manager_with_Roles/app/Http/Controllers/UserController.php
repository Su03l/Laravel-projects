<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // 1. عرض كل الموظفين (للمدير فقط)
    public function index()
    {
        // نتحقق من صلاحية viewAny في الـ Policy
        $this->authorize('viewAny', User::class);

        return response()->json(User::all());
    }

    // 2. عرض موظف واحد 
    public function show($id)
    {
        $user = User::findOrFail($id);

        // نتحقق: هل أنت مدير أو هذا حسابك؟
        $this->authorize('view', $user);

        return response()->json($user);
    }

    // 3. تحديث بيانات موظف
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $this->authorize('update', $user);

        $fields = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|in:admin,user', // المدير يقدر يغير الرتب
        ]);

        // إذا موظف عادي يحاول يغير رتبته -> نمنعه (حماية إضافية)
        if (isset($fields['role']) && $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'غير مصرح لك بتغيير الرتبة '
            ], 403);
        }

        if (isset($fields['password'])) {
            $fields['password'] = Hash::make($fields['password']);
        }

        $user->update($fields);

        return response()->json([
            'message' => 'تم تحديث البيانات ',
            'data' => $user
        ]);
    }

    // 4. حذف موظف (فصل)
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        $this->authorize('delete', $user);

        $user->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم من النظام '
        ]);
    }
}
