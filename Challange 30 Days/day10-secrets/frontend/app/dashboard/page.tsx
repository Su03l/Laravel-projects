'use client';

import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { User, Mail, AtSign, Calendar, Shield } from 'lucide-react';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
                <div className="h-64 bg-neutral-200 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
                <p className="text-neutral-500 mt-1">Welcome back, {user?.name}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="flex items-center gap-4 py-6">
                        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-neutral-700" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Account Status</p>
                            <p className="text-lg font-semibold text-neutral-900">Active</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 py-6">
                        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-neutral-700" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Username</p>
                            <p className="text-lg font-semibold text-neutral-900">@{user?.username}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 py-6">
                        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-neutral-700" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Member Since</p>
                            <p className="text-lg font-semibold text-neutral-900">
                                {user?.created_at
                                    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal account details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 bg-neutral-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold text-white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-neutral-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Full Name</p>
                                    <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                                    <AtSign className="w-5 h-5 text-neutral-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Username</p>
                                    <p className="text-sm font-medium text-neutral-900">@{user?.username}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:col-span-2">
                                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-neutral-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Email Address</p>
                                    <p className="text-sm font-medium text-neutral-900">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
