'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-dark overflow-x-hidden">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-brand-blue tracking-tight">PayFlow</h1>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 text-slate-300 hover:text-white transition-colors font-medium">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="px-6 py-2 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform">
            ابدأ الآن
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center md:text-right flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
              أدر أموالك <br />
              <span className="text-brand-blue">بكل ذكاء وأمان</span>
            </h2>
            <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto md:mr-0">
              انقل أموالك في ثوانٍ، تتبع مصروفاتك، واستمتع بتجربة بنكية رقمية لا مثيل لها مع PayFlow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Link href="/register" className="px-10 py-5 bg-brand-blue text-white rounded-2xl font-bold text-lg shadow-2xl shadow-brand-blue/30 flex items-center justify-center gap-3 group">
              <span>افتح حسابك مجاناً</span>
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-10 py-5 glass text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              حول أموالك الآن
            </Link>
          </motion.div>
        </div>

        <div className="flex-1 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10"
          >
            {/* Visual representation of the app/card */}
            <div className="aspect-[4/5] max-w-sm mx-auto card-gradient rounded-[3rem] p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between text-white border-4 border-white/10">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-white/20 rounded-full blur-xl" />
                <div className="text-right">
                  <p className="text-sm opacity-60 font-medium tracking-widest">PAYFLOW PREMIUM</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs opacity-60">الرصيد المتاح</p>
                <h3 className="text-4xl font-black">24,500.00 <span className="text-lg">SAR</span></h3>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] opacity-40 uppercase tracking-widest">صاحب الحساب</p>
                  <p className="text-sm font-bold tracking-wide">أحمد محمد</p>
                </div>
                <div className="w-12 h-8 bg-amber-400 rounded-md shadow-inner" />
              </div>
            </div>
            {/* Decorative background blur */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-blue/30 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-accent/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-brand-bg/50 py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4 flex flex-col items-center p-8 rounded-3xl hover:bg-white/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">أمان فائق</h3>
            <p className="text-slate-400">تشفير متطور وحماية شاملة لكل عملياتك المالية على مدار الساعة.</p>
          </div>
          <div className="space-y-4 flex flex-col items-center p-8 rounded-3xl hover:bg-white/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">تحويل فوري</h3>
            <p className="text-slate-400">أرسل واستقبل الأموال محلياً ودولياً في لحظات وبكل سهولة.</p>
          </div>
          <div className="space-y-4 flex flex-col items-center p-8 rounded-3xl hover:bg-white/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">متوفر دائماً</h3>
            <p className="text-slate-400">تابع أموالك وأدر محفظتك من أي مكان وفي أي وقت عبر جوالك.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-500 border-t border-white/5">
        <p>© 2026 PayFlow. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
