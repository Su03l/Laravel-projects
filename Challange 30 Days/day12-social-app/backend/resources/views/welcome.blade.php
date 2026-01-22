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

        .tweet-card:hover {
            transform: translateX(-5px);
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
                        class="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-sm font-bold rounded-full uppercase tracking-wider">
                        تطبيق تويتر المصغر v1.0
                    </span>
            </div>

            <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                عبر عن نفسك <br/>
                <span class="text-blue-500 dark:text-blue-400">وشارك أفكارك مع الجميع.</span>
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                منصة بسيطة وسريعة تتيح لك مشاركة التغريدات، متابعة الأصدقاء، والتفاعل مع ما يحدث في العالم من حولك بكل
                سهولة عبر الـ API.
            </p>

            <!-- Stats Section -->
            <div class="grid grid-cols-2 gap-4 mb-10 max-w-sm">
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-2xl font-bold text-blue-500">{{ $stats['users'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">مستخدم مسجل</div>
                </div>
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-2xl font-bold text-emerald-500">{{ $stats['tweets'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">تغريدة منشورة</div>
                </div>
            </div>

            <div class="flex flex-wrap gap-4 justify-start">
                <a href="/docs/api"
                   class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:opacity-90 transition-all active:scale-95">
                    ابدأ مع الـ API
                </a>

                <a href="https://github.com" target="_blank"
                   class="px-8 py-4 border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    المستودع البرمجي
                </a>
            </div>
        </div>

        <!-- Right Side: Live Feed -->
        <div
            class="flex-1 bg-gray-50 dark:bg-[#161616] p-8 lg:p-12 flex flex-col border-r border-gray-100 dark:border-white/5">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    آخر التغريدات
                </h2>
                <span class="text-sm text-gray-500">مباشر من القاعدة</span>
            </div>

            <div class="space-y-4">
                @forelse($latestTweets as $tweet)
                    <div class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 tweet-card">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                {{ mb_substr($tweet->user->name, 0, 1) }}
                            </div>
                            <div>
                                <div class="font-bold text-gray-900 dark:text-white text-sm">{{ $tweet->user->name }}</div>
                                <div class="text-xs text-gray-500">@ {{ $tweet->user->username }}</div>
                            </div>
                            <div class="mr-auto text-[10px] text-gray-400">
                                {{ $tweet->created_at->diffForHumans() }}
                            </div>
                        </div>
                        <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {{ $tweet->content }}
                        </p>
                    </div>
                @empty
                    <div class="text-center py-12">
                        <div class="text-gray-400 mb-2">لا توجد تغريدات بعد</div>
                        <p class="text-sm text-gray-500">كن أول من يغرد عبر الـ API!</p>
                    </div>
                @endforelse
            </div>

            <!-- Feature Badges -->
            <div class="mt-auto pt-8 grid grid-cols-2 gap-3">
                <div class="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    Sanctum Auth
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Fast API
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
