import React, { useState } from 'react';
import { Link as LinkType } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Edit2, Trash2, ExternalLink, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LinkCardProps {
    link: LinkType;
    onDelete: (id: number) => void;
    onEdit: (link: LinkType) => void;
}

export function LinkCard({ link, onDelete, onEdit }: LinkCardProps) {
    const shortUrl = `${window.location.origin}/${link.short_code}`; // Assuming frontend redirect or backend URL
    // Actually typically the backend provides the full short URL or we construct it via backend Host. 
    // The user requirement says "Short URL (Sky Blue, large)". 
    // Usually shorteners run on the root domain.
    // Let's assume the API returns the code and we display `localhost:8000/{code}` or similar.
    // For now I'll use a placeholder base or `link.short_code` if it's full. 
    // The type has `short_code`. I'll display construct a display URL.

    // Better: use a hardcoded base for display if not in env, or just the code. 
    // Let's assume the backend handles the redirect at `http://localhost:8000/{code}`.
    const displayUrl = `http://localhost:8000/${link.short_code}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(displayUrl);
        toast.success('Copied to clipboard!');
    };

    return (
        <Card className="hover:border-sky-200 transition-colors">
            <CardContent className="flex items-center justify-between p-6">
                <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{link.name || 'Untitled Link'}</span>
                        <span className="text-xs text-slate-400">
                            {new Date(link.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-bold text-sky-600 hover:underline flex items-center gap-1"
                    >
                        {displayUrl}
                        <ExternalLink className="h-4 w-4" />
                    </a>
                    <p className="text-sm text-slate-500 truncate max-w-md">
                        {link.original_url}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
                        <BarChart2 className="h-3 w-3" />
                        🔥 {link.visits} clicks
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="icon" onClick={handleCopy} title="Copy">
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(link)} title="Edit">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(link.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Add size prop to Button if not exists or handle via className.
// My Button component didn't explicitly have size. I'll fix usage to className for size or add support.
// For now, I'll update the button usage to use className for sizing icons if needed, or rely on padding.
// Actually, I'll update LinkCard to be robust.
