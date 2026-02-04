'use client';

import { useEffect } from 'react';
import ChatWindow from '@/components/Chat/ChatWindow';
import ContactInfo from '@/components/Chat/ContactInfo';
import { useStore } from '@/lib/store';
import { MessageSquare } from 'lucide-react';

export default function DashboardPage() {
    const { activeConversationId, conversations, setConversations } = useStore();

    useEffect(() => {
        // Initial fetch of conversations would go here
        // Mocking for now
        if (conversations.length === 0) {
            setConversations([
                {
                    id: 1,
                    name: 'Alice Johnson',
                    type: 'private',
                    updated_at: new Date().toISOString(),
                    participants: [{ id: 1, user_id: 2, conversation_id: 1, user: { id: 2, name: 'Alice Johnson', email: 'alice@example.com' } }],
                    last_message: { id: 1, content: 'Hey there! Nice vibe.', type: 'text', is_read: true, created_at: new Date().toISOString(), conversation_id: 1, sender_id: 2 }
                },
                {
                    id: 2,
                    name: 'Design Team',
                    type: 'group',
                    updated_at: new Date().toISOString(),
                    participants: [],
                    last_message: { id: 2, content: 'Can we review the mockups?', type: 'text', is_read: false, created_at: new Date().toISOString(), conversation_id: 2, sender_id: 3 }
                }
            ]);
        }
    }, [conversations.length, setConversations]);

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 h-full min-w-0">
                {activeConversationId ? (
                    <ChatWindow />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-lg font-medium text-slate-400">Select a chat to start messaging</p>
                    </div>
                )}
            </div>

            {/* Right Sidebar - Contact Info */}
            {/* Only show if we have an active conversation */}
            {activeConversationId && (
                <div className="w-80 border-l border-slate-100 hidden xl:block">
                    <ContactInfo />
                </div>
            )}
        </div>
    );
}
