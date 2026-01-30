import React from 'react';
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
    const displayUrl = `http://localhost:8000/${link.short_code}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(displayUrl);
        toast.success('تم النسخ يالذيب!');
    };

    return (
        <Card className="hover:border-sky-200 transition-colors">
            <CardContent className="flex items-center justify-between p-6">
                <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{link.name || 'رابط بدون اسم'}</span>
                        <span className="text-xs text-slate-400">
                            {new Date(link.created_at).toLocaleDateString('ar-EG')}
                        </span>
                    </div>
                    <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        className="text-lg font-bold text-sky-600 hover:underline flex items-center gap-1 text-left w-fit"
                    >
                        {displayUrl}
                        <ExternalLink className="h-4 w-4" />
                    </a>
                    <p className="text-sm text-slate-500 truncate max-w-md dir-ltr text-left">
                        {link.original_url}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
                        <BarChart2 className="h-3 w-3" />
                        🔥 {link.visits} زيارة
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="icon" onClick={handleCopy} title="نسخ">
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(link)} title="تعديل">
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(link.id)} title="حذف">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
