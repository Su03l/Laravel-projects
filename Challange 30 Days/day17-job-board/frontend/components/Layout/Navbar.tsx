"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.637-1.292-.172-.061-.322-.157-.456-.282m0 0a2.18 2.18 0 01-.75-1.661V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                                وظيفتك <span className="text-blue-600">علينا</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden sm:flex sm:space-x-8 sm:space-x-reverse">
                        <NavLink href="/" active={isActive("/")}>الوظائف</NavLink>
                        {user?.type === "company" && (
                            <NavLink href="/company/dashboard" active={isActive("/company/dashboard")}>لوحة التحكم</NavLink>
                        )}
                        {user?.type === "seeker" && (
                            <NavLink href="/my-applications" active={isActive("/my-applications")}>طلباتي</NavLink>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden sm:flex sm:items-center space-x-4 space-x-reverse">
                        {user ? (
                            <div className="relative ml-3">
                                <UserDropdown user={user} logout={logout} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
                                >
                                    دخول
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                                >
                                    ابدا معنا
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${active
                    ? "border-blue-600 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
        >
            {children}
        </Link>
    )
}

function UserDropdown({ user, logout }: { user: any, logout: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // @ts-ignore
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-colors focus:outline-none"
            >
                <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-blue-600 font-bold text-lg uppercase">{user.name.charAt(0)}</span>
                    )}
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                    <p className="text-xs text-slate-500 mt-1 capitalize">
                        {user.type === 'company' ? 'صاحب عمل' : 'باحث عن عمل'}
                    </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                    <div className="px-4 py-3 border-b border-slate-50 md:hidden">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.type}</p>
                    </div>

                    <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        الملف الشخصي
                    </Link>

                    {user.type === 'company' ? (
                        <Link
                            href="/company/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            لوحة التحكم
                        </Link>
                    ) : (
                        <Link
                            href="/my-applications"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                            طلباتي
                        </Link>
                    )}

                    <div className="border-t border-slate-50 my-1"></div>

                    <button
                        onClick={() => { setIsOpen(false); logout(); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transform rotate-180">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        تسجيل خروج
                    </button>
                </div>
            )}
        </div>
    );
}
