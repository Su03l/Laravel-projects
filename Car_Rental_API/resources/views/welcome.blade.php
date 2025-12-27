<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        <!-- Styles -->
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] flex items-center justify-center min-h-screen">
        <div class="text-center">
            <a href="http://127.0.0.1:8000/docs/api#/" class="inline-block px-8 py-4 bg-[#f53003] text-white rounded-xl font-bold text-xl shadow-lg hover:bg-[#d42a02] transition-all transform hover:scale-105">
                Go to API Documentation
            </a>
        </div>
    </body>
</html>
