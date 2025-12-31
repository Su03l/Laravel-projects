<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>نظام إدارة المهام المتطور</title>

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
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
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
                        class="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-[#4f46e5] text-sm font-bold rounded-full uppercase tracking-wider">
                        Task Manager API
                    </span>
            </div>

            <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                أدر مهامك <br/>
                <span class="text-[#4f46e5]">بذكاء واحترافية.</span>
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md">
                واجهة برمجة تطبيقات متكاملة لإدارة المهام وتوزيع الأدوار. صُممت لتناسب فرق العمل التي تبحث عن الكفاءة والأمان في تنظيم سير العمل.
            </p>

            <div class="flex flex-wrap gap-4 justify-start">
                <a href="/docs/api"
                   class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-all active:scale-95">
                    توثيق الـ API
                </a>

                <a href="/api/tasks"
                   class="px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                    استعراض المهام
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
                        class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">إدارة المهام</h3>
                    <p class="text-sm text-gray-500">تنظيم وتتبع الإنجاز</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                    <div
                        class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">نظام الأدوار</h3>
                    <p class="text-sm text-gray-500">صلاحيات مخصصة لكل مستخدم</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                    <div
                        class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">توثيق آمن</h3>
                    <p class="text-sm text-gray-500">حماية البيانات عبر Sanctum</p>
                </div>

                <div
                    class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                    <div
                        class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-4 flex items-center justify-center">
                        <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h3 class="font-bold dark:text-white">تقارير ذكية</h3>
                    <p class="text-sm text-gray-500">تحليل الأداء والإنتاجية</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div
        class="bg-gray-50 dark:bg-[#0c0c0c] px-8 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center flex-row-reverse">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">© 2025 نظام إدارة المهام | Task Manager</p>
        <div class="flex gap-4">
            <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
    </div>
</div>

</body>
</html>
