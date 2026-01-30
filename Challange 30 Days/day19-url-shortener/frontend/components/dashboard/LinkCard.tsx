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
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-slate-900">{link.name || 'رابط بدون اسم'}</span>
                        <span className="text-sm text-slate-400">
                            {new Date(link.created_at).toLocaleDateString('ar-EG')}
                        </span>
                    </div>
                    <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        className="text-2xl font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-2 text-left w-fit"
                    >
                        {displayUrl}
                        <ExternalLink className="h-5 w-5" />
                    </a>
                    <p className="text-base text-slate-500 truncate max-w-lg dir-ltr text-left mt-1">
                        {link.original_url}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold mt-3">
                        <BarChart2 className="h-5 w-5 text-orange-500" />
                        {link.visits} زيارة
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="h-10 w-10 p-0 rounded-lg" onClick={handleCopy} title="نسخ">
                        <Copy className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-lg" onClick={() => onEdit(link)} title="تعديل">
                        <Edit2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(link.id)} title="حذف">
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
