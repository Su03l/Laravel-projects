'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Home, User, LogOut, LogIn } from 'lucide-react';

export default function Sidebar() {
    const { isAuthenticated, user, logout, isLoading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        showToast('تم تسجيل الخروج بنجاح', 'success');
        router.push('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-content">
                <Link href="/" className="logo">
                    <span className="logo-text">MT</span>
                </Link>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <Link href="/" className="nav-item">
                        <Home size={26} />
                        <span>Home</span>
                    </Link>

                    {isAuthenticated && (
                        <Link href="/profile" className="nav-item">
                            <User size={26} />
                            <span>Profile</span>
                        </Link>
                    )}
                </nav>

                {/* Auth Actions */}
                <div className="sidebar-footer">
                    {isLoading ? null : isAuthenticated ? (
                        <>
                            <div className="user-info">
                                <div className="user-avatar">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="user-details">
                                    <span className="user-name">{user?.name}</span>
                                    <span className="user-username">@{user?.username}</span>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="logout-btn">
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="login-btn">
                            <LogIn size={20} />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    );
}
