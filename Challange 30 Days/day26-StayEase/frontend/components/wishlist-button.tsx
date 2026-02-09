'use client';

import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useToggleFavorite, useFavorites } from '@/lib/api-hooks';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
    roomId: number;
    variant?: 'icon' | 'default';
    className?: string;
}

export function WishlistButton({ roomId, variant = 'icon', className }: WishlistButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const { data: favorites } = useFavorites();
    const toggleFavorite = useToggleFavorite();

    const isFavorited = favorites?.some((room: { id: number }) => room.id === roomId) || false;

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        try {
            await toggleFavorite.mutateAsync(roomId);
            toast.success(isFavorited ? 'تم الحذف من المفضلة' : 'تم الإضافة للمفضلة');
        } catch {
            toast.error('فشل تحديث المفضلة');
        } finally {
            setIsLoading(false);
        }
    };

    if (variant === 'icon') {
        return (
            <Button
                size="icon"
                variant="secondary"
                className={cn(
                    'h-9 w-9 rounded-full bg-white/90 hover:bg-white',
                    className
                )}
                onClick={handleToggle}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Heart
                        className={cn(
                            'h-4 w-4 transition-colors',
                            isFavorited ? 'fill-red-500 text-red-500' : 'text-stone-600'
                        )}
                    />
                )}
            </Button>
        );
    }

    return (
        <Button
            variant={isFavorited ? 'secondary' : 'outline'}
            className={className}
            onClick={handleToggle}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
                <Heart
                    className={cn(
                        'h-4 w-4 mr-2',
                        isFavorited && 'fill-red-500 text-red-500'
                    )}
                />
            )}
            {isFavorited ? 'محفوظ' : 'حفظ'}
        </Button>
    );
}
