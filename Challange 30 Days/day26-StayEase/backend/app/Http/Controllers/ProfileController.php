<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DTOs\UpdateProfileDTO;
use App\Actions\UpdateProfileAction;
use App\Actions\ChangePasswordAction;
use App\Actions\ToggleTwoFactorAction;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    // 1. Show Profile
    public function show(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    // 2. Update Profile
    public function update(Request $request, UpdateProfileAction $action): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => ['nullable', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($user->id)],
            'avatar' => 'nullable|image|max:2048',
        ]);

        $dto = UpdateProfileDTO::fromRequest($request);
        $updatedUser = $action->execute($user, $dto);

        return response()->json(['message' => 'تم تحديث الملف الشخصي', 'user' => $updatedUser]);
    }

    // 3. Change Password
    public function changePassword(Request $request, ChangePasswordAction $action): JsonResponse
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $action->execute($request->user(), $request->current_password, $request->new_password);

        return response()->json(['message' => 'تم تغيير كلمة المرور بنجاح']);
    }

    // 4. Toggle 2FA
    public function toggleTwoFactor(Request $request, ToggleTwoFactorAction $action): JsonResponse
    {
        $request->merge(['enable' => $request->boolean('enable')]);
        $request->validate(['enable' => 'required|boolean']);

        $action->execute($request->user(), $request->boolean('enable'));

        $status = $request->enable ? 'تفعيل' : 'إيقاف';
        return response()->json(['message' => "تم $status المصادقة الثنائية."]);
    }
}
