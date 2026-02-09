'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useCreateReview } from '@/lib/api-hooks';

interface ReviewModalProps {
    bookingId: number;
    roomNumber: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ReviewModal({ bookingId, roomNumber, isOpen, onClose, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createReview = useCreateReview();

    const handleSubmit = async () => {
        if (!comment.trim()) {
            toast.error('الرجاء كتابة تعليق');
            return;
        }

        setIsSubmitting(true);
        try {
            await createReview.mutateAsync({
                booking_id: bookingId,
                rating,
                comment: comment.trim(),
            });
            toast.success('تم إرسال تقييمك بنجاح!');
            onSuccess?.();
            onClose();
            setComment('');
            setRating(5);
        } catch {
            toast.error('فشل إرسال التقييم');
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayRating = hoveredRating ?? rating;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md text-right">
                <DialogHeader>
                    <DialogTitle className="font-display text-right">كتابة تقييم</DialogTitle>
                    <DialogDescription className="text-right">
                        شاركنا تجربتك في الإقامة في الغرفة {roomNumber}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Star Rating */}
                    <div className="space-y-3">
                        <Label>تقييمك</Label>
                        <div className="flex items-center gap-1 flex-row-reverse justify-end">
                            <span className="mr-3 text-lg font-semibold">{displayRating}.0</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(null)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors ${star <= displayRating
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-muted-foreground'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-3">
                        <Label htmlFor="review-comment">تعليقك</Label>
                        <textarea
                            id="review-comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="خبرنا عن إقامتك..."
                            className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none text-right"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose}>
                        إلغاء
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                        إرسال التقييم
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
