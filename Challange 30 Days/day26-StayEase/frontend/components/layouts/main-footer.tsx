import Link from 'next/link';
import { Building2, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
    explore: [
        { label: 'ابحث عن غرفة', href: '/search' },
        { label: 'العروض الخاصة', href: '/offers' },
        { label: 'المطاعم', href: '/dining' },
        { label: 'السبا والنادي الصحي', href: '/spa' },
    ],
    company: [
        { label: 'من نحن', href: '/about' },
        { label: 'الوظائف', href: '/careers' },
        { label: 'المركز الإعلامي', href: '/press' },
        { label: 'تواصل معنا', href: '/contact' },
    ],
    support: [
        { label: 'مركز المساعدة', href: '/help' },
        { label: 'سياسة الإلغاء', href: '/cancellation' },
        { label: 'شروط الخدمة', href: '/terms' },
        { label: 'سياسة الخصوصية', href: '/privacy' },
    ],
};

export function MainFooter() {
    return (
        <footer className="bg-stone-900 text-stone-300 dark:bg-stone-950">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <Building2 className="h-8 w-8 text-primary" />
                            <span className="font-display text-2xl font-bold text-white">
                                Stay<span className="text-primary">Ease</span>
                            </span>
                        </Link>
                        <p className="text-stone-400 mb-6 max-w-md leading-relaxed text-right">
                            جرب الفخامة التي لا مثيل لها في StayEase. حيث يتم صياغة كل لحظة
                            لراحتك، وكل تفصيل يتحدث عن الأناقة.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-primary transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-primary transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-primary transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Explore Links */}
                    <div>
                        <h3 className="font-display text-lg font-semibold text-white mb-4 text-right">استكشف</h3>
                        <ul className="space-y-3 text-right">
                            {footerLinks.explore.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-display text-lg font-semibold text-white mb-4 text-right">الشركة</h3>
                        <ul className="space-y-3 text-right">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-display text-lg font-semibold text-white mb-4 text-right">تواصل معنا</h3>
                        <ul className="space-y-4 text-right">
                            <li className="flex items-start gap-3 flex-row-reverse">
                                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span className="text-sm">123 شارع الفخامة، وسط المدينة، 12345</span>
                            </li>
                            <li className="flex items-center gap-3 flex-row-reverse">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-sm" dir="ltr">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 flex-row-reverse">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-sm">hello@stayease.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-stone-800" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-stone-500">
                        © {new Date().getFullYear()} StayEase. جميع الحقوق محفوظة.
                    </p>
                    <div className="flex gap-6 text-sm text-stone-500">
                        <Link href="/terms" className="hover:text-stone-300 transition-colors">
                            الشروط والأحكام
                        </Link>
                        <Link href="/privacy" className="hover:text-stone-300 transition-colors">
                            الخصوصية
                        </Link>
                        <Link href="/cookies" className="hover:text-stone-300 transition-colors">
                            ملفات تعريف الارتباط
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
