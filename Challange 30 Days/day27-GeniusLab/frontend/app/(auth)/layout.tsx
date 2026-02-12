"use client"

import { Brain, Sparkles } from "lucide-react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex bg-background grid-pattern noise-overlay relative overflow-hidden">
            {/* Animated orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-[#39ff14] rounded-full opacity-[0.03] blur-[150px] animate-float" />
                <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-[#00d4ff] rounded-full opacity-[0.03] blur-[150px] animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-[#a855f7] rounded-full opacity-[0.02] blur-[150px] animate-float" style={{ animationDelay: '4s' }} />
            </div>

            {/* Left side — Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <div className="relative z-10 max-w-md text-center space-y-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/20 glow-green mx-auto">
                        <Brain className="w-10 h-10 text-[#39ff14]" />
                    </div>
                    <h1 className="text-5xl font-bold">
                        Genius<span className="text-[#39ff14] text-glow-green">Lab</span>
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed">
                        منصة الذكاء الاصطناعي الأقوى.
                        <br />
                        اكتب، حلل، صمم، وابتكر.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#39ff14]" />
                            <span>+10 نماذج ذكاء</span>
                        </div>
                        <div className="w-px h-4 bg-zinc-700" />
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#00d4ff]" />
                            <span>بث مباشر</span>
                        </div>
                        <div className="w-px h-4 bg-zinc-700" />
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#a855f7]" />
                            <span>24/7</span>
                        </div>
                    </div>
                </div>
                {/* Gradient line separator */}
                <div className="absolute left-0 top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-[#39ff14]/20 to-transparent" />
            </div>

            {/* Right side — Form */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    )
}
