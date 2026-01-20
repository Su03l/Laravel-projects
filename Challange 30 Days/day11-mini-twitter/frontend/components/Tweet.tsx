'use client';

import { Trash2 } from 'lucide-react';

interface TweetProps {
    tweet: {
        id: number;
        content: string;
        author?: {
            name: string;
            username: string;
        };
        user?: {
            name: string;
            username: string;
        };
        created_at: string;
        is_mine: boolean;
    };
    onDelete: (id: number) => void;
}

export default function Tweet({ tweet, onDelete }: TweetProps) {
    const handleDelete = () => {
        onDelete(tweet.id);
    };

    // Handle both author and user fields from API
    const author = tweet.author || tweet.user;

    if (!author) {
        return null;
    }

    const authorName = author.name || 'Unknown';
    const authorUsername = author.username || '@unknown';

    return (
        <article className="post-card">
            <div className="post-header">
                <div className="post-avatar">
                    {authorName.charAt(0).toUpperCase()}
                </div>
                <div className="post-meta">
                    <span className="post-author">{authorName}</span>
                    <span className="post-username">{authorUsername}</span>
                </div>
                <span className="post-time">{tweet.created_at}</span>
                {tweet.is_mine && (
                    <button onClick={handleDelete} className="post-delete" aria-label="Delete">
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
            <div className="post-body">
                <p>{tweet.content}</p>
            </div>
        </article>
    );
}
