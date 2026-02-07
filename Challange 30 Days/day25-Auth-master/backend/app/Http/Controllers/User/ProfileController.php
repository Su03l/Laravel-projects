<?php

namespace App\Http\Controllers\User;

use App\Actions\ChangePasswordAction;
use App\Actions\UpdateProfileAction;
use App\DTOs\UpdateProfileDTO;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;

class ProfileController extends Controller
{

    // show profile function
    public function show(Request $request)
    {
        // مجرد إرجاع المستخدم الحالي مغلفاً بالريسروس
        return new UserResource($request->user());
    }

    public function update(Request $request, UpdateProfileAction $action)
    {
        $request->validate([
            'name' => 'nullable|string',
            'phone' => 'nullable|string',
            'avatar' => 'nullable|image|max:2048', // صورة بحد أقصى 2MB
        ]);

        $dto = UpdateProfileDTO::fromRequest($request);
        $user = $action->execute($request->user(), $dto);

        return new UserResource($user);
    }

    public function changePassword(Request $request, ChangePasswordAction $action)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $action->execute($request->user(), $request->current_password, $request->new_password);

        return response()->json([
            'message' => 'تم تغيير كلمة المرور بنجاح'
        ]);
    }

    public function toggleTwoFactor(Request $request)
    {
        $request->validate(['enable' => 'required|boolean']);

        $request->user()->update([
            'two_factor_enabled' => $request->boolean('enable')
        ]);

        $status = $request->enable ? 'تفعيل' : 'إيقاف';
        return response()->json(['message' => "تم $status المصادقة الثنائية بنجاح."]);
    }
}
