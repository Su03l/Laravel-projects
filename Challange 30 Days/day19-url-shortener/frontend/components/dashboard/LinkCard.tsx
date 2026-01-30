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
        <Card className="hover:border-sky-300 transition-all duration-200 bg-white border-slate-200 shadow-sm hover:shadow-md group">
            <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                    {/* Top Row: Name and Actions */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                                <ExternalLink className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{link.name || 'رابط بدون اسم'}</h3>
                                <span className="text-xs text-slate-400 font-medium">
                                    {new Date(link.created_at).toLocaleDateString('ar-EG')}
                                </span>
                            </div>
                        </div>

                        {/* Actions - Always visible or show on hover */}
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full" onClick={() => onEdit(link)} title="تعديل">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={() => onDelete(link.id)} title="حذف">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Middle: The Links */}
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 overflow-hidden">
                            <a
                                href={displayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                dir="ltr"
                                className="block text-xl font-bold text-sky-600 hover:text-sky-700 hover:underline truncate"
                            >
                                {displayUrl}
                            </a>
                            <p className="text-sm text-slate-500 truncate dir-ltr font-mono">
                                {link.original_url}
                            </p>
                        </div>
                        <Button
                            className="shrink-0 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
                            onClick={handleCopy}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            نسخ
                        </Button>
                    </div>

                    {/* Bottom: Stats */}
                    <div className="flex items-center justify-end border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            <BarChart2 className="h-4 w-4 text-slate-500" />
                            <span>{link.visits} زيارة</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
