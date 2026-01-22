'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { useModal } from '@/contexts/ModalContext';

interface FollowButtonProps {
    userId: number;
    isFollowing: boolean;
    onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({ userId, isFollowing: initialIsFollowing, onFollowChange }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const { openLoginModal } = useModal();

    const handleClick = async () => {
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }

        setIsLoading(true);
        try {
            if (isFollowing) {
                await api.delete(`/follow/${userId}`);
                setIsFollowing(false);
                onFollowChange?.(false);
                toast.success('تم إلغاء المتابعة');
            } else {
                await api.post('/follow', { user_id: userId });
                setIsFollowing(true);
                onFollowChange?.(true);
                toast.success('تمت المتابعة');
            }
        } catch {
            toast.error('حدث خطأ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`px-5 py-2 font-medium transition-colors disabled:opacity-50 ${isFollowing
                    ? 'bg-transparent border border-white/30 text-white hover:border-blue-500 hover:bg-blue-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
        >
            {isLoading ? '...' : isFollowing ? 'متابَع' : 'متابعة'}
        </button>
    );
}
