<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MediaTools API - أدوات المطورين الذكية</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .custom-gradient {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen flex items-center justify-center p-4">
<div
    class="max-w-[1000px] w-full bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 p-8 lg:p-16 text-center">
    <div class="mb-6">
            <span
                class="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-sm font-bold rounded-full uppercase tracking-wider">
                MediaTools API v1.0
            </span>
    </div>
    <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
        مجموعة أدوات برمجية <br/>
        <span class="text-blue-600 dark:text-blue-400">متكاملة لمشروعك القادم.</span>
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        واجهة برمجية توفر لك أدوات معالجة الصور، توليد الـ QR Code، تحويل العملات الرقمية، والتعامل الذكي مع النصوص والوقت.
    </p>
    <div class="flex flex-wrap gap-4 justify-center">
        <a href="/api/documentation"
           class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:opacity-90 transition-all active:scale-95">
            تصفح الـ API
        </a>
        <a href="https://github.com" target="_blank"
           class="px-8 py-4 border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
            المستودع البرمجي
        </a>
    </div>
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-blue-500/30 transition-all">
            <div class="text-blue-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">توليد QR Code</h3>
            <p class="text-sm text-gray-500">إنشاء رموز استجابة سريعة فورية لأي نص أو رابط بدقة عالية وصيغة SVG خفيفة.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-blue-500/30 transition-all">
            <div class="text-emerald-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">معالجة الصور</h3>
            <p class="text-sm text-gray-500">تغيير أحجام الصور، إضافة العلامات المائية، وتحويل الصيغ برمجياً وبسهولة تامة.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-blue-500/30 transition-all">
            <div class="text-amber-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">بيانات حية</h3>
            <p class="text-sm text-gray-500">جلب أسعار العملات الرقمية (Bitcoin) وتنسيق الوقت والتواريخ باللغة العربية.</p>
        </div>
    </div>
</div>
</body>
</html>
