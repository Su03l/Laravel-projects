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

    if (!time) return <div className="h-48 w-full animate-pulse rounded-2xl bg-white/50" />;

    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');

    return (
        <div className={cn("group relative flex flex-col items-center justify-center py-10", className)}>

            {/* Ambient Back Glow */}
            <div className="absolute inset-0 -z-10 rounded-full bg-sky-400/20 blur-[100px] transition-opacity duration-1000 group-hover:bg-sky-400/30" />

            {/* Main Glass Container */}
            <div className="relative overflow-hidden rounded-[3rem] border border-white/40 bg-white/60 p-12 backdrop-blur-2xl shadow-xl transition-all duration-500 hover:shadow-sky-200/50 hover:scale-[1.02]">

                {/* Glossy overlay */}
                <div className="absolute -left-1/2 top-0 h-full w-[200%] rotate-45 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-20 pointer-events-none" />

                <div className="flex items-center gap-4 md:gap-8 cursor-default select-none">
                    {/* Hours */}
                    <NumberBlock value={hours} label="HOURS" />

                    {/* Animated Separator */}
                    <div className="flex flex-col gap-4 text-sky-500/80">
                        <div className="h-3 w-3 rounded-full bg-current shadow-[0_0_10px_currentColor] animate-pulse" />
                        <div className="h-3 w-3 rounded-full bg-current shadow-[0_0_10px_currentColor] animate-pulse delay-75" />
                    </div>

                    {/* Minutes */}
                    <NumberBlock value={minutes} label="MINUTES" />

                    {/* Animated Separator */}
                    <div className="flex flex-col gap-4 text-sky-500/80">
                        <div className="h-3 w-3 rounded-full bg-current shadow-[0_0_10px_currentColor] animate-pulse delay-150" />
                        <div className="h-3 w-3 rounded-full bg-current shadow-[0_0_10px_currentColor] animate-pulse delay-300" />
                    </div>

                    {/* Seconds (Highlighted) */}
                    <NumberBlock value={seconds} label="SECONDS" isHighlighted />
                </div>

                {/* Footer Info */}
                <div className="mt-10 flex items-center justify-between border-t border-slate-200/50 pt-6 text-sm">
                    <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Past</div>
                        <div className="font-medium text-slate-600 truncate max-w-[150px]" dir="ltr">{pastText || "--"}</div>
                    </div>

                    <div className="rounded-full bg-slate-100 px-4 py-1 text-xs font-bold text-slate-400 tracking-widest">
                        {time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}
                    </div>

                    <div className="text-left">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-sky-500">Future</div>
                        <div className="font-medium text-slate-600 truncate max-w-[150px]" dir="ltr">{futureText || "--"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NumberBlock({ value, label, isHighlighted }: { value: string, label: string, isHighlighted?: boolean }) {
    return (
        <div className="flex flex-col items-center">
            <div className={cn(
                "relative flex h-32 w-24 md:h-40 md:w-32 items-center justify-center rounded-2xl text-6xl md:text-8xl font-black tracking-tighter transition-all duration-300",
                isHighlighted
                    ? "bg-gradient-to-b from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-300/50 scale-105"
                    : "bg-white text-slate-800 shadow-sm border border-white/50"
            )}>
                <span className="z-10" dir="ltr">{value}</span>
                {/* Inner light reflection for depth */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            </div>
            <span className={cn(
                "mt-4 text-[10px] font-bold tracking-[0.2em] uppercase",
                isHighlighted ? "text-sky-600" : "text-slate-400"
            )}>
                {label}
            </span>
        </div>
    )
}
