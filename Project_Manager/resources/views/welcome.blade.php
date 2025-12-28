<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700&display=swap" rel="stylesheet" />

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        body { font-family: 'Instrument Sans', sans-serif; }

        /* يمكنك تغيير ألوان التدرج هنا */
        .custom-gradient {
            background: linear-gradient(135deg, #f53003 0%, #fe8c00 100%);
        }

        .card-hover:hover {
            transform: translateY(-5px);
            transition: all 0.3s ease;
        }
    </style>
</head>
<body class="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen flex items-center justify-center p-4">

    <!-- الحاوية الرئيسية بعرض 1200 بكسل -->
    <div class="max-w-[1200px] w-full bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5">

        <div class="flex flex-col lg:flex-row">

            <!-- القسم الأيسر: المحتوى النصي -->
            <div class="flex-1 p-8 lg:p-16 flex flex-col justify-center">
                <div class="mb-6">
                    <span class="px-4 py-1.5 bg-red-50 dark:bg-red-900/20 text-[#f53003] text-sm font-bold rounded-full uppercase tracking-wider">
                        Project Management Tool
                    </span>
                </div>

                <h1 class="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                    Organize your work <br/>
                    <span class="text-[#f53003]">efficiently.</span>
                </h1>

                <p class="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-md">
                    Manage your projects, track tasks, and keep your notes all in one place. Simple, fast, and secure.
                </p>

                <div class="flex flex-wrap gap-4">
                    <!-- زر التوثيق - يمكنك تغيير اللون هنا -->
                    <a href="http://127.0.0.1:8000/docs/api#/"
                       class="px-8 py-4 custom-gradient text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:opacity-90 transition-all active:scale-95">
                        API Documentation
                    </a>

                    <a href="#" class="px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                        Explore Features
                    </a>
                </div>
            </div>

            <!-- القسم الأيمن: عرض مرئي (Visual) -->
            <div class="flex-1 bg-gray-50 dark:bg-[#161616] p-8 lg:p-12 flex items-center justify-center border-l border-gray-100 dark:border-white/5">
                <div class="grid grid-cols-2 gap-4 w-full max-w-md">
                    <!-- بطاقات توضيحية سهلة التعديل -->
                    <div class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 flex items-center justify-center">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"></path></svg>
                        </div>
                        <h3 class="font-bold dark:text-white">Projects</h3>
                        <p class="text-sm text-gray-500">Track all projects</p>
                    </div>

                    <div class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                        <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4 flex items-center justify-center">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 class="font-bold dark:text-white">Tasks</h3>
                        <p class="text-sm text-gray-500">Manage daily tasks</p>
                    </div>

                    <div class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover">
                        <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4 flex items-center justify-center">
                            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </div>
                        <h3 class="font-bold dark:text-white">Notes</h3>
                        <p class="text-sm text-gray-500">Quick thoughts</p>
                    </div>

                    <div class="bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 card-hover mt-8">
                        <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-4 flex items-center justify-center">
                            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h3 class="font-bold dark:text-white">Security</h3>
                        <p class="text-sm text-gray-500">Safe & Secure</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- شريط سفلي بسيط -->
        <div class="bg-gray-50 dark:bg-[#0c0c0c] px-8 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
            <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">© 2024 Project Manager System</p>
            <div class="flex gap-4">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>
        </div>
    </div>

</body>
</html>
