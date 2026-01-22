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
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-header">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <HardDrive className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-white">My Cloud</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href ||
                        (item.href === '/dashboard' && pathname.startsWith('/folder'));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="sidebar-footer">
                {user && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                            {user.avatar ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${user.avatar}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-medium text-black">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{user.email}</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="nav-item w-full"
                    style={{ color: isLoading ? undefined : 'var(--text-secondary)' }}
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
