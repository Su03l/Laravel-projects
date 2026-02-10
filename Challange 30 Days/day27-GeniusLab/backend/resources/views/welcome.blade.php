<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GeniusLab - منصة الذكاء الاصطناعي الشاملة</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .toxic-gradient {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
        }

        .glow-text {
            text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-[#050505] min-h-screen flex items-center justify-center p-4">
<div
    class="max-w-[1000px] w-full bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-green-500/20 p-8 lg:p-16 text-center relative">

    <!-- Background Glow Effect -->
    <div class="absolute top-0 left-0 w-full h-full bg-green-500/5 pointer-events-none"></div>

    <div class="mb-6 relative z-10">
            <span
                class="px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-bold rounded-full uppercase tracking-wider border border-green-200 dark:border-green-500/30">
                GeniusLab AI System v2.0
            </span>
    </div>
    <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight relative z-10">
        ذكاء اصطناعي خارق <br/>
        <span
            class="text-green-500 dark:text-green-400 glow-text">بين يديك الآن.</span>
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto relative z-10">
        منصة متكاملة تجمع أقوى نماذج الذكاء الاصطناعي (GPT-4, Claude, DeepSeek) في مكان واحد. محادثات ذكية، توليد صور، تحليل كود، وتحويل نصوص إلى صوت.
    </p>
    <div class="flex flex-wrap gap-4 justify-center relative z-10">
        <a href="/docs/api" target="_blank"
           class="px-8 py-4 toxic-gradient text-white font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            توثيق الـ API
        </a>
        <a href="#" target="_blank"
           class="px-8 py-4 border-2 border-slate-200 dark:border-green-500/20 text-slate-600 dark:text-green-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-green-500/10 transition-all">
            المستودع البرمجي
        </a>
    </div>
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-right relative z-10">
        <div class="p-6 bg-gray-50 dark:bg-[#111] rounded-2xl border border-transparent dark:border-green-500/10 hover:border-green-500/30 transition-all">
            <div class="text-green-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">محادثات ذكية</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">دردش مع أذكى العقول الرقمية (GPT-4o, Claude 3.5, DeepSeek) مع ذاكرة تحفظ سياق الحديث.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-[#111] rounded-2xl border border-transparent dark:border-green-500/10 hover:border-green-500/30 transition-all">
            <div class="text-green-400 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">إبداع بلا حدود</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">ولد صوراً احترافية باستخدام DALL-E 3، وحول نصوصك إلى صوت بشري واقعي بضغطة زر.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-[#111] rounded-2xl border border-transparent dark:border-green-500/10 hover:border-green-500/30 transition-all">
            <div class="text-green-600 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">مساعد المبرمجين</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">ارفع ملفات الكود الخاصة بك، وسيقوم الذكاء الاصطناعي بتحليلها، اكتشاف الأخطاء، واقتراح التحسينات.</p>
        </div>
    </div>
</div>
</body>
</html>
