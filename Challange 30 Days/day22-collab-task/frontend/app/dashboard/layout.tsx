"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Users, User, LogOut, ChevronRight, ChevronLeft, Menu } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";

const sidebarLinks = [
    { name: "لوحة القيادة", href: "/dashboard", icon: LayoutDashboard },
    { name: "مهامي", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "المجموعات", href: "/dashboard/groups", icon: Users },
    { name: "الملف الشخصي", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ first_name: string; last_name: string; username: string } | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        // Try getting from localStorage first
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }

        // Optional: Fetch fresh data to ensure valid session
        const fetchUser = async () => {
            try {
                const res = await api.get('/profile');
                setUser(res.data.user);
                localStorage.setItem("user", JSON.stringify(res.data.user)); // Update local storage
            } catch (error) {
                // Token might be invalid
                console.error("Session invalid", error);
            }
        };
        fetchUser();

    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/logout'); // Optional: Call backend logout
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.success("تم تسجيل الخروج");
            router.push("/login");
        }
    };

    const getInitials = () => {
        if (!user) return "م";
        return (user.first_name?.[0] || "") + (user.last_name?.[0] || "");
    };

    const getAvatarUrl = () => {
        if (!user?.avatar) return null;
        return user.avatar.startsWith('http')
            ? user.avatar
            : `http://localhost:8000${user.avatar}`;
    };

    const getDisplayName = () => {
        if (!user) return "المستخدم";
        return `${user.first_name} ${user.last_name}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex" dir="rtl">
            {/* Sidebar - Right aligned in RTL */}
            <aside
                className={clsx(
                    "fixed inset-y-0 right-0 bg-white/90 backdrop-blur-md border-l border-slate-200 z-50 flex flex-col shadow-lg shadow-slate-200/50 transition-all duration-300",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                {/* Header with Toggle */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between h-20">
                    <div className={clsx("flex items-center gap-3 overflow-hidden", !isSidebarOpen && "justify-center w-full")}>
                        <div className="w-10 h-10 min-w-[2.5rem] bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
                            <span className="text-lg font-bold">م</span>
                        </div>

                        {isSidebarOpen && (
                            <h1 className="text-lg font-extrabold text-slate-900 whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                                مدير المهام
                            </h1>
                        )}
                    </div>

                    {isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-2 mt-2">
                    {/* Toggle Button for Collapsed State */}
                    {!isSidebarOpen && (
                        <div className="flex justify-center mb-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-colors shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {sidebarLinks.map((link) => {
                        const LinkIcon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-3 text-sm font-bold rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-100"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                    !isSidebarOpen && "justify-center"
                                )}
                                title={!isSidebarOpen ? link.name : ""}
                            >
                                <LinkIcon className={clsx("w-6 h-6 min-w-[1.5rem] transition-colors", isActive ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600")} />

                                {isSidebarOpen && (
                                    <span className="relative z-10 whitespace-nowrap">{link.name}</span>
                                )}

                                {isActive && isSidebarOpen && (
                                    <div className="absolute inset-y-0 right-0 w-1 bg-sky-500 rounded-l-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={handleLogout}
                        className={clsx(
                            "flex w-full items-center gap-3 px-3 py-3 text-sm font-bold text-slate-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all group",
                            !isSidebarOpen && "justify-center"
                        )}
                        title={!isSidebarOpen ? "تسجيل الخروج" : ""}
                    >
                        <LogOut className="w-5 h-5 min-w-[1.25rem] group-hover:text-rose-500 transition-colors" />
                        {isSidebarOpen && <span>تسجيل الخروج</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content - Pushed Left */}
            <div
                className={clsx(
                    "flex-1 flex flex-col min-h-screen transition-all duration-300",
                    isSidebarOpen ? "mr-64" : "mr-20"
                )}
            >
                {/* Top Bar */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
                    {/* Breadcrumbs or Page Title (Optional - can be dynamic) */}
                    <div className="text-sm font-medium text-slate-500">
                        {/* You could map pathnames to titles here if wanted */}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-4 pl-2">
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-bold text-slate-700 leading-tight">{getDisplayName()}</p>
                            <p className="text-xs text-slate-400 font-medium">@{user?.username || 'user'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 border-2 border-white shadow-md flex items-center justify-center text-sky-700 font-extrabold text-sm ring-2 ring-slate-50 overflow-hidden">
                            {getAvatarUrl() ? (
                                <img src={getAvatarUrl()!} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                getInitials()
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 bg-slate-50 relative overflow-x-hidden">
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
