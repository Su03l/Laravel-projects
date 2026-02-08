<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Check if role is Enum
        if ($user->role instanceof UserRole) {
            if ($user->role === UserRole::ADMIN) {
                return $next($request);
            }
        }
        // Check if role is string
        elseif ($user->role === 'admin') {
            return $next($request);
        }
        // Check if role is object but not UserRole (e.g. stdClass or other Enum implementation quirks)
        elseif (is_object($user->role) && property_exists($user->role, 'value') && $user->role->value === 'admin') {
             return $next($request);
        }

        return response()->json(['message' => 'عذراً، هذه المنطقة للمدراء فقط'], 403);
    }
}
