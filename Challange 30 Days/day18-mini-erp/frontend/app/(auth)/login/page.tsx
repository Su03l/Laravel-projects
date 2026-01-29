'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/login', { email, password });
            // Assuming API returns { token: '...', user: { ... } }
            // Adjust based on actual API response structure if needed
            const { token, user } = response.data;

            // If the API structure is different (e.g. data.token), adjust here.
            // Common Laravel Sanctum pattern: return token string or object.
            // I'll assume standard { token, user } response for now.

            login(token, user || { id: 1, name: 'User', email }); // Fallback user if not provided
            toast.success('Login Successful');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Sign In</h1>
                    <p className="text-slate-500 mt-2">Welcome back to Mini-ERP</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-3 text-lg shadow-sky-200 shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
