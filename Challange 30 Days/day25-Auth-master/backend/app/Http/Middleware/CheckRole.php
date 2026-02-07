<?php

namespace App\Http\Middleware;


use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\UserRole;


class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // نتأكد أن الرول حق اليوزر يطابق الرول المطلوب
        // ملاحظة: بما أننا نستخدم Enum في المودل، نحتاج نقارن القيمة (value)
        if ($request->user()->role->value !== $role) {
            abort(403, 'ليس لديك صلاحية للدخول هنا.');
        }

        return $next($request);
    }
}
