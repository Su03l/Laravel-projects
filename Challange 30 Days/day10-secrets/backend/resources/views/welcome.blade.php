<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>خزنة الأسرار - احفظ بياناتك بأمان</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet" />

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

            <div class="flex-1 p-8 lg:p-16 flex flex-col justify-center text-right">
                <div class="mb-6">
                    <span
                        class="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 text-sm font-bold rounded-full uppercase tracking-wider">
                        تطبيق الخزنة الآمنة v1.0
                    </span>
                </div>

                <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                    احفظ أسرارك <br />
                    <span class="text-indigo-600 dark:text-indigo-400">بخصوصية تامة وأمان مطلق.</span>
                </h1>

                <p class="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md">
                    يوفر لك تطبيقنا مساحة آمنة ومُشفرة لحفظ ملاحظاتك، معلوماتك الحساسة، وبياناتك الخاصة بعيداً عن المتطفلين وبكل سهولة.
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

            <div
                class="flex-1 bg-gray-50 dark:bg-[#161616] p-8 lg:p-12 flex items-center justify-center border-r border-gray-100 dark:border-white/5">
                <div class="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div
                        class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                        <div
                            class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 flex items-center justify-center">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h3 class="font-bold dark:text-white">تشفير متطور</h3>
                        <p class="text-sm text-gray-500">حماية بياناتك بتقنيات تشفير لا يمكن اختراقها</p>
                    </div>

                    <div
                        class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                        <div
                            class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mb-4 flex items-center justify-center">
                            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                        <h3 class="font-bold dark:text-white">خصوصية مطلقة</h3>
                        <p class="text-sm text-gray-500">بياناتك ملك لك وحدك ولا يمكن لأحد الوصول إليها</p>
                    </div>

                    <div
                        class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                        <div
                            class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg mb-4 flex items-center justify-center">
                            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                            </svg>
                        </div>
                        <h3 class="font-bold dark:text-white">مزامنة آمنة</h3>
                        <p class="text-sm text-gray-500">وصول آمن لأسرارك من جميع أجهزتك في أي وقت</p>
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
                        <h3 class="font-bold dark:text-white">سهولة الاستخدام</h3>
                        <p class="text-sm text-gray-500">واجهة بسيطة وسلسة لإدارة معلوماتك السرية</p>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="bg-gray-50 dark:bg-[#0c0c0c] px-8 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center flex-row-reverse">
            <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">© 2026 خزنة الأسرار | Secrets Vault
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