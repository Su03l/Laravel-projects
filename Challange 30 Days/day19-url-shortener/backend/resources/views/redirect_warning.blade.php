<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>تحذير أمان - Shorty</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=alexandria:400,700&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Alexandria', sans-serif; }
        .glitch { animation: glitch 1s linear infinite; }
        @keyframes glitch {
            2%, 64% { transform: translate(2px, 0) skew(0deg); }
            4%, 60% { transform: translate(-2px, 0) skew(0deg); }
            62% { transform: translate(0, 0) skew(5deg); }
        }
    </style>
</head>
<body class="bg-black text-red-500 min-h-screen flex items-center justify-center p-6 overflow-hidden">
    <div class="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900 via-black to-black"></div>

    <div class="max-w-2xl w-full bg-zinc-950 border-2 border-red-900/50 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(153,27,27,0.2)] relative z-10 text-center">
        <div class="mb-8 inline-block">
            <div class="bg-red-900/20 p-6 rounded-full border border-red-500/30 animate-pulse">
                <svg class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>
        </div>

        <h1 class="text-3xl md:text-5xl font-black mb-6 tracking-tighter glitch">توقف! الرابط قد يكون خطيراً</h1>

        <p class="text-zinc-400 text-lg mb-8 leading-relaxed">
            أنت على وشك مغادرة بيئة <span class="text-white font-bold">Shorty</span> الآمنة. الرابط التالي قد يؤدي إلى محتوى غير معروف أو ضار. نحن لا نتحمل أي مسؤولية عما قد يحدث لجهازك.
        </p>

        <div class="bg-zinc-900 border border-red-900/30 p-4 rounded-xl mb-10 break-all">
            <span class="text-xs uppercase tracking-widest text-zinc-500 block mb-2">الوجهة الخارجية:</span>
            <code class="text-red-400 font-mono text-sm">{{ $url }}</code>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/" class="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all">
                تراجع، عد للأمان
            </a>
            <a href="{{ $url }}" class="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(185,28,28,0.4)] transition-all">
                أنا أتحمل المسؤولية، استمر
            </a>
        </div>

        <div class="mt-12 text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
            Security Protocol Active • Proceed with Caution
        </div>
    </div>
</body>
</html>
