"use client";

import { useState, useEffect } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { AnalogClock } from "@/components/features/analog-clock";
import api from "@/lib/api";
import { TimeResponse } from "@/types";

export default function TimePage() {
    const [data, setData] = useState<TimeResponse | null>(null);

    useEffect(() => {
        api.get<TimeResponse>('/tools/time').then(res => setData(res.data)).catch(console.error);
    }, []);

    return (
        <ToolShell
            title="ساعة الزمن"
            description="الوقت هو البعد الرابع. راقبه يمر بين الماضي والمستقبل."
        >
            <div className="flex justify-center">
                <AnalogClock
                    serverTime={data?.today}
                    futureText={data?.future}
                    pastText={data?.past}
                />
            </div>
        </ToolShell>
    );
}
