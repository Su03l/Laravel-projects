<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TechNews - بوابة الأخبار التقنية</title>

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

        .transaction-card:hover {
            transform: translateY(-3px);
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
                        TechNews v1.0
                    </span>
            </div>

            <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                اكتشف عالم التقنية <br/>
                <span class="text-indigo-600 dark:text-indigo-400">بكل شغف واحترافية.</span>
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                منصة TechNews توفر لك أحدث المقالات التقنية، أخبار البرمجة، والذكاء الاصطناعي لحظة بلحظة من أفضل
                الخبراء.
            </p>

            <!-- Stats Section -->
            <div class="grid grid-cols-3 gap-4 mb-10">
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-2xl font-bold text-indigo-600">{{ $stats['users'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">مستخدم</div>
                </div>
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-2xl font-bold text-emerald-500">{{ $stats['articles'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">مقال</div>
                </div>
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-xl font-bold text-amber-500">{{ $stats['categories'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">تخصص تقني</div>
                </div>
            </div>

            <div class="flex flex-wrap gap-4 justify-start">
                <a href="/docs/api#/"
                   class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-all active:scale-95">
                    تصفح الـ API
                </a>

                <a href="https://github.com" target="_blank"
                   class="px-8 py-4 border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    المستودع البرمجي
                </a>
            </div>
        </div>

        <!-- Right Side: Latest Articles -->
        <div
            class="flex-1 bg-gray-50 dark:bg-[#161616] p-8 lg:p-12 flex flex-col border-r border-gray-100 dark:border-white/5">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    آخر المقالات المنشورة
                </h2>
                <span class="text-sm text-gray-500">مباشر</span>
            </div>

            <div class="space-y-4">
                @forelse($latestArticles as $article)
                    <div
                        class="bg-white dark:bg-[#222] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transaction-card flex items-center gap-4">
                        <div
                            class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M14 4v4h4"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M7 8h3M7 12h10M7 16h10"></path>
                            </svg>
                        </div>
                        <div class="flex-1 min-w-0 text-right">
                            <div class="font-bold text-gray-900 dark:text-white text-sm truncate">
                                {{ $article->title }}
                            </div>
                            <div class="text-xs text-gray-500">
                                القسم: {{ $article->category->name }}
                            </div>
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                {{ $article->user->username }}
                            </div>
                            <div class="text-[10px] text-gray-400 whitespace-nowrap">
                                {{ $article->created_at->diffForHumans() }}
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-12">
                        <div class="text-gray-400 mb-2">لا توجد مقالات بعد</div>
                        <p class="text-sm text-gray-500">كن أول من ينشر مقالاً تقنياً!</p>
                    </div>
                @endforelse
            </div>

            <!-- Feature Badges -->
            <div class="mt-auto pt-8 grid grid-cols-2 gap-3">
                <div
                    class="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    محتوى تقني موثوق
                </div>
                <div
                    class="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    تحديثات فورية
                </div>
            </div>
        </div>
    </div>

    <div
        class="bg-gray-50 dark:bg-[#0c0c0c] px-8 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center flex-row-reverse">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">© 2026 TechNews | Tech News Platform</p>
        <div class="flex gap-4">
            <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
    </div>
</div>

</body>

</html>
