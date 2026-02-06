<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schedule;

Route::get('/', function () {
    return view('welcome');
});

Schedule::command('nexus:check-sla')->everyMinute();
