"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Briefcase, LogOut, ChevronDown, FileText } from "lucide-react";

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
                                <Briefcase className="w-6 h-6" />
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
            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                        <User className="w-4 h-4" />
                        الملف الشخصي
                    </Link>

                    {user.type === 'company' ? (
                        <Link
                            href="/company/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            لوحة التحكم
                        </Link>
                    ) : (
                        <Link
                            href="/my-applications"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            طلباتي
                        </Link>
                    )}

                    <div className="border-t border-slate-50 my-1"></div>

                    <button
                        onClick={() => { setIsOpen(false); logout(); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4 transform rotate-180" />
                        تسجيل خروج
                    </button>
                </div>
            )}
        </div>
    );
}
