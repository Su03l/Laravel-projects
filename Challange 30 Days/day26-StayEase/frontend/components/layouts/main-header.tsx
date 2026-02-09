'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, User, LogOut, Moon, Sun, Heart,
    Calendar, Settings, LayoutDashboard, Building2
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/auth-store';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/search', label: 'الغرف' },
    { href: '/about', label: 'من نحن' },
    { href: '/contact', label: 'تواصل معنا' },
];

export function MainHeader() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, logout, fetchUser, isLoading } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-background/95 backdrop-blur-md shadow-lg border-b'
                    : 'bg-transparent'
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Building2 className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                        <span className="font-display text-2xl font-bold tracking-tight">
                            Stay<span className="text-primary">Ease</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-primary relative py-2',
                                    pathname === link.href
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="hidden sm:flex"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </Button>
                        )}

                        {/* Auth Section */}
                        {!isLoading && (
                            <>
                                {isAuthenticated && user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                                                    <AvatarImage src={user.avatar_url} alt={user.name} />
                                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end" forceMount>
                                            <div className="flex items-center gap-2 p-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col space-y-0.5 text-right">
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="cursor-pointer text-right w-full flex flex-row-reverse">
                                                    <LayoutDashboard className="ml-2 h-4 w-4" />
                                                    لوحة التحكم
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard/bookings" className="cursor-pointer text-right w-full flex flex-row-reverse">
                                                    <Calendar className="ml-2 h-4 w-4" />
                                                    حجوزاتي
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard/wishlist" className="cursor-pointer text-right w-full flex flex-row-reverse">
                                                    <Heart className="ml-2 h-4 w-4" />
                                                    المفضلة
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard/profile" className="cursor-pointer text-right w-full flex flex-row-reverse">
                                                    <Settings className="ml-2 h-4 w-4" />
                                                    الإعدادات
                                                </Link>
                                            </DropdownMenuItem>
                                            {user.role === 'admin' && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/admin" className="cursor-pointer text-right w-full flex flex-row-reverse">
                                                            <User className="ml-2 h-4 w-4" />
                                                            لوحة الإدارة
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive text-right w-full flex flex-row-reverse">
                                                <LogOut className="ml-2 h-4 w-4" />
                                                تسجيل خروج
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <div className="hidden sm:flex items-center gap-2">
                                        <Button variant="ghost" asChild>
                                            <Link href="/login">تسجيل دخول</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href="/register">حساب جديد</Link>
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t bg-background"
                    >
                        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                        pathname === link.href
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {!isAuthenticated && (
                                <div className="flex flex-col gap-2 pt-4 border-t mt-2">
                                    <Button variant="outline" asChild>
                                        <Link href="/login">تسجيل دخول</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/register">حساب جديد</Link>
                                    </Button>
                                </div>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
