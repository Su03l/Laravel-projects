'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogIn, User as UserIcon, LogOut, PlusSquare } from 'lucide-react';

export default function Navbar() {
    const { user, openLoginModal, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary text-white p-1.5 rounded-lg font-bold text-lg">TN</div>
                        <span className="text-xl font-bold tracking-tight">TechNews</span>
                    </Link>

                    {/* Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-primary font-medium transition-colors">
                            Latest News
                        </Link>
                        <Link href="#" className="text-gray-600 hover:text-primary font-medium transition-colors">
                            Popular
                        </Link>
                    </div>

                    {/* Auth Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    href="/articles/create"
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <PlusSquare className="w-4 h-4" />
                                    Write
                                </Link>

                                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium hidden sm:block leading-none">{user.name}</span>
                                            <Link href="/my-articles" className="text-xs text-gray-500 hover:text-primary mt-1">
                                                My Articles
                                            </Link>
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={openLoginModal}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-all shadow-sm hover:shadow-md"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
