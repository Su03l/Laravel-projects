'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { User, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirmation) {
            setError('كلمات المرور ما تتطابق يا غالي');
            return;
        }

        setIsLoading(true);
        try {
            await register(name, email, password);
        } catch (error) {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-t-4 border-t-sky-600 shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">حساب جديد</CardTitle>
                <CardDescription>انضم لنا وابدأ تقصير روابطك باحترافية</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="اسمك الكريم"
                        type="text"
                        placeholder="فلان الفلاني"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="text-right"
                        icon={User}
                    />
                    <Input
                        label="الإيميل"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-right"
                        icon={Mail}
                    />
                    <Input
                        label="كلمة المرور"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="text-right"
                        icon={Lock}
                    />
                    <Input
                        label="تأكيد كلمة المرور"
                        type="password"
                        placeholder="••••••••"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        error={error}
                        className="text-right"
                        icon={Lock}
                    />
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        إنشاء الحساب
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center text-sm text-slate-600">
                عندك حساب من قبل؟{' '}
                <Link href="/login" className="mr-1 font-medium text-sky-600 hover:text-sky-500">
                    تسجيل دخول
                </Link>
            </CardFooter>
        </Card>
    );
}
