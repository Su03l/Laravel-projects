<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>نظام المصادقة المتقدم - Auth System</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,500,600,700&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Alexandria', sans-serif;
        }

        .custom-gradient {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen flex items-center justify-center p-4">
<div
    class="max-w-[1000px] w-full bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 p-8 lg:p-16 text-center">
    <div class="mb-6">
            <span
                class="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-sm font-bold rounded-full uppercase tracking-wider">
                Auth System v1.0
            </span>
    </div>
    <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
        نظام مصادقة متكامل <br/>
        <span
            class="text-blue-500 dark:text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">لإدارة المستخدمين بأمان.</span>
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        نظام متطور لإدارة المصادقة، يتيح التسجيل عبر OTP، إدارة الملف الشخصي، ولوحة تحكم للأدمن لإدارة المستخدمين وحظر المخالفين.
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
            <div class="text-blue-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">أمان عالي</h3>
            <p class="text-sm text-gray-500">تسجيل دخول آمن باستخدام OTP، وتشفير كلمات المرور، وحماية المسارات باستخدام Sanctum.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div class="text-red-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">إدارة الملف الشخصي</h3>
            <p class="text-sm text-gray-500">إمكانية تحديث البيانات الشخصية، تغيير كلمة المرور، ورفع صورة شخصية بسهولة.</p>
        </div>
        <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div class="text-purple-500 mb-4 flex justify-center md:justify-start">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">لوحة تحكم الأدمن</h3>
            <p class="text-sm text-gray-500">صلاحيات كاملة للأدمن لإدارة المستخدمين، حظر الحسابات المخالفة، وحذف المحتوى غير اللائق.</p>
        </div>
    </div>
</div>
</body>
</html>
