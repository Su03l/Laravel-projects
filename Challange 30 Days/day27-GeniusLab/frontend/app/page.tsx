"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Brain, Zap, Sparkles, MessageSquare, Image, Code,
  FileText, AudioLines, ArrowLeft, Shield, Globe, Cpu
} from "lucide-react"
import { Button } from "@/components/ui/button"

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  })
}

const features = [
  { icon: MessageSquare, title: "محادثات ذكية", desc: "حوارات طبيعية مع نماذج ذكاء متعددة", color: "#39ff14" },
  { icon: Image, title: "توليد الصور", desc: "أنشئ صور احترافية من وصف نصي", color: "#00d4ff" },
  { icon: Code, title: "تحليل الأكواد", desc: "مراجعة وتحسين وشرح الأكواد البرمجية", color: "#a855f7" },
  { icon: FileText, title: "قوالب جاهزة", desc: "قوالب ذكية لمختلف المهام والمحتوى", color: "#ff2d87" },
  { icon: AudioLines, title: "تحويل صوتي", desc: "تحويل النصوص إلى كلام طبيعي", color: "#f59e0b" },
  { icon: Shield, title: "أمان عالي", desc: "حماية بياناتك بمصادقة ثنائية وتشفير", color: "#10b981" },
]

const stats = [
  { value: "10+", label: "نموذج ذكاء" },
  { value: "50K+", label: "طلب يومياً" },
  { value: "99.9%", label: "وقت التشغيل" },
  { value: "24/7", label: "دعم فني" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background grid-pattern noise-overlay relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] right-[20%] w-[600px] h-[600px] bg-[#39ff14] rounded-full opacity-[0.04] blur-[180px] animate-float" />
        <div className="absolute bottom-[20%] left-[5%] w-[500px] h-[500px] bg-[#00d4ff] rounded-full opacity-[0.03] blur-[150px] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-[#a855f7] rounded-full opacity-[0.03] blur-[150px] animate-float" style={{ animationDelay: "5s" }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/20">
              <Brain className="h-5 w-5 text-[#39ff14]" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Genius<span className="text-[#39ff14]">Lab</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-zinc-400 hover:text-white" asChild>
              <Link href="/login">دخول</Link>
            </Button>
            <Button className="bg-[#39ff14] text-black font-bold hover:bg-[#39ff14]/80 glow-green" asChild>
              <Link href="/register">
                ابدأ مجاناً
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          className="text-center max-w-4xl mx-auto space-y-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={0}
        >
          {/* Badge */}
          <motion.div variants={fadeIn} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#39ff14]/20 text-sm">
            <Sparkles className="h-4 w-4 text-[#39ff14]" />
            <span className="text-zinc-400">مدعوم بأحدث نماذج الذكاء الاصطناعي</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={fadeIn} custom={1} className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-white">قوة الذكاء الاصطناعي</span>
            <br />
            <span className="gradient-text text-glow-green">في متناول يدك</span>
          </motion.h1>

          <motion.p variants={fadeIn} custom={2} className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            اكتب، حلل، صمم، وأنشئ محتوى احترافي باستخدام أقوى نماذج الذكاء الاصطناعي في العالم — كل ذلك من منصة واحدة.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeIn} custom={3} className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" className="h-14 px-8 bg-[#39ff14] text-black font-bold text-lg hover:bg-[#39ff14]/80 glow-green-strong" asChild>
              <Link href="/register">
                ابدأ مجاناً
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 border-zinc-700 text-lg hover:border-[#39ff14]/40 hover:text-[#39ff14]" asChild>
              <Link href="/login">
                <Globe className="ml-2 h-5 w-5" />
                جرّب الآن
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={4}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeIn} custom={4 + i} className="text-center glass rounded-xl p-6 hover-card-glow">
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39ff14]/5 border border-[#39ff14]/10 text-sm text-[#39ff14] mb-4">
              <Cpu className="h-3 w-3" />
              المميزات
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">كل ما تحتاجه في <span className="gradient-text">منصة واحدة</span></h2>
            <p className="text-zinc-500 text-lg">أدوات ذكاء اصطناعي متقدمة لكل مهامك</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass rounded-2xl p-8 hover-card-glow cursor-default"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden glow-green"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/20 mb-8">
                <Zap className="w-8 h-8 text-[#39ff14]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                جاهز تبدأ <span className="gradient-text">رحلتك</span>?
              </h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
                انضم إلى آلاف المستخدمين واستفد من أقوى أدوات الذكاء الاصطناعي
              </p>
              <Button size="lg" className="h-14 px-10 bg-[#39ff14] text-black font-bold text-lg hover:bg-[#39ff14]/80 glow-green-strong" asChild>
                <Link href="/register">
                  أنشئ حسابك المجاني
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#39ff14]" />
            <span>GeniusLab</span>
          </div>
          <span>© {new Date().getFullYear()} جميع الحقوق محفوظة</span>
        </div>
      </footer>
    </div>
  )
}
