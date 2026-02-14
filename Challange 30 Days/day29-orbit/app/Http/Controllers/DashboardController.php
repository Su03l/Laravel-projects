<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // جلب المساحات التي ينتمي لها المستخدم
        $workspaces = $request->user()
            ->workspaces()
            ->withCount('projects')
            ->with('projects')
            ->get();

        return Inertia::render('Dashboard', [
            'workspaces' => $workspaces
        ]);
    }
}
