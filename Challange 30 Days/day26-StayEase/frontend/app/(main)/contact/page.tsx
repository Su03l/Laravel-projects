'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useContact } from '@/lib/api-hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const contactSchema = z.object({
    name: z.string().min(2, 'الاسم مطلوب'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    subject: z.string().min(5, 'الموضوع مطلوب'),
    message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const { mutate: sendMessage, isPending } = useContact();

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = (data: ContactFormData) => {
        sendMessage(data, {
            onSuccess: () => {
                toast.success('تم إرسال رسالتك بنجاح! سنعود إليك قريباً.');
                form.reset();
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.');
            }
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="font-display text-4xl md:text-5xl font-bold">
                        تواصل معنا
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        لديك استفسار حول إقامتك أو تحتاج مساعدة في التخطيط لزيارتك؟
                        فريقنا موجود للمساعدة.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <Card>
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">الهاتف</h3>
                                        <p className="text-muted-foreground text-center" dir="ltr">+1 (555) 123-4567</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">البريد الإلكتروني</h3>
                                        <p className="text-muted-foreground">concierge@stayease.com</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardContent className="p-6 flex items-start space-x-4 flex-row-reverse">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 ml-4">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div className="text-right">
                                    <h3 className="font-semibold mb-2">الموقع</h3>
                                    <p className="text-muted-foreground">
                                        123 شارع الفخامة،<br />
                                        حي الفردوس،<br />
                                        الرياض، المملكة العربية السعودية
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Map Placeholder */}
                        <div className="w-full h-[300px] bg-muted rounded-xl relative overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116035.53457196652!2d46.602263884877395!3d24.72517614044733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1707500000000!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card>
                        <CardHeader className="text-right">
                            <CardTitle>أرسل لنا رسالة</CardTitle>
                            <CardDescription>
                                املأ النموذج أدناه وسنعود إليك خلال 24 ساعة.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-right">
                                <div className="space-y-2">
                                    <Label htmlFor="name">الاسم الكامل</Label>
                                    <Input
                                        id="name"
                                        placeholder="محمد العلي"
                                        className="text-right"
                                        {...form.register('name')}
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">البريد الإلكتروني</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="mohammed@example.com"
                                        className="text-right"
                                        {...form.register('email')}
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">الموضوع</Label>
                                    <Input
                                        id="subject"
                                        placeholder="استفسار بخصوص..."
                                        className="text-right"
                                        {...form.register('subject')}
                                    />
                                    {form.formState.errors.subject && (
                                        <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">الرسالة</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="كيف يمكننا مساعدتك؟"
                                        className="min-h-[150px] text-right"
                                        {...form.register('message')}
                                    />
                                    {form.formState.errors.message && (
                                        <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                            جاري الإرسال...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="ml-2 h-4 w-4" />
                                            إرسال الرسالة
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
