<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    // الدالة تستقبل الريكويست، والنوع المطلوب (مثلاً advisor)
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // إذا المستخدم مو مسجل دخول، أو دوره مو مطابق للمطلوب
        if (!$request->user() || $request->user()->role !== $role) {
            return response()->json([
                'message' => 'عفواً، ليس لديك صلاحية للوصول لهذه الصفحة '
            ], 403);
        }

        return $next($request);
    }
}
