'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, Zap, Lock, MessageCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50" dir="rtl">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] bg-sky-200/40 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[100px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold tracking-tighter text-slate-900">لايف شات <span className="text-sky-500">برو</span>.</div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-6 py-2.5 text-slate-600 font-bold hover:text-slate-900 transition-colors">
            دخول
          </Link>
          <Link href="/register" className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hidden sm:block">
            حساب جديد
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-16 pb-32 text-center lg:text-right flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 shadow-sm mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            تحديث جديد: الشات الجماعي وصل!
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
            سواليفك، <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-sky-500 to-blue-600">
              بسرعة البرق.
            </span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
            تطبيق شات عربي، مصمم عشانك. سرعة خيالية، خصوصية تامة، وتصميم يفتح النفس. جربه الحين وما راح تندم.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link href="/register" className="group px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2">
              ابدأ الحين مجاناً
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center">
              الدخول
            </Link>
          </div>

          <div className="pt-8 flex items-center gap-4 text-sm text-slate-400 justify-center lg:justify-start">
            <div className="flex -space-x-3 space-x-reverse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
              ))}
            </div>
            <p>انضم لأكثر من +10,000 مستخدم</p>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="lg:w-1/2 relative"
        >
          <div className="relative z-10 bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-100 rounded-full"></div>
            <div className="bg-slate-50 rounded-[32px] overflow-hidden h-[500px] border border-slate-100 relative">
              {/* Mock Chat UI */}
              <div className="absolute top-0 left-0 w-full p-6 bg-white border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100"></div>
                  <div>
                    <div className="h-2 w-24 bg-slate-800 rounded-full mb-1"></div>
                    <div className="h-2 w-16 bg-slate-300 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 pt-24">
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tr-none shadow-sm border border-slate-100 max-w-[80%]">
                    <p className="text-slate-600 text-xs">السلام عليكم، كيف الحال؟</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-sky-500 p-4 rounded-2xl rounded-tl-none shadow-lg shadow-sky-500/20 max-w-[80%]">
                    <p className="text-white text-xs">وعليكم السلام! الحمدلله بخير، شفت التحديث الجديد؟ 🔥</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tr-none shadow-sm border border-slate-100 max-w-[80%]">
                    <p className="text-slate-600 text-xs">أي والله رهيب! التصميم صار يجيب العافية 😍</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-10 right-10 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-2"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-slate-700">متصل الآن</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">ليش تختار لايف شات؟</h2>
            <p className="text-slate-500">مميزات صممت عشان راحتك وأمانك</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "سرعة صاروخية", desc: "رسايلك توصل قبل ما ترمش عينك. لا تعليق ولا انتظار." },
              { icon: Shield, title: "تشفير كامل", desc: "سواليفك بينك وبين اللي تحب. حتى حنا ما نقدر نشوفها." },
              { icon: Lock, title: "أمان ملفاتك", desc: "نخزن صورك وملفاتك بأحدث تقنيات الحماية العالمية." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-500/5 transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-sky-500 group-hover:text-white transition-colors mb-6 shadow-sm border border-slate-100">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-center text-slate-400">
        <p dir="ltr">&copy; 2024 LiveChat Pro. Crafted within the 30 Days 30 Projects Challenge: LiveChat Pro.</p>
        <p className="text-sm mt-2 opacity-50">صنع بحب ❤️ في الرياض</p>
      </footer>
    </main>
  );
}
