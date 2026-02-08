<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>StayEase - نظام إدارة الفنادق</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .custom-gradient {
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
            box-shadow: 0 0 15px rgba(79, 70, 229, 0.5);
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen flex items-center justify-center p-4">
<div
    class="max-w-[1000px] w-full bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 p-8 lg:p-16 text-center">
    <div class="mb-6">
            <span
                class="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 text-sm font-bold rounded-full uppercase tracking-wider">
                StayEase Hotel System v1.0
            </span>
    </div>
    <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
        تجربة فندقية فاخرة <br/>
        <span
            class="text-indigo-500 dark:text-indigo-400 drop-shadow-[0_0_10px_rgba(79,70,229,0.3)]">بإدارة ذكية ومتكاملة.</span>
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        نظام شامل لإدارة الفنادق: حجز غرف، خدمات فندقية، إدارة الباقات، نظام ولاء، ولوحة تحكم متقدمة للإدارة والتشغيل.
    </p>
    <div class="flex flex-wrap gap-4 justify-center">
        <a href="http://127.0.0.1:8000/docs/api#/" target="_blank"
           class="px-8 py-4 custom-gradient text-white font-bold rounded-xl hover:opacity-90 transition-all active:scale-95">
            توثيق الـ API
        </a>
        <a href="#" target="_blank"
           class="px-8 py-4 border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
            المستودع البرمجي
        </a>
    </div>
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div class="text-indigo-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">حجوزات ذكية</h3>
            <p class="text-sm text-gray-500">محرك حجز متطور يمنع التعارض، يدعم الباقات المتنوعة، ويحسب الأسعار والخصومات تلقائياً.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div class="text-yellow-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">خدمات ورفاهية</h3>
            <p class="text-sm text-gray-500">نظام طلبات الغرف (Room Service)، تقييمات ومراجعات، وقائمة مفضلة لحفظ الغرف المميزة.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div class="text-green-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">إدارة وتشغيل</h3>
            <p class="text-sm text-gray-500">لوحة تحكم شاملة للأدمن: إحصائيات الأرباح، إدارة الغرف، والتحكم الكامل في الحجوزات.</p>
        </div>
    </div>
</div>
</body>
</html>
