"use client";

import { useState, useEffect } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { DigitalClock } from "@/components/features/digital-clock";
import api from "@/lib/api";
import { TimeResponse } from "@/types";

export default function TimePage() {
    const [data, setData] = useState<TimeResponse | null>(null);

    useEffect(() => {
        api.get<TimeResponse>('/tools/time').then(res => setData(res.data)).catch(console.error);
    }, []);

    return (
        <ToolShell
            title="الساعة الرقمية"
            description="متابعة دقيقة للوقت مع مقارنات زمنية ذكية."
        >
            <div className="flex min-h-[500px] items-center justify-center bg-slate-50/50 p-8 rounded-3xl">
                <DigitalClock
                    futureText={data?.future}
                    pastText={data?.past}
                    className="scale-100 md:scale-110"
                />
            </div>
        </ToolShell>
    );
}
