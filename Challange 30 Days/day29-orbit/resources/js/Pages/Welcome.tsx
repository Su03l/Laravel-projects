import { Link, Head } from '@inertiajs/react';
import { FolderKanban, CheckCircle, Users, Zap, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Welcome({ auth }: { auth: { user: any } }) {
    return (
        <div className="min-h-screen bg-[#1a1a1a] text-zinc-100 relative overflow-hidden" dir="rtl">
            <Head title="أوربت - إدارة المشاريع بذكاء" />

            {/* Background Effects */}
            <div className="absolute top-[-300px] right-[10%] w-[800px] h-[800px] bg-indigo-600/[0.08] blur-[200px] rounded-full pointer-events-none" />
            <div className="absolute top-[400px] left-[-200px] w-[600px] h-[600px] bg-violet-600/[0.06] blur-[180px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-200px] right-[30%] w-[500px] h-[500px] bg-blue-600/[0.05] blur-[150px] rounded-full pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

            {/* Navbar */}
            <nav className="border-b border-white/[0.06] bg-[#1a1a1a]/80 backdrop-blur-xl fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/10">
                                <FolderKanban className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">أوربت</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/25">
                                        لوحة التحكم
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-zinc-400 hover:text-white font-medium transition-colors text-sm">
                                        تسجيل الدخول
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/25">
                                            ابدأ مجاناً
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>أداة إدارة مشاريع بتجربة عربية فريدة</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.15]">
                    <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">نظم مشاريع فريقك</span>
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">بكل سهولة واحترافية</span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                    أوربت هو الحل الأمثل للفرق العربية لإدارة المهام والمشاريع. واجهة بسيطة، دعم كامل للعربية، وأدوات قوية لزيادة الإنتاجية.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <Link href={route('register')}>
                        <Button size="lg" className="text-base px-8 h-13 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-0 shadow-xl shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40">
                            ابدأ تجربتك المجانية
                            <ArrowLeft className="w-4 h-4 mr-2" />
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="text-base px-8 h-13 border-white/10 text-zinc-300 hover:bg-white/[0.04] hover:text-white hover:border-white/20 transition-all duration-200">
                        شاهد العرض التوضيحي
                    </Button>
                </div>
            </div>

            {/* Features */}
            <div className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent mb-4">لماذا أوربت؟</h2>
                        <p className="text-zinc-500 text-lg">كل ما تحتاجه لإدارة فريقك في مكان واحد</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: FolderKanban,
                                title: 'لوحات كانبان مرنة',
                                desc: 'نظم مهامك باستخدام السحب والإفلات. أنشئ أعمدة مخصصة تناسب سير عمل فريقك.',
                                gradient: 'from-blue-500 to-cyan-500',
                                glow: 'bg-blue-500/10',
                            },
                            {
                                icon: Users,
                                title: 'تعاون لحظي',
                                desc: 'ادعُ فريقك، وزع المهام، وتابع التقدم في الوقت الفعلي. تعليقات ونشاطات لكل مهمة.',
                                gradient: 'from-emerald-500 to-teal-500',
                                glow: 'bg-emerald-500/10',
                            },
                            {
                                icon: Zap,
                                title: 'سرعة فائقة',
                                desc: 'واجهة خفيفة وسريعة الاستجابة، مصممة لتعمل بسلاسة على جميع الأجهزة.',
                                gradient: 'from-violet-500 to-purple-500',
                                glow: 'bg-violet-500/10',
                            },
                        ].map((feature, i) => (
                            <div key={i} className="group relative bg-[#222222]/60 backdrop-blur-sm p-8 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:translate-y-[-2px]">
                                {/* Glow on hover */}
                                <div className={`absolute inset-0 ${feature.glow} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl pointer-events-none`} />
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg ring-1 ring-white/10`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 text-center text-zinc-600">
                    <p>صنع ضمن تحدي 30 يوم 30 مشروع : أوربت</p>
                </div>
            </footer>
        </div>
    );
}
