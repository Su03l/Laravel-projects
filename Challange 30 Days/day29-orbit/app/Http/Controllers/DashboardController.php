<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{

    // this for get all workspaces for user
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
