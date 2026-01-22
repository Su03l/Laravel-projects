'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    Cloud,
    User,
    LogOut,
    HardDrive,
    Loader2
} from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'My Cloud', icon: Cloud },
    { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
    const { user, logout, isLoading } = useAuth();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <aside className="w-64 h-screen bg-[var(--background-secondary)] border-r border-[var(--border)] flex flex-col fixed left-0 top-0">
            {/* Logo */}
            <div className="p-6 border-b border-[var(--border)]">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="p-2 bg-[var(--primary-light)] rounded-lg group-hover:bg-[var(--primary)] transition-colors">
                        <HardDrive className="w-6 h-6 text-[var(--primary)] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-lg font-semibold text-[var(--foreground)]">
                        My Cloud
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href ||
                        (item.href === '/dashboard' && pathname.startsWith('/folder'));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                                    : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-[var(--border)]">
                {user && (
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--foreground)] truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-[var(--foreground-secondary)] truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--danger)] transition-all disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <LogOut className="w-5 h-5" />
                    )}
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
