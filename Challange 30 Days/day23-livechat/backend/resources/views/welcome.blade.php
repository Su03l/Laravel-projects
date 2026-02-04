<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LiveChat - تواصل بلا حدود</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .custom-gradient {
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen flex items-center justify-center p-4">
<div
    class="max-w-[1000px] w-full bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 p-8 lg:p-16 text-center">
    <div class="mb-6">
            <span
                class="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-sm font-bold rounded-full uppercase tracking-wider">
                LiveChat v1.0
            </span>
    </div>
    <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
        تواصل مع من تحب <br/>
        <span
            class="text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">بكل أمان وخصوصية.</span>
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        تطبيق LiveChat يمنحك تجربة محادثة فورية متكاملة، مع ميزات متقدمة مثل المجموعات، قفل المحادثات، ومشاركة الملفات
        بكل سهولة.
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
            <div class="text-emerald-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">مجموعات ومحادثات</h3>
            <p class="text-sm text-gray-500">أنشئ مجموعات للعائلة والأصدقاء، أو تواصل بشكل فردي مع ميزات إدارة متكاملة.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div class="text-blue-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">خصوصية وأمان</h3>
            <p class="text-sm text-gray-500">ميزة قفل المحادثات برمز سري، وإخفاء الرسائل، لضمان بقاء محادثاتك خاصة
                تماماً.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div class="text-purple-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">مشاركة وسائط</h3>
            <p class="text-sm text-gray-500">شارك الصور، الفيديوهات، والملفات بكل سهولة وسرعة مع من تحب.</p>
        </div>
    </div>
</div>
</body>
</html>
