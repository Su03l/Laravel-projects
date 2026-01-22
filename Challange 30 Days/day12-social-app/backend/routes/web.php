<?php

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $stats = [
        'users' => User::count(),
        'tweets' => Tweet::count(),
    ];

    $latestTweets = Tweet::with('user')->latest()->take(3)->get();

    return view('welcome', compact('stats', 'latestTweets'));
});
