'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Shield,
    User
} from 'lucide-react';

const navigation = [
    { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
    { name: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        // Remove middleware cookie
        document.cookie = 'token=; path=/; max-age=0';
        await logout();
    };

    return (
        <aside className="fixed right-0 top-0 h-screen w-64 bg-white border-l border-neutral-200 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-neutral-100">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-neutral-900">مركز الهوية</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
                <ul className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive
                                            ? 'bg-neutral-900 text-white'
                                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                        }
                  `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User section */}
            <div className="p-3 border-t border-neutral-100">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-neutral-50">
                    <div className="w-9 h-9 bg-neutral-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-neutral-500 truncate" dir="ltr">
                            @{user?.username}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="
            w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium text-neutral-600
            hover:bg-red-50 hover:text-red-600
            transition-all duration-200
          "
                >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                </button>
            </div>
        </aside>
    );
}
