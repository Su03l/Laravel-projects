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

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'كلمة المرور الحالية غير صحيحة'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'message' => 'تم تغيير كلمة المرور بنجاح'
        ]);
    }

    public function deleteAvatar(Request $request)
    {
        $user = $request->user();

        if ($user->avatar) {
            // Because we use an accessor that prepends the URL, we need to be careful.
            // But wait, the database stores the relative path 'avatars/filename.jpg'.
            // The accessor 'avatar' returns the full URL.
            // We should access the raw attribute using getRawOriginal or similar if needed,
            // OR just use the 'avatar' column directly if the model allows.
            // However, $user->avatar accessor returns URL.
            // Let's use getAttributes()['avatar'] matches raw DB value.

            $avatarPath = $user->getAttributes()['avatar'] ?? null;

            if ($avatarPath) {
                Storage::disk('public')->delete($avatarPath);
                $user->avatar = null;
                $user->save();
            }
        }

        return response()->json([
            'message' => 'تم حذف الصورة الشخصية',
            'user' => $user
        ]);
    }
}
