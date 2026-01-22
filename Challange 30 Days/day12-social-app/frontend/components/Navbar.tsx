'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsOpen(false);
        await logout();
    };

    return (
        <nav className="w-full border-b border-white/20 bg-black sticky top-0 z-40">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                {/* Logo */}
                <Link href="/" className="text-2xl font-black text-white hover:opacity-70 transition-opacity">
                    تغريداتي
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-3">
                    {isLoading ? (
                        <div className="h-8 w-8 animate-pulse bg-white/10"></div>
                    ) : isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            {/* User Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center gap-3 border border-white/20 bg-white/5 px-3 py-2 hover:bg-white/10 transition-colors"
                            >
                                {/* Avatar */}
                                <div className="h-8 w-8 bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                    {user?.username?.[0]?.toUpperCase() || '?'}
                                </div>

                                {/* Name */}
                                <div className="text-right hidden sm:block">
                                    <p className="font-medium text-white text-sm">{user?.name}</p>
                                    <p className="text-xs text-white/50">@{user?.username}</p>
                                </div>

                                {/* Arrow */}
                                <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute left-0 top-full mt-2 w-56 border border-white/20 bg-black z-50">
                                    {/* User Info Header */}
                                    <div className="p-4 border-b border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-blue-500 flex items-center justify-center text-white font-bold">
                                                {user?.username?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{user?.name}</p>
                                                <p className="text-sm text-white/50">@{user?.username}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>لوحة التحكم</span>
                                        </Link>
                                        <Link
                                            href={`/users/${user?.username}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>الملف الشخصي</span>
                                        </Link>
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-white/10 py-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>تسجيل الخروج</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="border border-white/20 px-4 py-2 font-medium text-white transition-colors hover:bg-white/10"
                            >
                                دخول
                            </Link>
                            <Link
                                href="/register"
                                className="bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
                            >
                                تسجيل
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
