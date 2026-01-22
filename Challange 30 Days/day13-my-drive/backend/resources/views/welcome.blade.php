<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>سحابتي - مساحتك الآمنة لتخزين ملفاتك</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>

    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .custom-gradient {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }

        .file-card:hover {
            transform: translateY(-5px);
            transition: all 0.3s ease;
        }
    </style>
</head>

<body class="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen flex items-center justify-center p-4">

<div
    class="max-w-[1200px] w-full bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5">

    <div class="flex flex-col lg:flex-row-reverse">

        <!-- Left Side: Content & Stats -->
        <div class="flex-1 p-8 lg:p-16 flex flex-col justify-center text-right">
            <div class="mb-6">
                    <span
                        class="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 text-sm font-bold rounded-full uppercase tracking-wider">
                        تطبيق سحابتي v1.0
                    </span>
            </div>

            <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                خزن ملفاتك <br/>
                <span class="text-indigo-600 dark:text-indigo-400">بأمان وسهولة.</span>
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                منصة متكاملة لإدارة ملفاتك، تنظيمها في مجلدات، والوصول إليها من أي مكان عبر الـ API الخاص بنا.
            </p>

            <!-- Stats Section -->
            <div class="grid grid-cols-3 gap-4 mb-10">
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-2xl font-bold text-indigo-600">{{ $stats['users'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">مستخدم</div>
                </div>
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-2xl font-bold text-emerald-500">{{ $stats['files'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">ملف</div>
                </div>
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-2xl font-bold text-amber-500">{{ $stats['folders'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">مجلد</div>
                </div>
            </div>

            <div class="flex flex-wrap gap-4 justify-start">
                <a href="/docs/api"
                   class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-all active:scale-95">
                    توثيق الـ API
                </a>

                <a href="https://github.com" target="_blank"
                   class="px-8 py-4 border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    المستودع البرمجي
                </a>
            </div>
        </div>

        <!-- Right Side: Latest Files -->
        <div
            class="flex-1 bg-gray-50 dark:bg-[#161616] p-8 lg:p-12 flex flex-col border-r border-gray-100 dark:border-white/5">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    أحدث الملفات المرفوعة
                </h2>
                <span class="text-sm text-gray-500">تحديث مباشر</span>
            </div>

            <div class="space-y-4">
                @forelse($latestFiles as $file)
                    <div
                        class="bg-white dark:bg-[#222] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 file-card flex items-center gap-4">
                        <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-bold text-gray-900 dark:text-white text-sm truncate">{{ $file->name }}</div>
                            <div class="text-xs text-gray-500 flex items-center gap-2">
                                <span>{{ number_format($file->size / 1024, 2) }} KB</span>
                                <span>•</span>
                                <span>بواسطة {{ $file->user->name }}</span>
                            </div>
                        </div>
                        <div class="text-[10px] text-gray-400 whitespace-nowrap">
                            {{ $file->created_at->diffForHumans() }}
                        </div>
                    </div>
                @empty
                    <div class="text-center py-12">
                        <div class="text-gray-400 mb-2">لا توجد ملفات بعد</div>
                        <p class="text-sm text-gray-500">ابدأ برفع ملفاتك عبر الـ API!</p>
                    </div>
                @endforelse
            </div>

            <!-- Feature Badges -->
            <div class="mt-auto pt-8 grid grid-cols-2 gap-3">
                <div
                    class="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    تشفير آمن
                </div>
                <div
                    class="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    رفع سريع
                </div>
            </div>
        </div>
    </div>

    <div
        class="bg-gray-50 dark:bg-[#0c0c0c] px-8 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center flex-row-reverse">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">© 2026 سحابتي | My Drive Platform</p>
        <div class="flex gap-4">
            <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
    </div>
</div>

</body>

</html>
