<?php

use App\Models\Job;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $stats = [
        'users' => User::count(),
        'jobs' => Job::count(),
        'tags' => Tag::count(),
    ];

    $latestJobs = Job::with(['user', 'tags'])
        ->latest()
        ->take(5)
        ->get();

    return view('welcome', compact('stats', 'latestJobs'));
});
