<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Fleet Run - نظام إدارة الأسطول</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .fleet-gradient {
            background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
            box-shadow: 0 0 20px rgba(79, 70, 229, 0.6);
        }

        .glow-text {
            text-shadow: 0 0 10px rgba(79, 70, 229, 0.5);
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-[#050505] min-h-screen flex items-center justify-center p-4">
<div class="max-w-[1000px] w-full bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-indigo-500/20 p-8 lg:p-16 text-center relative">

    <!-- Background Glow Effect -->
    <div class="absolute top-0 left-0 w-full h-full bg-indigo-500/5 pointer-events-none"></div>

    <div class="mb-6 relative z-10">
            <span class="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 text-sm font-bold rounded-full uppercase tracking-wider border border-indigo-200 dark:border-indigo-500/30">
                Fleet Run System v1.0
            </span>
    </div>
    <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight relative z-10">
        نظام إدارة أسطول <br/>
        <span class="text-indigo-500 dark:text-indigo-400 glow-text">ذكي ومتكامل.</span>
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto relative z-10">
        منصة لوجستية متقدمة تجمع بين إدارة الشحنات، تتبع السائقين لحظياً، وإدارة المركبات. مبنية بأحدث تقنيات Laravel 11 و Reverb.
    </p>

    <div class="flex flex-wrap gap-4 justify-center relative z-10 mb-12">
        <a href="/docs/api" target="_blank"
           class="px-8 py-4 fleet-gradient text-white font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            توثيق الـ API
        </a>
        <a href="#" target="_blank"
           class="px-8 py-4 border-2 border-slate-200 dark:border-indigo-500/20 text-slate-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-indigo-500/10 transition-all">
            المستودع البرمجي
        </a>
    </div>

    <!-- Developer Commands Section -->
    <div class="mb-12 relative z-10 text-right bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-indigo-500/10">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            أوامر المطورين (Developer Commands)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center justify-between bg-white dark:bg-black/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <code class="text-sm text-indigo-600 dark:text-indigo-400 font-mono font-bold" dir="ltr">php artisan fleet:simulate</code>
                <span class="text-xs text-gray-500">تشغيل المحاكي</span>
            </div>
            <div class="flex items-center justify-between bg-white dark:bg-black/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <code class="text-sm text-indigo-600 dark:text-indigo-400 font-mono font-bold" dir="ltr">php artisan reverb:start</code>
                <span class="text-xs text-gray-500">تشغيل الويب سوكيت</span>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-right relative z-10">
        <div class="p-6 bg-gray-50 dark:bg-[#111] rounded-2xl border border-transparent dark:border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <div class="text-indigo-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">تتبع لحظي</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">شاهد تحركات الأسطول مباشرة على الخريطة باستخدام تقنيات WebSockets و Laravel Reverb.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-[#111] rounded-2xl border border-transparent dark:border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <div class="text-indigo-400 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">إدارة الأسطول</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">تحكم كامل في المركبات، السائقين، والشحنات. إسناد مهام ذكي وتقارير أداء مفصلة.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-[#111] rounded-2xl border border-transparent dark:border-indigo-500/10 hover:border-indigo-500/30 transition-all">
            <div class="text-indigo-600 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">حماية وأمان</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">نظام مصادقة قوي باستخدام Sanctum، مع توزيع دقيق للصلاحيات (RBAC) بين المدراء والسائقين.</p>
        </div>
    </div>
</div>
</body>
</html>
