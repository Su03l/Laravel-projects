<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>متجر النخبة - وجهتك الأولى للتسوق</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>

    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .custom-gradient {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .product-card:hover {
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
                        class="px-4 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-sm font-bold rounded-full uppercase tracking-wider">
                        متجر النخبة v1.0
                    </span>
            </div>

            <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                تسوق أفضل <br/>
                <span class="text-amber-600 dark:text-amber-400">المنتجات العصرية.</span>
            </h1>

            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                اكتشف تشكيلة واسعة من المنتجات المختارة بعناية لتناسب ذوقك الرفيع، مع تجربة تسوق سهلة وآمنة.
            </p>

            <!-- Stats Section -->
            <div class="grid grid-cols-3 gap-4 mb-10">
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-2xl font-bold text-amber-600">{{ $stats['products'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">منتج</div>
                </div>
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-2xl font-bold text-emerald-500">{{ $stats['categories'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">قسم</div>
                </div>
                <div class="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div class="text-2xl font-bold text-indigo-500">{{ $stats['orders'] }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">طلب ناجح</div>
                </div>
            </div>

            <div class="flex flex-wrap gap-4 justify-start">
                <a href="/api/products"
                   class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:opacity-90 transition-all active:scale-95">
                    تصفح المنتجات
                </a>

                <a href="/docs/api"
                   class="px-8 py-4 border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    توثيق الـ API
                </a>
            </div>
        </div>

        <!-- Right Side: Latest Products -->
        <div
            class="flex-1 bg-gray-50 dark:bg-[#161616] p-8 lg:p-12 flex flex-col border-r border-gray-100 dark:border-white/5">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    أحدث المنتجات المضافة
                </h2>
                <span class="text-sm text-gray-500">وصل حديثاً</span>
            </div>

            <div class="space-y-4">
                @forelse($latestProducts as $product)
                    <div
                        class="bg-white dark:bg-[#222] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 product-card flex items-center gap-4">
                        <div class="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 overflow-hidden">
                            @if($product->image)
                                <img src="{{ asset('storage/' . $product->image) }}" alt="{{ $product->name }}" class="w-full h-full object-cover">
                            @else
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                            @endif
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-bold text-gray-900 dark:text-white text-sm truncate">{{ $product->name }}</div>
                            <div class="text-xs text-gray-500 flex items-center gap-2">
                                <span class="text-amber-600 font-bold">{{ $product->price }} ر.س</span>
                                <span>•</span>
                                <span>{{ $product->category->name }}</span>
                            </div>
                        </div>
                        <div class="text-[10px] text-gray-400 whitespace-nowrap">
                            {{ $product->created_at->diffForHumans() }}
                        </div>
                    </div>
                @empty
                    <div class="text-center py-12">
                        <div class="text-gray-400 mb-2">لا توجد منتجات بعد</div>
                        <p class="text-sm text-gray-500">سيتم إضافة منتجات رائعة قريباً!</p>
                    </div>
                @endforelse
            </div>

            <!-- Feature Badges -->
            <div class="mt-auto pt-8 grid grid-cols-2 gap-3">
                <div
                    class="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                    <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    ضمان الجودة
                </div>
                <div
                    class="flex items-center gap-2 text-xs text-gray-500 bg-white dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                    دفع آمن
                </div>
            </div>
        </div>
    </div>

    <div
        class="bg-gray-50 dark:bg-[#0c0c0c] px-8 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center flex-row-reverse">
        <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">© 2026 متجر النخبة | Elite Store Platform</p>
        <div class="flex gap-4">
            <div class="w-2 h-2 rounded-full bg-amber-500"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
    </div>
</div>

</body>

</html>
