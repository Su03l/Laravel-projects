<!DOCTYPE html>
<html lang="ar" dir="rtl" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'أوربت') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead

        <style>
            body { font-family: 'Cairo', sans-serif; }
            /* Custom Scrollbar for Dark Mode */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: #09090b;
            }
            ::-webkit-scrollbar-thumb {
                background: #27272a;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #3f3f46;
            }
        </style>
    </head>
    <body class="font-sans antialiased bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30">
        @inertia
    </body>
</html>
