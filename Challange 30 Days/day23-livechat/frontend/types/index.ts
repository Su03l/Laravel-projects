export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    status?: string;
    phone?: string;
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    type: 'text' | 'image' | 'file';
    file_url?: string;
    is_read: boolean;
    created_at: string;
    sender?: User;
}

export interface Participant {
    id: number;
    user_id: number;
    conversation_id: number;
    user: User;
}

export interface Conversation {
    id: number;
    type: 'private' | 'group';
    name?: string;
    avatar?: string;
    updated_at: string;
    last_message?: Message;
    participants: Participant[];
    unread_count?: number;
    is_online?: boolean;
    last_seen?: string;
    user_id?: number;
}

