<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * عرض بروفايل مستخدم آخر
     */
    public function show($id)
    {
        $user = User::select('id', 'name', 'phone', 'avatar', 'about', 'is_online', 'last_seen_at')
            ->findOrFail($id);

        return response()->json($user);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'string|max:50',
            'about' => 'string|max:100',
            'avatar' => 'image|max:10248',
        ]);

        $data = $request->only(['name', 'about']);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        $user->update($data);

        return response()->json([
            'message' => 'تم تحديث البروفايل',
            'user' => $user
        ]);
    }

    public function setChatPin(Request $request)
    {
        $request->validate([
            'pin' => 'required|digits:4',
        ]);

        $request->user()->update([
            'chat_lock_pin' => Hash::make($request->pin)
        ]);

        return response()->json([
            'message' => 'تم تعيين رمز الحماية بنجاح'
        ]);
    }
}
