<?php

use App\Models\File;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $stats = [
        'users' => User::count(),
        'files' => File::count(),
        'folders' => Folder::count(),
    ];

    $latestFiles = File::with('user')->latest()->take(5)->get();

    return view('welcome', compact('stats', 'latestFiles'));
});
