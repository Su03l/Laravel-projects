'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { MoreVertical, Phone, Video, Paperclip, Send, CheckCheck, Lock, Loader2, Image as ImageIcon, FileText, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    // Load messages when conversation changes
    useEffect(() => {
        if (activeConversationId) {
            loadMessages();
        }
    }, [activeConversationId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadMessages = async () => {
        if (!activeConversationId) return;

        setLoading(true);
        try {
            const { data } = await axios.get(`/conversations/${activeConversationId}/messages`);
            // API returns paginated data, messages are in data.data
            const msgs = data.data || data;
            setMessages(msgs.reverse()); // Reverse because API returns latest first
        } catch (error) {
            console.error('Failed to load messages:', error);
            // Show empty state on error
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

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

            // Add new message to list
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
            }
            toast.success(mode === 'everyone' ? 'تم الحذف لدى الجميع' : 'تم الحذف من عندك');
        } catch (error) {
            toast.error('فشل حذف الرسالة');
        }
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
                    <div className="relative w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold">
                            {activeConversation.name?.[0]}
                        </div>
                        {activeConversation.is_online && (
                            <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">{activeConversation.name}</h2>
                        <div className={clsx(
                            "flex items-center gap-2 text-xs font-medium",
                            activeConversation.is_online ? "text-green-500" : "text-slate-400"
                        )}>
                            {activeConversation.is_online && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>}
                            {activeConversation.is_online ? 'متصل الآن' : 'غير متصل'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <button className="hover:text-sky-500 transition-colors"><Phone className="w-5 h-5" /></button>
                    <button className="hover:text-sky-500 transition-colors"><Video className="w-5 h-5" /></button>
                    <button className="hover:text-sky-500 transition-colors"><MoreVertical className="w-5 h-5" /></button>
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
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-8 h-8 rotate-180" />
                        </div>
                        <p className="text-lg font-medium">ابدأ المحادثة</p>
                        <p className="text-sm">أرسل أول رسالة الحين!</p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => {
                            const isMe = msg.user_id === user?.id || msg.sender?.id === user?.id;
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className={clsx("flex w-full group", isMe ? "justify-end" : "justify-start")}
                                >
                                    <div className={clsx(
                                        "max-w-[70%] p-4 rounded-3xl shadow-sm relative",
                                        isMe
                                            ? "bg-gradient-to-l from-sky-500 to-sky-600 text-white rounded-bl-sm"
                                            : "bg-white text-slate-800 rounded-br-sm border border-slate-100"
                                    )}>
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
                                        {msg.body && <p className="text-sm leading-relaxed">{msg.body}</p>}

                                        {/* Meta */}
                                        <div className={clsx(
                                            "flex items-center gap-1 justify-end mt-1 text-[10px]",
                                            isMe ? "text-sky-100" : "text-slate-400"
                                        )}>
                                            {msg.is_edited && <span>(معدّل)</span>}
                                            <span>{formatTime(msg.created_at)}</span>
                                            {isMe && <CheckCheck className={clsx("w-3 h-3", msg.is_read ? "text-sky-200" : "")} />}
                                        </div>

                                        {/* Delete Button (on hover) */}
                                        {isMe && (
                                            <button
                                                onClick={() => handleDelete(msg.id, 'everyone')}
                                                className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full shadow-lg transition-opacity"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
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
                <div className="px-4 py-2 bg-sky-50 border-t border-sky-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sky-700">
                        {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        <span className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                    <button onClick={() => setSelectedFile(null)} className="text-sky-500 hover:text-sky-700">
                        <Trash2 className="w-4 h-4" />
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
                        className="p-2 text-slate-400 hover:text-sky-500 transition-colors rounded-full hover:bg-white"
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
                        className="p-2.5 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all disabled:opacity-50 disabled:scale-90 shadow-md shadow-sky-500/20 rotate-180"
                    >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
