'use client';

import { useState } from 'react';
import { X, Search, Phone, UserPlus, Loader2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useStore } from '@/lib/store';

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewChatModal({ isOpen, onClose }: NewChatModalProps) {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [starting, setStarting] = useState(false);
    const [searchResult, setSearchResult] = useState<{ id: number; name: string; phone: string; avatar?: string; about?: string; is_online?: boolean } | null>(null);
    const { setActiveConversation, setConversations, conversations } = useStore();

    const handleSearch = async () => {
        if (phone.length < 10) {
            toast.error('أدخل رقم جوال صحيح (10 أرقام)');
            return;
        }

        setLoading(true);
        setSearchResult(null);

        try {
            // ✅ Using correct API: POST /chat/check-number
            const { data } = await axios.post('/chat/check-number', { phone });
            if (data.user) {
                setSearchResult(data.user);
                toast.success('تم العثور على المستخدم');
            }
        } catch (error: unknown) {
            const err = error as { response?: { status?: number } };
            if (err.response?.status === 404) {
                toast.error('ما لقينا أحد بهالرقم');
            } else {
                toast.error('حدث خطأ، جرب مرة ثانية');
            }
            setSearchResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = async () => {
        if (!searchResult) return;

        setStarting(true);
        try {
            // ✅ Using correct API: POST /chat with user_id
            const { data } = await axios.post('/chat', {
                user_id: searchResult.id
            });

            // Fetch updated conversations list
            const convResponse = await axios.get('/conversations');
            setConversations(convResponse.data.map((conv: { id: number; name: string; is_group: boolean; avatar?: string; last_message?: string; time?: string; unread_count?: number; is_online?: boolean }) => ({
                id: conv.id,
                name: conv.name,
                type: conv.is_group ? 'group' : 'private',
                updated_at: new Date().toISOString(),
                participants: [],
                last_message: conv.last_message ? { content: conv.last_message } : null,
                unread_count: conv.unread_count || 0
            })));

            setActiveConversation(data.conversation_id);
            toast.success(data.is_new ? 'تم بدء محادثة جديدة!' : 'المحادثة موجودة مسبقاً');
            onClose();
            setPhone('');
            setSearchResult(null);
        } catch (error) {
            toast.error('صار خطأ، جرب مرة ثانية');
        } finally {
            setStarting(false);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        setPhone(value);
        setSearchResult(null);
    };

    const handleClose = () => {
        onClose();
        setPhone('');
        setSearchResult(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
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
                                    <div className="w-12 h-12 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                                        <UserPlus className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">دردشة جديدة</h2>
                                        <p className="text-sm text-slate-500">ابحث بالرقم وابدأ محادثة</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="p-6 space-y-4">
                            <div className="relative">
                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    placeholder="05XXXXXXXX"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    maxLength={10}
                                    className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-left focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all text-lg"
                                    autoFocus
                                />
                            </div>

                            <button
                                onClick={handleSearch}
                                disabled={phone.length < 10 || loading}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> ابحث</>}
                            </button>
                        </div>

                        {/* Search Result */}
                        {searchResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="px-6 pb-6"
                            >
                                <div className="p-4 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl border border-sky-100">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 font-bold text-xl overflow-hidden">
                                                {searchResult.avatar ? (
                                                    <img src={searchResult.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    searchResult.name[0]
                                                )}
                                            </div>
                                            {searchResult.is_online && (
                                                <div className="absolute bottom-0 left-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900">{searchResult.name}</h4>
                                            <p className="text-sm text-slate-500">{searchResult.about || 'مستخدم جديد'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleStartChat}
                                        disabled={starting}
                                        className="w-full mt-4 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><MessageCircle className="w-5 h-5" /> ابدأ المحادثة</>}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
