"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ClockProps {
    futureText?: string;
    pastText?: string;
    className?: string;
}

export function DigitalClock({ futureText, pastText, className }: ClockProps) {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!time) return <div className="h-64 w-full animate-pulse rounded-2xl bg-slate-100" />;

    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');

    return (
        <div className={cn("relative flex flex-col items-center", className)}>
            {/* Desk Surface (Shadow) */}
            <div className="absolute bottom-8 h-4 w-[90%] rounded-[100%] bg-black/10 blur-xl" />

            {/* Clock Body */}
            <div className="relative z-10 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl ring-1 ring-slate-900/5 transition-transform hover:-translate-y-1">
                {/* Screen Area */}
                <div className="relative mb-6 flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-8 py-6 shadow-inner">

                    {/* Hour Group */}
                    <div className="flex flex-col items-center">
                        <div className="flex h-24 w-20 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                            <span className="font-mono text-6xl font-bold text-slate-900 tracking-tighter" dir="ltr">{hours}</span>
                        </div>
                        <span className="mt-2 text-xs font-medium text-slate-400">HOURS</span>
                    </div>

                    {/* Separator */}
                    <div className="flex flex-col gap-3 pb-6">
                        <div className="h-3 w-3 rounded-full bg-sky-500 animate-pulse shadow-glow" />
                        <div className="h-3 w-3 rounded-full bg-sky-500 animate-pulse shadow-glow" />
                    </div>

                    {/* Minute Group */}
                    <div className="flex flex-col items-center">
                        <div className="flex h-24 w-20 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                            <span className="font-mono text-6xl font-bold text-slate-900 tracking-tighter" dir="ltr">{minutes}</span>
                        </div>
                        <span className="mt-2 text-xs font-medium text-slate-400">MINS</span>
                    </div>

                    {/* Separator */}
                    <div className="flex flex-col gap-3 pb-6">
                        <div className="h-3 w-3 rounded-full bg-slate-300" />
                        <div className="h-3 w-3 rounded-full bg-slate-300" />
                    </div>

                    {/* Second Group */}
                    <div className="flex flex-col items-center">
                        <div className="flex h-24 w-20 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                            <span className="font-mono text-6xl font-bold text-sky-600 tracking-tighter" dir="ltr">{seconds}</span>
                        </div>
                        <span className="mt-2 text-xs font-medium text-slate-400">SECS</span>
                    </div>
                </div>

                {/* Date Display */}
                <div className="mb-8 text-sm font-medium uppercase tracking-widest text-slate-500" dir="ltr">
                    {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                {/* Footer Info (Past/Future) */}
                <div className="grid w-full grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                    <div className="text-center border-r border-slate-100 pr-4">
                        <p className="text-xs font-semibold text-sky-600">المستقبل القريب</p>
                        <p className="mt-1 text-sm text-slate-700" dir="ltr">{futureText || "--"}</p>
                    </div>
                    <div className="text-center pl-4">
                        <p className="text-xs font-semibold text-amber-600">منذ عام</p>
                        <p className="mt-1 text-sm text-slate-700" dir="ltr">{pastText || "--"}</p>
                    </div>
                </div>
            </div>

            {/* Reflection/Stand Effect */}
            <div className="absolute -bottom-4 z-0 h-8 w-[80%] bg-gradient-to-t from-white to-transparent opacity-50 blur-sm" />
        </div>
    );
}
