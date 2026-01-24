'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function UserDropdown() {
    const { user, logout } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-colors text-right"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-accent flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-brand-blue/20">
                    {user?.name?.[0]}
                </div>
                <div className="hidden sm:block">
                    <p className="text-[10px] text-slate-500 font-medium">مرحباً،</p>
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white truncate max-w-[80px]">{user?.name}</span>
                        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-3 w-48 glass rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-left border border-white/5">
                    <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                    >
                        <User className="w-4 h-4 text-brand-blue" />
                        <span>الملف الشخصي</span>
                    </Link>
                    <Link
                        href="/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                    >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>الإعدادات</span>
                    </Link>
                    <hr className="my-2 border-white/5" />
                    <button
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                    >
                        <LogOut className="w-4 h-4 rotate-180" />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            )}
        </div>
    );
}
