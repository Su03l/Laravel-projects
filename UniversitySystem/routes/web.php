<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {

    return "
    <div style='text-align: center; padding-top: 50px; font-family: sans-serif;'>
        <h1>University System API is Running 🚀</h1>
        <p>Status: Connected </p>
        <br>

        <a href='/docs/api' style='
            background-color: #4F46E5;
            color: white;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
        '>
            📄 Go to API Documentation
        </a>
    </div>
    ";
});
