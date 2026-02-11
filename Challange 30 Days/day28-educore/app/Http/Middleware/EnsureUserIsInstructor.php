<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsInstructor
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && ($request->user()->role === 'instructor' || $request->user()->role === 'admin')) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Access denied. Instructor role required.'
        ], 403);
    }
}
