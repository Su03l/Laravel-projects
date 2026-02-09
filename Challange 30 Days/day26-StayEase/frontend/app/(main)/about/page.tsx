'use client';

import { Building2, Users, Trophy, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h1 className="font-display text-4xl md:text-5xl font-bold">
                        أهلاً بك في StayEase
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        نعيد تعريف مفهوم الضيافة الفاخرة منذ 2024. نحن نؤمن بصنع تجارب لا تُنسى، وليس مجرد إقامة.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-5xl mx-auto">
                    {[
                        { label: 'غرفة وجناح', value: '+50', icon: Building2 },
                        { label: 'ضيف سعيد', value: '+10k', icon: Users },
                        { label: 'جائزة عالمية', value: '15', icon: Trophy },
                        { label: 'تقييم العملاء', value: '4.9', icon: Target },
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center space-y-2">
                            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                            <p className="text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Mission Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="space-y-6 text-right">
                        <h2 className="font-display text-3xl font-bold">مهمتنا</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            في StayEase، نحن ملتزمون بتقديم مستوى استثنائي من الخدمة يفوق توقعات ضيوفنا.
                            مهمتنا هي خلق ملاذ تجتمع فيه الفخامة مع الراحة، لضمان مغادرة كل ضيف بذكريات لا تُنسى.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            من تصاميم غرفنا المختارة بعناية إلى مرافقنا العالمية، يتم اختيار كل تفصيل لتحسين إقامتك.
                            نحن نضع الاستدامة والمشاركة المجتمعية في صميم كل ما نقوم به.
                        </p>
                    </div>
                    <div className="relative h-[400px] rounded-2xl overflow-hidden bg-muted">
                        <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80")' }}
                        />
                    </div>
                </div>

                {/* Values */}
                <div className="mb-16">
                    <h2 className="font-display text-3xl font-bold text-center mb-12">قيمنا الجوهرية</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'التميز',
                                description: 'نسعى للكمال في كل تفصيل من تفاصيل إقامتك.'
                            },
                            {
                                title: 'النزاهة',
                                description: 'الصدق والشفافية هما أساس خدماتنا.'
                            },
                            {
                                title: 'الابتكار',
                                description: 'نتطور باستمرار لتقديم تجارب عصرية وسلسة.'
                            }
                        ].map((val, idx) => (
                            <Card key={idx} className="bg-muted/50 border-none text-right">
                                <CardContent className="p-8 space-y-4">
                                    <h3 className="font-display text-xl font-bold">{val.title}</h3>
                                    <p className="text-muted-foreground">{val.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
