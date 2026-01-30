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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">عدد روابطك</CardTitle>
                    <LinkIcon className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalLinks}</div>
                    <p className="text-muted-foreground text-xs">
                        روابط شغالة
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">مجموع الزيارات</CardTitle>
                    <BarChart3 className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalVisits}</div>
                    <p className="text-muted-foreground text-xs">
                        زيارة لكل الروابط
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
