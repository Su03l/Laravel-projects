<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>مدير المهام - منصة إدارة المشاريع الذكية</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .custom-gradient {
            background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
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

    <div class="flex flex-col lg:flex-row-reverse">

        <!-- Left Section: Content -->
        <div class="flex-1 p-8 lg:p-16 flex flex-col justify-center text-right">
            <div class="mb-6">
                    <span
                        class="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 text-sm font-bold rounded-full uppercase tracking-wider">
                        نظام إدارة المهام v1.0
                    </span>
            </div>

            <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                أنجز مهامك <br/>
                <span class="text-indigo-600 dark:text-indigo-400">بكل كفاءة وتنظيم.</span>
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md">
                منصة "مدير المهام" توفر لك تجربة فريدة لتنظيم أعمالك ومتابعة مشاريعك. سواء كنت تعمل بشكل مستقل أو ضمن
                فريق، نحن نوفر لك الأدوات اللازمة للنجاح.
            </p>

            <div class="flex flex-wrap gap-4 justify-start">
                @if (Route::has('login'))
                    @auth
                        <a href="{{ url('/dashboard') }}"
                           class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-slate-500/30 hover:opacity-90 transition-all active:scale-95">
                            لوحة التحكم
                        </a>
                    @else
                        <a href="{{ route('login') }}"
                           class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-slate-500/30 hover:opacity-90 transition-all active:scale-95">
                            تسجيل الدخول
                        </a>

                        @if (Route::has('register'))
                            <a href="{{ route('register') }}"
                               class="px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                                إنشاء حساب
                            </a>
                        @endif
                    @endauth
                @endif

                <a href="/docs/api"
                   class="px-8 py-4 border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    توثيق الـ API
                </a>
            </div>
        </div>

        <!-- Right Section: Visual -->
        <div
            class="flex-1 bg-gray-50 dark:bg-[#161616] p-8 lg:p-12 flex items-center justify-center border-r border-gray-100 dark:border-white/5">
            <div class="grid grid-cols-2 gap-4 w-full max-w-md">
                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                    <div
                        class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">إدارة المشاريع</h3>
                    <p class="text-sm text-gray-500">تنظيم المهام وتوزيعها على المشاريع</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                    <div
                        class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">تتبع الوقت</h3>
                    <p class="text-sm text-gray-500">مراقبة المواعيد النهائية والإنجاز</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                    <div
                        class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">تعاون الفريق</h3>
                    <p class="text-sm text-gray-500">العمل المشترك وتوزيع الأدوار</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                    <div
                        class="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">تقارير الإنجاز</h3>
                    <p class="text-sm text-gray-500">تحليلات دقيقة لمستوى الإنتاجية</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div
        class="bg-gray-50 dark:bg-[#0c0c0c] px-8 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center flex-row-reverse">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">© 2026 مدير المهام | Task Manager
            Platform</p>
        <div class="flex gap-4">
            <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
    </div>
</div>

</body>
</html>
