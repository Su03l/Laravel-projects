'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-10 w-96 h-96 bg-sky-200 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 -left-20 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter">LiveChat<span className="text-sky-500">Pro</span>.</div>
        <Link href="/login" className="px-6 py-2.5 rounded-full bg-slate-950 text-white font-medium hover:bg-slate-800 transition-colors">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-950 mb-6">
            Connect Instantly.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
              Securely.
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the future of communication. Fast, encrypted, and beautifully designed for the modern web.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="group relative px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-sky-500/25 flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-8 py-4 text-slate-600 font-medium hover:text-slate-900 transition-colors">
              Access Web
            </Link>
          </div>
        </motion.div>

        {/* Floating Chat Bubbles Mockup */}
        <div className="mt-20 relative max-w-4xl mx-auto h-[400px] hidden md:block">
          {/* Mockup Elements using Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-10 left-10 bg-white p-4 rounded-[24px] rounded-bl-sm shadow-xl border border-slate-100 flex items-center gap-3 z-20"
          >
            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">👋</div>
            <div>
              <div className="h-2 w-24 bg-slate-200 rounded-full mb-2"></div>
              <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute top-32 right-20 bg-sky-500 p-4 rounded-[24px] rounded-br-sm shadow-xl shadow-sky-500/20 text-white z-20"
          >
            <p className="text-sm font-medium">Ready for the demo?</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white backdrop-blur-sm z-10 rounded-3xl border border-white/50"
          >
            {/* Glass panel effect */}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Real-time message delivery with sub-millisecond latency." },
              { icon: Shield, title: "End-to-End Encrypted", desc: "Your privacy is our priority. Messages are secure by default." },
              { icon: Lock, title: "Secure Storage", desc: "Enterprise-grade security for all your media and files." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center text-slate-400">
        <p>&copy; 2024 LiveChat Pro. Crafted with ❤️.</p>
      </footer>
    </main>
  );
}
