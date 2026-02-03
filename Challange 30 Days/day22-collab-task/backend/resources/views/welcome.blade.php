<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CollabTask - نظام إدارة المهام التعاوني</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .custom-gradient {
            background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
            box-shadow: 0 0 15px rgba(14, 165, 233, 0.5);
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen flex items-center justify-center p-4">
<div
    class="max-w-[1000px] w-full bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 p-8 lg:p-16 text-center">
    <div class="mb-6">
            <span
                class="px-4 py-1.5 bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200 text-sm font-bold rounded-full uppercase tracking-wider">
                CollabTask v1.0
            </span>
    </div>
    <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
        أنجز مهامك مع فريقك <br/>
        <span class="text-sky-500 dark:text-sky-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]">بكل سلاسة وفعالية.</span>
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        منصة CollabTask تتيح لك إنشاء مجموعات عمل، توزيع المهام، ومتابعة الإنجاز مع فريقك في مكان واحد وبأدوات تفاعلية متطورة.
    </p>
    <div class="flex flex-wrap gap-4 justify-center">
        <a href="http://127.0.0.1:8000/docs/api#/" target="_blank"
           class="px-8 py-4 custom-gradient text-white font-bold rounded-xl hover:opacity-90 transition-all active:scale-95">
            توثيق الـ API
        </a>
        <a href="https://github.com" target="_blank"
           class="px-8 py-4 border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
            المستودع البرمجي
        </a>
    </div>
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div class="text-sky-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">مجموعات عمل</h3>
            <p class="text-sm text-gray-500">أنشئ مجموعات عمل مخصصة، أضف الأعضاء، وحدد الصلاحيات لكل عضو بسهولة.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div class="text-emerald-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">إدارة المهام</h3>
            <p class="text-sm text-gray-500">أنشئ المهام، حدد الأولويات، وتابع حالة الإنجاز مع إمكانية إضافة المرفقات والتعليقات.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div class="text-amber-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">تفاعل فوري</h3>
            <p class="text-sm text-gray-500">نظام تعليقات ومرفقات متكامل لكل مهمة لضمان التواصل الفعال بين أعضاء الفريق.</p>
        </div>
    </div>
</div>
</body>
</html>
