<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->id !== $request->user()->id) {
            return response()->json([
                'message' => 'عفواً، لا تملك صلاحية تعديل هذا الحساب '
            ], 403);
        }

        $fields = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6'
        ]);

        if (isset($fields['password'])) {
            $fields['password'] = Hash::make($fields['password']);
        }

        $user->update($fields);

        return response()->json([
            'message' => 'تم تحديث بياناتك بنجاح ',
            'data' => $user
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->id !== $request->user()->id) {
            return response()->json(['message' => 'عفواً، لا تملك صلاحية حذف هذا الحساب '], 403);
        }

        $user->delete();

        return response()->json(['message' => 'تم حذف الحساب نهائياً ']);
    }
}
