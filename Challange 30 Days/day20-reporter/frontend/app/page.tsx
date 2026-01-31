import Link from "next/link";
import { ArrowLeft, Wallet, ShieldCheck, PieChart, Zap, Rocket, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans p-6">
      <main className="flex w-full max-w-5xl flex-col items-center justify-center text-center">

        {/* Hero Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 shadow-sm text-sky-700 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Zap className="h-4 w-4 fill-sky-600" />
          <span>أسرع نظام فواتير في الساحة</span>
        </div>

        {/* Logo Icon */}
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 p-6 shadow-xl shadow-sky-600/20 animate-in zoom-in duration-500">
          <Wallet className="h-16 w-16 text-white" />
        </div>

        {/* Main Title */}
        <h1 className="mb-6 text-4xl font-black tracking-tight text-gray-900 sm:text-6xl leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
          إدر ماليتك بـ <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">احترافية</span>
          <br className="hidden sm:block" /> وبدون وجع راس
        </h1>

        <p className="mb-10 max-w-2xl text-xl text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          تابع فواتيرك، راقب مصاريفك، وخل عينك على أرباحك في مكان واحد.
          نظام رهيب وسهل يخليك تركز في شغلك وتنسى الحسابات.
        </p>

        {/* CTA Button */}
        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          <Link
            href="/dashboard"
            className="group flex items-center justify-center gap-3 rounded-2xl bg-sky-600 px-8 py-5 text-xl font-bold text-white shadow-xl shadow-sky-600/30 transition-all hover:bg-sky-700 hover:scale-[1.02] active:scale-[0.98]"
          >
            ادخل الداشبورد
            <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-8 pt-10 sm:grid-cols-3 border-t border-gray-200 animate-in fade-in duration-1000 delay-300">
          <div className="flex flex-col items-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
            <div className="mb-4 rounded-xl bg-green-100 p-3 text-green-600">
              <Rocket className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">لحظة بلحظة</h3>
            <p className="text-base text-gray-500">تابع فلوسك أول بأول بدون تأخير</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
            <div className="mb-4 rounded-xl bg-blue-100 p-3 text-blue-600">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">أمان عالي</h3>
            <p className="text-base text-gray-500">صلاحيات محددة لكل موظف عندك</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
            <div className="mb-4 rounded-xl bg-purple-100 p-3 text-purple-600">
              <PieChart className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">تقارير جاهزة</h3>
            <p className="text-base text-gray-500">صدر تقارير PDF وإكسل بضغطة زر</p>
          </div>
        </div>
      </main>
    </div>
  );
}
