'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import {
    Plus,
    MoreVertical,
    LogOut,
    Search,
    MessageSquarePlus,
    Lock,
    Settings,
    Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import CreateGroupModal from './CreateGroupModal';
import NewChatModal from './NewChatModal';
import SetPinModal from './SetPinModal';
import UnlockModal from './UnlockModal';

export default function Sidebar() {
    const router = useRouter();
    const { user, conversations, activeConversationId, setActiveConversation, setConversations } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [isSetPinModalOpen, setIsSetPinModalOpen] = useState(false);
    const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
    const [showLockedChats, setShowLockedChats] = useState(false);
    const [hasPin, setHasPin] = useState(false);

    // Load conversations on mount
    useEffect(() => {
        loadConversations();
    }, [showLockedChats]);

    const loadConversations = async () => {
        try {
            const endpoint = showLockedChats ? '/conversations?type=locked' : '/conversations';
            const { data } = await axios.get(endpoint);

            const mapped = data.map((conv: {
                id: number;
                name: string;
                is_group: boolean;
                avatar?: string;
                last_message?: string;
                time?: string;
                unread_count?: number;
                is_online?: boolean
            }) => ({
                id: conv.id,
                name: conv.name,
                type: conv.is_group ? 'group' : 'private',
                avatar: conv.avatar,
                updated_at: new Date().toISOString(),
                participants: [],
                last_message: conv.last_message ? { content: conv.last_message, created_at: conv.time } : null,
                unread_count: conv.unread_count || 0,
                is_online: conv.is_online
            }));

            setConversations(mapped);
        } catch (error) {
            console.error('Failed to load conversations:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    const handleLockedChatsClick = () => {
        if (!hasPin) {
            // User hasn't set a PIN yet, show SetPinModal
            setIsSetPinModalOpen(true);
        } else if (!showLockedChats) {
            // Show unlock modal to access locked chats
            setIsUnlockModalOpen(true);
        } else {
            // Already viewing locked chats, switch back to normal
            setShowLockedChats(false);
        }
    };

    const handlePinSet = () => {
        setHasPin(true);
        setIsUnlockModalOpen(true);
    };

    const handleUnlocked = () => {
        setShowLockedChats(true);
    };

    const handleDeleteConversation = async (e: React.MouseEvent, convId: number) => {
        e.stopPropagation(); // Prevent selecting the conversation

        if (!confirm('هل أنت متأكد من حذف هذه المحادثة؟')) return;

        try {
            await axios.delete(`/conversations/${convId}`);
            setConversations(conversations.filter(c => c.id !== convId));
            if (activeConversationId === convId) {
                setActiveConversation(null);
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error);
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <aside className="h-full flex flex-col bg-white border-l border-slate-100">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/profile">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden hover:opacity-80 transition-opacity">
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
                <div className="flex gap-1">
                    {/* Locked Chats Button */}
                    <button
                        onClick={handleLockedChatsClick}
                        className={clsx(
                            "p-2 rounded-full transition-colors",
                            showLockedChats ? "bg-purple-100 text-purple-600" : "hover:bg-slate-50 text-slate-500"
                        )}
                        title="المحادثات المشفرة"
                    >
                        <Lock className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsGroupModalOpen(true)}
                        className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors"
                        title="إنشاء قروب"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <div className="relative group">
                        <button className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        <div className="hidden group-hover:block absolute left-0 top-10 w-48 bg-white shadow-xl rounded-xl border border-slate-100 p-2 z-50">
                            <Link href="/dashboard/profile" className="w-full text-right px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                                <Settings className="w-4 h-4" /> الإعدادات
                            </Link>
                            <button onClick={handleLogout} className="w-full text-right px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2">
                                <LogOut className="w-4 h-4" /> تسجيل خروج
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mode Indicator */}
            {showLockedChats && (
                <div className="mx-4 mt-3 px-4 py-2 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-700 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        المحادثات المشفرة
                    </span>
                    <button
                        onClick={() => setShowLockedChats(false)}
                        className="text-xs text-purple-500 hover:text-purple-700"
                    >
                        إغلاق
                    </button>
                </div>
            )}

            {/* Search */}
            <div className="p-4 pt-2">
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="ابحث في المحادثات..."
                        className="w-full pr-10 pl-4 py-2.5 bg-slate-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/10 border-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {filteredConversations.map((conv) => (
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
                                    <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold">
                                        {conv.name?.[0] || 'م'}
                                    </div>
                                </div>
                                {conv.is_online && (
                                    <div className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="text-sm font-semibold text-slate-900 truncate">{conv.name || 'مجهول'}</h3>
                                    <span className="text-xs text-slate-400 flex-shrink-0">
                                        {conv.last_message?.created_at || ''}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 truncate group-hover:text-slate-600">
                                    {conv.last_message?.content || 'ابدأ المحادثة...'}
                                </p>
                            </div>
                            {conv.unread_count ? (
                                <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                                    {conv.unread_count}
                                </div>
                            ) : null}
                            {/* Delete button - appears on hover */}
                            <button
                                onClick={(e) => handleDeleteConversation(e, conv.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg text-slate-400 hover:text-red-500 transition-all flex-shrink-0"
                                title="حذف المحادثة"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredConversations.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        {showLockedChats ? 'ما فيه محادثات مشفرة' : 'ما فيه محادثات'}<br />
                        ابدأ دردشة جديدة!
                    </div>
                )}
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={() => setIsNewChatModalOpen(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                >
                    <MessageSquarePlus className="w-5 h-5" />
                    دردشة جديدة
                </button>
            </div>

            {/* Modals */}
            <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
            <NewChatModal isOpen={isNewChatModalOpen} onClose={() => setIsNewChatModalOpen(false)} />
            <SetPinModal
                isOpen={isSetPinModalOpen}
                onClose={() => setIsSetPinModalOpen(false)}
                onSuccess={handlePinSet}
            />
            <UnlockModal
                isOpen={isUnlockModalOpen}
                onClose={() => setIsUnlockModalOpen(false)}
                onSuccess={handleUnlocked}
            />
        </aside>
    );
}
