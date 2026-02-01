"use client";

import { useState, useEffect } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { Clock } from "lucide-react";
import api from "@/lib/api";
import { TimeResponse } from "@/types";

export default function TimePage() {
    const [data, setData] = useState<TimeResponse | null>(null);

    useEffect(() => {
        // Fetch time on mount
        api.get<TimeResponse>('/tools/time').then(res => setData(res.data)).catch(console.error);
    }, []);

    return (
        <ToolShell
            title="الوقت والتاريخ"
            description="عرض التوقيت الحالي بتنسيقات مختلفة (الماضي، الحاضر، المستقبل)."
        >
            <div className="grid gap-6 md:grid-cols-3">
                <TimeCard title="الوقت الحالي" value={data?.today} color="text-sky-600" />
                <TimeCard title="المستقبل (+1 سنة)" value={data?.future} color="text-emerald-600" />
                <TimeCard title="الماضي (-1 سنة)" value={data?.past} color="text-amber-600" />
            </div>

            {!data && (
                <div className="mt-8 flex justify-center">
                    <Clock className="h-8 w-8 animate-spin text-slate-300" />
                </div>
            )}
        </ToolShell>
    );
}

function TimeCard({ title, value, color }: { title: string, value?: string, color: string }) {
    return (
        <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-center text-sm font-semibold text-slate-500">{title}</h3>
            <div className={`text-xl font-bold ${value ? color : 'text-slate-200'} font-mono`} dir="ltr">
                {value || "--:--:--"}
            </div>
        </div>
    )
}
