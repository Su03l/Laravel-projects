import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart3, Link as LinkIcon } from 'lucide-react';

interface StatsProps {
    totalLinks: number;
    totalVisits: number;
}

export function Stats({ totalLinks, totalVisits }: StatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-bold text-slate-700">عدد روابطك</CardTitle>
                    <LinkIcon className="text-sky-500 h-6 w-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-extrabold text-slate-900">{totalLinks}</div>
                    <p className="text-slate-500 text-sm mt-1">
                        روابط شغالة
                    </p>
                </CardContent>
            </Card>
            <Card className="p-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-bold text-slate-700">مجموع الزيارات</CardTitle>
                    <BarChart3 className="text-sky-500 h-6 w-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-extrabold text-slate-900">{totalVisits}</div>
                    <p className="text-slate-500 text-sm mt-1">
                        زيارة لكل الروابط
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
