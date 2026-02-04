import { create } from 'zustand';
import { User, Conversation } from '@/types';

interface AppState {
    user: User | null;
    conversations: Conversation[];
    activeConversationId: number | null;
    isSidebarOpen: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setConversations: (conversations: Conversation[]) => void;
    setActiveConversation: (id: number | null) => void;
    toggleSidebar: () => void;
    addMessage: (conversationId: number, message: any) => void;
}

export const useStore = create<AppState>((set) => ({
    user: null,
    conversations: [],
    activeConversationId: null,
    isSidebarOpen: true,

    setUser: (user) => set({ user }),
    setConversations: (conversations) => set({ conversations }),
    setActiveConversation: (id) => set({ activeConversationId: id }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    addMessage: (conversationId, message) => set((state) => {
        const updatedConversations = state.conversations.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    last_message: message,
                    updated_at: message.created_at, // Update sort order
                };
            }
            return conv;
        });

        // Optional: Re-sort conversations by date here

        return { conversations: updatedConversations };
    }),
}));
