'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { MoreVertical, Phone, Video, Paperclip, Send, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import axios from '@/lib/axios';

export default function ChatWindow() {
    const { activeConversationId, conversations, user } = useStore();
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock messages for UI demo if no API data yet
    // In real app, useSWR to fetch messages
    const [messages, setMessages] = useState<any[]>([]);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    useEffect(() => {
        // Scroll to bottom on new message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Reset/Fetch messages when conversation changes
        if (activeConversationId) {
            // Fetch logic would go here
            // For now, setting some dummy data for the "Vibe"
            setMessages([
                { id: 1, content: "Hey! How are you?", sender_id: activeConversation?.participants[0]?.user_id || 0, created_at: new Date().toISOString() },
                { id: 2, content: "I'm doing great, thanks! Just working on the new LiveChat Pro.", sender_id: user?.id, created_at: new Date().toISOString() },
                { id: 3, content: "That sounds awesome! Can't wait to see it.", sender_id: activeConversation?.participants[0]?.user_id || 0, created_at: new Date().toISOString() },
            ]);
        }
    }, [activeConversationId, user?.id]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            content: messageInput,
            sender_id: user?.id,
            created_at: new Date().toISOString(),
            is_read: false,
        };

        setMessages([...messages, newMessage]);
        setMessageInput('');

        // API Call
        try {
            // await axios.post('/messages', { conversation_id: activeConversationId, content: messageInput });
        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    if (!activeConversation) return <div className="h-full flex items-center justify-center text-slate-400">Select a conversation</div>;

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950/50">
            {/* Header */}
            <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold">
                            {activeConversation.name?.[0]}
                        </div>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">{activeConversation.name}</h2>
                        <div className="flex items-center gap-2 text-xs text-green-500 font-medium">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Online
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={clsx(
                                    "flex w-full",
                                    isMe ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={clsx(
                                    "max-w-[70%] p-4 rounded-3xl shadow-sm relative group",
                                    isMe
                                        ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-br-sm"
                                        : "bg-white text-slate-800 rounded-bl-sm border border-slate-100"
                                )}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    <div className={clsx(
                                        "flex items-center gap-1 justify-end mt-1 text-[10px]",
                                        isMe ? "text-sky-100" : "text-slate-400"
                                    )}>
                                        <span>12:42 PM</span>
                                        {isMe && <CheckCheck className="w-3 h-3" />}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="flex items-center gap-2 p-2 bg-slate-50 rounded-[32px] border border-slate-200 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all shadow-sm">
                    <button type="button" className="p-2 text-slate-400 hover:text-sky-500 transition-colors rounded-full hover:bg-white">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none focus:outline-none px-2 text-slate-800 placeholder:text-slate-400"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="p-2.5 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all disabled:opacity-50 disabled:scale-90 shadow-md shadow-sky-500/20"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
