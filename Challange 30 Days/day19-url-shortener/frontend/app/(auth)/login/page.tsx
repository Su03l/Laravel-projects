'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-t-4 border-t-sky-600 shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">يا هلا ومسهلا!</CardTitle>
                <CardDescription>سجل دخولك عشان تدير روابطك يا بطل</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        دخول
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center text-sm text-slate-600">
                ما عندك حساب؟{' '}
                <Link href="/register" className="mr-1 font-medium text-sky-600 hover:text-sky-500">
                    سجل جديد
                </Link>
            </CardFooter>
        </Card>
    );
}
