<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>تويتر المصغر - شارك أفكارك مع العالم</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>

    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .custom-gradient {
            background: linear-gradient(135deg, #1d9bf0 0%, #00baff 100%);
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

        <div class="flex-1 p-8 lg:p-16 flex flex-col justify-center text-right">
            <div class="mb-6">
                    <span
                        class="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-sm font-bold rounded-full uppercase tracking-wider">
                        تطبيق تويتر المصغر v1.0
                    </span>
            </div>

            <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                عبر عن نفسك <br/>
                <span class="text-blue-500 dark:text-blue-400">وشارك أفكارك مع الجميع.</span>
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md">
                منصة بسيطة وسريعة تتيح لك مشاركة التغريدات، متابعة الأصدقاء، والتفاعل مع ما يحدث في العالم من حولك بكل
                سهولة.
            </p>

            <div class="flex flex-wrap gap-4 justify-start">
                @if (Route::has('login'))
                    @auth
                        <a href="{{ url('/dashboard') }}"
                           class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:opacity-90 transition-all active:scale-95">
                            لوحة التحكم
                        </a>
                    @else
                        <a href="{{ route('login') }}"
                           class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:opacity-90 transition-all active:scale-95">
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

        <div
            class="flex-1 bg-gray-50 dark:bg-[#161616] p-8 lg:p-12 flex items-center justify-center border-r border-gray-100 dark:border-white/5">
            <div class="grid grid-cols-2 gap-4 w-full max-w-md">
                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                    <div
                        class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">تغريد سريع</h3>
                    <p class="text-sm text-gray-500">انشر أفكارك في لحظات وبكل بساطة</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                    <div
                        class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">مجتمع متفاعل</h3>
                    <p class="text-sm text-gray-500">تواصل مع الآخرين وتابع اهتماماتك</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                    <div
                        class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">تفاعل فوري</h3>
                    <p class="text-sm text-gray-500">أعجب بالتغريدات وشارك في النقاشات</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                    <div
                        class="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">سرعة فائقة</h3>
                    <p class="text-sm text-gray-500">تجربة مستخدم سلسة وسريعة على جميع الأجهزة</p>
                </div>
            </div>
        </div>
    </div>

    <div
        class="bg-gray-50 dark:bg-[#0c0c0c] px-8 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center flex-row-reverse">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">© 2026 تويتر المصغر | Mini Twitter
            Platform</p>
        <div class="flex gap-4">
            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
    </div>
</div>

</body>

</html>
