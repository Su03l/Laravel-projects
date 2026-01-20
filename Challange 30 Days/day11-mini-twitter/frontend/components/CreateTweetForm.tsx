'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/axios';

interface CreateTweetFormProps {
    onTweetCreated: () => void;
}

interface FormData {
    content: string;
}

export default function CreateTweetForm({ onTweetCreated }: CreateTweetFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>();
    const content = watch('content', '');

    const onSubmit = async (data: FormData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await api.post('/tweets', { content: data.content });
            reset();
            onTweetCreated();
        } catch (error) {
            console.error('Failed to create tweet:', error);
            showToast('فشل في نشر التغريدة', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-tweet-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                    {...register('content', {
                        required: 'Tweet content is required',
                        maxLength: { value: 280, message: 'Tweet must be 280 characters or less' }
                    })}
                    placeholder="What's on your mind?"
                    className="tweet-input"
                    rows={3}
                />
                {errors.content && (
                    <p className="error-text">{errors.content.message}</p>
                )}
                <div className="create-tweet-footer">
                    <span className="char-count">{content.length}/280</span>
                    <button
                        type="submit"
                        disabled={isSubmitting || content.length === 0 || content.length > 280}
                        className="post-btn"
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
