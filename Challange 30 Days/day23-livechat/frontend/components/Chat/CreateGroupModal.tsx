'use client';

import { useState } from 'react';
import { X, Search, Check, Users, Loader2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useStore } from '@/lib/store';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchedUser {
    id: number;
    name: string;
    phone: string;
    avatar?: string;
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<SearchedUser[]>([]);
    const [searchPhone, setSearchPhone] = useState('');
    const [searchResult, setSearchResult] = useState<SearchedUser | null>(null);
    const [searching, setSearching] = useState(false);
    const [creating, setCreating] = useState(false);
    const { setConversations, setActiveConversation, conversations } = useStore();

    const handleSearch = async () => {
        if (searchPhone.length < 10) {
            toast.error('أدخل رقم جوال صحيح');
            return;
        }

        setSearching(true);
        try {
            const { data } = await axios.post('/chat/check-number', { phone: searchPhone });
            if (data.user) {
                setSearchResult(data.user);
            }
        } catch (error) {
            toast.error('ما لقينا أحد بهالرقم');
            setSearchResult(null);
        } finally {
            setSearching(false);
        }
    };

    const addUser = (user: SearchedUser) => {
        if (!selectedUsers.find(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
        setSearchResult(null);
        setSearchPhone('');
    };

    const removeUser = (id: number) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== id));
    };

    const handleCreate = async () => {
        if (!groupName.trim() || selectedUsers.length === 0) return;

        setCreating(true);
        try {
            const { data } = await axios.post('/groups', {
                name: groupName,
                participants: selectedUsers.map(u => u.id)
            });

            // Refresh conversations
            const convResponse = await axios.get('/conversations');
            setConversations(convResponse.data.map((conv: { id: number; name: string; is_group: boolean; avatar?: string; last_message?: string; time?: string; unread_count?: number }) => ({
                id: conv.id,
                name: conv.name,
                type: conv.is_group ? 'group' : 'private',
                updated_at: new Date().toISOString(),
                participants: [],
                last_message: conv.last_message ? { content: conv.last_message } : null,
                unread_count: conv.unread_count || 0
            })));

            setActiveConversation(data.conversation_id);
            toast.success('تم إنشاء المجموعة!');
            handleClose();
        } catch (error) {
            toast.error('فشل إنشاء المجموعة');
        } finally {
            setCreating(false);
        }
    };

    const handleClose = () => {
        setGroupName('');
        setSelectedUsers([]);
        setSearchPhone('');
        setSearchResult(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">مجموعة جديدة</h2>
                                        <p className="text-sm text-slate-500">أضف الأعضاء وابدأ</p>
                                    </div>
                                </div>
                                <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-xl">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Group Name */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">اسم المجموعة</label>
                                <input
                                    type="text"
                                    placeholder="مثلاً: قروب الشباب"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>

                            {/* Selected Users */}
                            {selectedUsers.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-2">الأعضاء المختارين ({selectedUsers.length})</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map(user => (
                                            <div key={user.id} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                                                <span>{user.name}</span>
                                                <button onClick={() => removeUser(user.id)} className="hover:text-red-500">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Search Users by Phone */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">إضافة عضو بالرقم</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="tel"
                                            placeholder="05XXXXXXXX"
                                            className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-left focus:outline-none focus:border-emerald-500"
                                            value={searchPhone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setSearchPhone(val);
                                                setSearchResult(null);
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        disabled={searchPhone.length < 10 || searching}
                                        className="px-4 py-3 bg-slate-900 text-white rounded-xl disabled:opacity-50"
                                    >
                                        {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Search Result */}
                                {searchResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                                                {searchResult.name[0]}
                                            </div>
                                            <span className="font-medium text-slate-900">{searchResult.name}</span>
                                        </div>
                                        <button
                                            onClick={() => addUser(searchResult)}
                                            className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100">
                            <button
                                onClick={handleCreate}
                                disabled={!groupName.trim() || selectedUsers.length === 0 || creating}
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Users className="w-5 h-5" /> إنشاء المجموعة</>}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
