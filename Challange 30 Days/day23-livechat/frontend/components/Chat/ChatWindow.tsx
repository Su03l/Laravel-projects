'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { MoreVertical, Phone, Video, Paperclip, Send, CheckCheck, Loader2, Image as ImageIcon, FileText, Trash2, Edit3, Copy, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { getEcho } from '@/lib/echo';

interface Message {
    id: number;
    body: string;
    type: 'text' | 'image' | 'file' | 'video';
    attachment_url?: string;
    sender: { id: number; name: string; avatar?: string };
    user_id: number;
    is_read: boolean;
    is_edited: boolean;
    created_at: string;
    reply_to?: Message;
}

export default function ChatWindow() {
    const { activeConversationId, conversations, user } = useStore();
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const loadMessages = useCallback(async () => {
        if (!activeConversationId) return;

        setLoading(true);
        try {
            const { data } = await axios.get(`/conversations/${activeConversationId}/messages`);
            const msgs = data.data || data;
            setMessages(msgs.reverse());
        } catch {
            console.error('Failed to load messages');
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, [activeConversationId]);

    // Load messages when conversation changes
    useEffect(() => {
        if (activeConversationId) {
            loadMessages();
        }
    }, [activeConversationId, loadMessages]);

    // Real-time: Listen for new messages via Laravel Echo
    useEffect(() => {
        if (!activeConversationId) return;

        const echo = getEcho();
        if (!echo) return;

        const channel = echo.private(`conversation.${activeConversationId}`);

        // Listen for new messages
        channel.listen('MessageSent', (e: { message: Message }) => {
            setMessages(prev => {
                // Avoid duplicates
                if (prev.some(m => m.id === e.message.id)) return prev;
                return [...prev, e.message];
            });
        });

        // Listen for typing
        channel.listen('UserTyping', (e: { user_id: number; user_name: string; is_typing: boolean }) => {
            if (e.user_id !== user?.id) {
                if (e.is_typing) {
                    setIsTyping(true);
                    setTypingUser(e.user_name);
                    // Auto-clear after 3 seconds
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => {
                        setIsTyping(false);
                        setTypingUser(null);
                    }, 3000);
                } else {
                    setIsTyping(false);
                    setTypingUser(null);
                }
            }
        });

        return () => {
            channel.stopListening('MessageSent');
            channel.stopListening('UserTyping');
            echo.leave(`conversation.${activeConversationId}`);
        };
    }, [activeConversationId, user?.id]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() && !selectedFile) return;
        if (!activeConversationId) return;

        setSending(true);
        try {
            const formData = new FormData();

            if (messageInput.trim()) {
                formData.append('body', messageInput);
            }

            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const { data } = await axios.post(`/conversations/${activeConversationId}/messages`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessages(prev => [...prev, data.data]);
            setMessageInput('');
            setSelectedFile(null);
        } catch (error) {
            toast.error('فشل إرسال الرسالة');
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (messageId: number, mode: 'me' | 'everyone') => {
        try {
            await axios.delete(`/messages/${messageId}`, { data: { mode } });

            if (mode === 'everyone') {
                setMessages(prev => prev.filter(m => m.id !== messageId));
            } else {
                // For 'me' mode, hide the message locally
                setMessages(prev => prev.filter(m => m.id !== messageId));
            }
            toast.success(mode === 'everyone' ? 'تم الحذف لدى الجميع' : 'تم الحذف من عندك');
            setActiveMenuId(null);
        } catch (error) {
            toast.error('فشل حذف الرسالة');
        }
    };

    const handleEdit = async (messageId: number) => {
        if (!editText.trim()) return;

        try {
            await axios.put(`/messages/${messageId}`, { body: editText });
            setMessages(prev => prev.map(m =>
                m.id === messageId ? { ...m, body: editText, is_edited: true } : m
            ));
            toast.success('تم تعديل الرسالة');
            setEditingMessageId(null);
            setEditText('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تعديل الرسالة');
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('تم نسخ الرسالة');
        setActiveMenuId(null);
    };

    const startEditing = (msg: Message) => {
        setEditingMessageId(msg.id);
        setEditText(msg.body);
        setActiveMenuId(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('الملف كبير جداً، الحد الأقصى 10MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    if (!activeConversation) {
        return <div className="h-full flex items-center justify-center text-slate-400">اختر محادثة عشان تبدأ</div>;
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-md">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold text-lg">
                            {activeConversation.name?.[0]}
                        </div>
                        {activeConversation.is_online && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                    </div>
                    <div>
                        <Link href={activeConversation.type === 'group' ? '#' : (activeConversation.other_user_id ? `/dashboard/profile/${activeConversation.other_user_id}` : '/dashboard/profile')} className="hover:text-sky-600 transition-colors">
                            <h2 className="font-bold text-slate-900 text-lg cursor-pointer hover:underline decoration-sky-500 decoration-2 underline-offset-2">
                                {activeConversation.name}
                            </h2>
                        </Link>
                        <div className={clsx(
                            "flex items-center gap-2 text-xs font-medium",
                            isTyping ? "text-sky-500" : activeConversation.is_online ? "text-green-500" : "text-slate-400"
                        )}>
                            {isTyping ? (
                                <>
                                    <span className="flex gap-0.5">
                                        <span className="w-1 h-1 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1 h-1 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1 h-1 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </span>
                                    {typingUser ? `${typingUser} يكتب...` : 'يكتب...'}
                                </>
                            ) : activeConversation.is_online ? (
                                <>
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    متصل الآن
                                </>
                            ) : (
                                'غير متصل'
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                    <button className="p-2 hover:bg-slate-100 hover:text-sky-500 rounded-full transition-all"><Phone className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-slate-100 hover:text-sky-500 rounded-full transition-all"><Video className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-slate-100 hover:text-sky-500 rounded-full transition-all"><MoreVertical className="w-5 h-5" /></button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <div className="w-20 h-20 bg-gradient-to-br from-sky-100 to-purple-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Send className="w-10 h-10 text-sky-500 rotate-180" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">ابدأ المحادثة</p>
                        <p className="text-sm">أرسل أول رسالة الحين!</p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => {
                            const isMe = msg.user_id === user?.id || msg.sender?.id === user?.id;
                            const showAvatar = index === 0 || messages[index - 1]?.user_id !== msg.user_id;

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className={clsx("flex w-full gap-3 group", isMe ? "flex-row-reverse" : "flex-row")}
                                >
                                    {/* Avatar */}
                                    <div className={clsx("flex-shrink-0 w-8", !showAvatar && "invisible")}>
                                        {showAvatar && (
                                            <div className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm",
                                                isMe
                                                    ? "bg-gradient-to-br from-sky-400 to-sky-600 text-white"
                                                    : "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
                                            )}>
                                                {msg.sender?.name?.[0] || (isMe ? user?.name?.[0] : '؟')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className="relative max-w-[65%]">
                                        {/* Sender Name */}
                                        {showAvatar && !isMe && (
                                            <p className="text-xs font-medium text-slate-500 mb-1 mr-2">
                                                {msg.sender?.name || 'مجهول'}
                                            </p>
                                        )}

                                        <div className={clsx(
                                            "p-3 rounded-2xl shadow-sm relative",
                                            isMe
                                                ? "bg-gradient-to-l from-sky-500 to-sky-600 text-white rounded-br-sm"
                                                : "bg-white text-slate-800 rounded-bl-sm border border-slate-100"
                                        )}>
                                            {/* Edit Mode */}
                                            {editingMessageId === msg.id ? (
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="text"
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border-none bg-white/20 text-current placeholder:text-current/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => { setEditingMessageId(null); setEditText(''); }}
                                                            className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(msg.id)}
                                                            className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Message Content */}
                                                    {msg.type === 'image' && msg.attachment_url && (
                                                        <img src={msg.attachment_url} alt="" className="rounded-xl mb-2 max-w-full" />
                                                    )}
                                                    {msg.type === 'file' && msg.attachment_url && (
                                                        <a href={msg.attachment_url} target="_blank" className="flex items-center gap-2 p-2 bg-white/20 rounded-xl mb-2">
                                                            <FileText className="w-5 h-5" />
                                                            <span className="text-sm">مرفق</span>
                                                        </a>
                                                    )}
                                                    {msg.body && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>}

                                                    {/* Meta */}
                                                    <div className={clsx(
                                                        "flex items-center gap-1.5 justify-end mt-1.5 text-[10px]",
                                                        isMe ? "text-sky-100" : "text-slate-400"
                                                    )}>
                                                        {msg.is_edited && <span className="opacity-75">(تم التعديل)</span>}
                                                        <span>{formatTime(msg.created_at)}</span>
                                                        {isMe && <CheckCheck className={clsx("w-3.5 h-3.5", msg.is_read ? "text-sky-200" : "opacity-50")} />}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Actions Menu - 3 Dots on Hover */}
                                        {editingMessageId !== msg.id && (
                                            <div className={clsx(
                                                "absolute top-0 opacity-0 group-hover:opacity-100 transition-all z-20",
                                                isMe ? "left-full ml-2" : "right-full mr-2"
                                            )}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === msg.id ? null : msg.id); }}
                                                    className="p-1.5 bg-white shadow-lg rounded-full border border-slate-100 hover:bg-slate-50 transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-slate-500" />
                                                </button>

                                                {/* Dropdown Menu */}
                                                <AnimatePresence>
                                                    {activeMenuId === msg.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                                            className={clsx(
                                                                "absolute top-8 bg-white shadow-xl rounded-xl border border-slate-100 py-1 min-w-[160px] z-30",
                                                                isMe ? "left-0" : "right-0"
                                                            )}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {/* Copy */}
                                                            <button
                                                                onClick={() => handleCopy(msg.body)}
                                                                className="w-full px-4 py-2.5 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                                            >
                                                                <Copy className="w-4 h-4 text-slate-400" />
                                                                نسخ
                                                            </button>

                                                            {/* Edit - Only for my messages and text type */}
                                                            {isMe && msg.type === 'text' && (
                                                                <button
                                                                    onClick={() => startEditing(msg)}
                                                                    className="w-full px-4 py-2.5 text-right text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                                                >
                                                                    <Edit3 className="w-4 h-4 text-slate-400" />
                                                                    تعديل
                                                                </button>
                                                            )}

                                                            {/* Delete for me */}
                                                            <button
                                                                onClick={() => handleDelete(msg.id, 'me')}
                                                                className="w-full px-4 py-2.5 text-right text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                حذف لدي
                                                            </button>

                                                            {/* Delete for everyone - Only for my messages */}
                                                            {isMe && (
                                                                <button
                                                                    onClick={() => handleDelete(msg.id, 'everyone')}
                                                                    className="w-full px-4 py-2.5 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    حذف لدى الجميع
                                                                </button>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* File Preview */}
            {selectedFile && (
                <div className="px-4 py-3 bg-sky-50 border-t border-sky-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sky-700">
                        <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                            {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                            <span className="text-sm font-medium truncate max-w-[200px] block">{selectedFile.name}</span>
                            <span className="text-xs text-sky-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                        </div>
                    </div>
                    <button onClick={() => setSelectedFile(null)} className="p-2 text-sky-500 hover:text-sky-700 hover:bg-sky-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="flex items-center gap-2 p-2 bg-slate-50 rounded-[32px] border border-slate-200 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all shadow-sm">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 text-slate-400 hover:text-sky-500 transition-colors rounded-full hover:bg-white"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none focus:outline-none px-2 text-slate-800 placeholder:text-slate-400"
                        placeholder="اكتب رسالتك هنا..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={(!messageInput.trim() && !selectedFile) || sending}
                        className="p-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-full hover:from-sky-600 hover:to-sky-700 transition-all disabled:opacity-50 disabled:scale-90 shadow-lg shadow-sky-500/25 rotate-180"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
