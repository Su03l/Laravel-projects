'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/providers/auth-provider';
import api from '@/lib/axios';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            setIsLoading(true);
            const response = await api.post('/login', { ...data, device_name: 'web' });
            // Backend wraps response: { status, message, data: { user, token } }
            const { token, user } = response.data.data;
            login(token, user);
            toast.success('Welcome back, Commander.');
            window.location.href = '/dashboard';
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed. Verify credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#1a1a1a]">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-black pointer-events-none" />

            <div className="w-full max-w-md p-8 glass-card relative z-10 border border-white/10">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 transform rotate-3">
                        <Truck className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">FleetRun</h1>
                    <p className="text-gray-400 mt-2 text-center">Logistics Command Center</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email Address</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full bg-[#1a1a1a]/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            placeholder="admin@fleetrun.com"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full bg-[#1a1a1a]/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-xs">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            'Access Dashboard'
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Authorized Personnel Only</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
