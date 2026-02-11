import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { Play, ArrowLeft, Star, Users, Award, CheckCircle2 } from 'lucide-react';

export default function Home() {
    return (
        <GuestLayout>
            <Head title="مرحباً بك في إديوكور" />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-right">
                            <div className="inline-flex items-center gap-2 bg-zinc-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-zinc-200">
                                <span className="flex h-2 w-2 rounded-full bg-[#00D1FF] animate-pulse"></span>
                                دورات جديدة متاحة الآن
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black leading-[1.2] mb-6">
                                اتقن مهارات <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-l from-black via-zinc-700 to-[#00D1FF]">
                                    المستقبل اليوم
                                </span>
                            </h1>
                            <p className="text-lg text-zinc-600 mb-8 max-w-lg leading-relaxed font-medium">
                                انضم إلى أكثر من 12,000 طالب يتعلمون من خبراء الصناعة. دورات فيديو عالية الجودة مصممة لتأخذك من الصفر إلى الاحتراف.
                            </p>
                            <div className="flex flex-col sm:flex-row-reverse gap-4 justify-start">
                                <Link
                                    href="/browse"
                                    className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all group"
                                >
                                    استكشف الدورات
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                </Link>
                                <button className="bg-white text-black border-2 border-zinc-200 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all">
                                    <Play className="w-5 h-5 fill-current" />
                                    شاهد العرض
                                </button>
                            </div>

                            <div className="mt-10 flex items-center justify-start gap-4 flex-row-reverse">
                                <div className="flex -space-x-3 space-x-reverse">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 justify-end">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#00D1FF] text-[#00D1FF]" />)}
                                        <span className="font-bold mr-1">4.9/5</span>
                                    </div>
                                    <p className="text-zinc-500 text-xs font-bold">من أكثر من 2,000 تقييم</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#00D1FF]/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-zinc-200/50 rounded-full blur-3xl"></div>

                            <div className="relative bg-zinc-900 rounded-3xl p-4 shadow-2xl transform lg:-rotate-3 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Learning Platform"
                                    className="rounded-2xl w-full h-auto grayscale-[0.2] hover:grayscale-0 transition-all"
                                />
                                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 hidden sm:block">
                                    <div className="flex items-center gap-3 flex-row-reverse">
                                        <div className="bg-[#00D1FF]/20 p-2 rounded-lg">
                                            <CheckCircle2 className="w-6 h-6 text-[#00D1FF]" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">تقدم الدورة</p>
                                            <p className="text-sm font-black">تم إكمال 85%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-zinc-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4">لماذا تختار إديوكور؟</h2>
                        <p className="text-zinc-500 font-bold">نحن نوفر أفضل الأدوات لرحلتك التعليمية.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Users className="w-8 h-8" />, title: "مدربون خبراء", desc: "تعلم من محترفين لديهم سنوات من الخبرة الحقيقية في المجال." },
                            { icon: <Play className="w-8 h-8" />, title: "وصول مدى الحياة", desc: "اشترِ مرة واحدة، وتعلم للأبد. ادخل إلى دوراتك في أي وقت ومن أي مكان." },
                            { icon: <Award className="w-8 h-8" />, title: "شهادات معتمدة", desc: "احصل على تقدير لعملك الشاق من خلال شهادات معترف بها في الصناعة." }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-zinc-100 hover:border-[#00D1FF] transition-colors group text-right">
                                <div className="bg-black text-[#00D1FF] w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_15px_rgba(0,209,255,0.3)] transition-all mr-0 ml-auto">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
