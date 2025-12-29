<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'HR Reports API') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700&display=swap" rel="stylesheet"/>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        body {
            font-family: 'Instrument Sans', sans-serif;
        }

        .custom-gradient {
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        }

        .card-hover:hover {
            transform: translateY(-5px);
            transition: all 0.3s ease;
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen flex items-center justify-center p-4">

<div
    class="max-w-[1200px] w-full bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5">

    <div class="flex flex-col lg:flex-row">

        <!-- Left Section: Content -->
        <div class="flex-1 p-8 lg:p-16 flex flex-col justify-center">
            <div class="mb-6">
                    <span
                        class="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#2563eb] text-sm font-bold rounded-full uppercase tracking-wider">
                        HR Reports API
                    </span>
            </div>

            <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                Manage your <br/>
                <span class="text-[#2563eb]">workforce.</span>
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md">
                Access a comprehensive database of employees and HR reports. Our API provides seamless integration for employee management and reporting.
            </p>

            <div class="flex flex-wrap gap-4">
                <a href="/docs/api"
                   class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:opacity-90 transition-all active:scale-95">
                    API Documentation
                </a>

                <a href="/api/employees"
                   class="px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                    Explore API
                </a>
            </div>
        </div>

        <!-- Right Section: Visual -->
        <div
            class="flex-1 bg-gray-50 dark:bg-[#161616] p-8 lg:p-12 flex items-center justify-center border-l border-gray-100 dark:border-white/5">
            <div class="grid grid-cols-2 gap-4 w-full max-w-md">
                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                    <div
                        class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">Employees</h3>
                    <p class="text-sm text-gray-500">Staff Management</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                    <div
                        class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">Reports</h3>
                    <p class="text-sm text-gray-500">Detailed Analytics</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                    <div
                        class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">Departments</h3>
                    <p class="text-sm text-gray-500">Org Structure</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                    <div
                        class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">Secure API</h3>
                    <p class="text-sm text-gray-500">Fast & Reliable</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div
        class="bg-gray-50 dark:bg-[#0c0c0c] px-8 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">© 2025 HR Reports API System</p>
        <div class="flex gap-4">
            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
    </div>
</div>

</body>
</html>
