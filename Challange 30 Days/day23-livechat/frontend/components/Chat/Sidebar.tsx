'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import {
    Plus,
    Lock,
    MoreVertical,
    LogOut,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import CreateGroupModal from './CreateGroupModal';

export default function Sidebar() {
    const router = useRouter();
    const { user, conversations, activeConversationId, setActiveConversation } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    return (
        <aside className="h-full flex flex-col bg-white border-l border-slate-100">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/profile">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden hover:opacity-80 transition-opacity">
                            {/* Avatar Placeholder */}
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 font-bold">
                                    {user?.name?.[0] || 'م'}
                                </div>
                            )}
                        </div>
                    </Link>
                    <div className="text-sm font-bold text-slate-900 hidden lg:block">{user?.name}</div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
                        <Lock className="w-5 h-5" />
                    </button>
                    <button onClick={() => setIsGroupModalOpen(true)} className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
                        <Plus className="w-5 h-5" />
                    </button>
                    <div className="relative group">
                        <button className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        {/* Dropdown for simple actions */}
                        <div className="hidden group-hover:block absolute left-0 top-10 w-48 bg-white shadow-xl rounded-xl border border-slate-100 p-2 z-50">
                            <button onClick={handleLogout} className="w-full text-right px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2">
                                <LogOut className="w-4 h-4" /> تسجيل خروج
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="p-4 pt-2">
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="ابحث برقم الجوال..."
                        className="w-full pr-10 pl-4 py-2.5 bg-slate-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/10 border-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => setActiveConversation(conv.id)}
                        className={clsx(
                            "group relative p-3 rounded-2xl cursor-pointer transition-all hover:bg-slate-50",
                            activeConversationId === conv.id ? "bg-sky-50 hover:bg-sky-50" : ""
                        )}
                    >
                        {activeConversationId === conv.id && (
                            <motion.div layoutId="activeInd" className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-500 rounded-l-full" />
                        )}
                        <div className="flex gap-3 items-center">
                            <div className="relative w-12 h-12 flex-shrink-0">
                                <div className="w-full h-full rounded-2xl bg-slate-200 overflow-hidden">
                                    {/* Avatar Logic */}
                                    <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold">
                                        {conv.name?.[0] || 'م'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-semibold text-slate-900 truncate">{conv.name || 'مجهول'}</h3>
                                    <span className="text-xs text-slate-400 flex-shrink-0">12:30 م</span>
                                </div>
                                <p className="text-sm text-slate-500 truncate group-hover:text-slate-600">
                                    {conv.last_message?.content || 'ما فيه رسايل للحين'}
                                </p>
                            </div>
                            {conv.unread_count ? (
                                <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                                    {conv.unread_count}
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}

                {conversations.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        ما عندك محادثات.<br />ابحث عن خويك وابدأ سولف.
                    </div>
                )}
            </div>

            <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
        </aside>
    );
}
