"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ClockProps {
    serverTime?: string; // We might use this to offset, but local time is smoother for animation
    futureText?: string;
    pastText?: string;
}

export function AnalogClock({ serverTime, futureText, pastText }: ClockProps) {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        // Client-side only to avoid hydration mismatch
        setTime(new Date());
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!time) return <div className="h-96 w-96 animate-pulse rounded-full bg-slate-100 opacity-20" />;

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    // Rotations
    const secDeg = (seconds / 60) * 360;
    const minDeg = ((minutes + seconds / 60) / 60) * 360;
    const hourDeg = ((hours % 12 + minutes / 60) / 12) * 360;

    return (
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden py-10">
            {/* Glow Effects */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-100 opacity-20 blur-3xl animate-pulse" />

            <div className="relative h-80 w-80 md:h-96 md:w-96">
                {/* Clock Face Background */}
                <div className="absolute inset-0 rounded-full border border-slate-100 bg-white/50 backdrop-blur-sm shadow-2xl" />

                {/* Outer Ring (Future) */}
                <div className="absolute -inset-12 rounded-full border border-dashed border-sky-100 animate-[spin_60s_linear_infinite]" />
                <div className="absolute -inset-12 flex items-center justify-center">
                    <span className="absolute -top-6 bg-white px-2 text-xs font-bold text-sky-400 uppercase tracking-widest">Future</span>
                </div>

                {/* Inner Ring (Past) */}
                <div className="absolute inset-8 rounded-full border border-slate-50" />

                {/* Markers */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute left-1/2 top-0 h-full w-[1px] bg-slate-200"
                        style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
                    >
                        <div className="absolute top-2 h-3 w-[1px] bg-slate-400" />
                        <div className="absolute bottom-2 h-3 w-[1px] bg-slate-400" />
                    </div>
                ))}

                {/* Hands */}
                {/* Hour */}
                <div
                    className="absolute left-1/2 top-1/2 h-24 w-1.5 -translate-x-1/2 -translate-y-full rounded-full bg-slate-800 shadow-md transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)`, transformOrigin: "bottom" }}
                />
                {/* Minute */}
                <div
                    className="absolute left-1/2 top-1/2 h-36 w-1 -translate-x-1/2 -translate-y-full rounded-full bg-slate-600 shadow-md transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-50%) rotate(${minDeg}deg)`, transformOrigin: "bottom" }}
                />
                {/* Second */}
                <div
                    className="absolute left-1/2 top-1/2 h-40 w-0.5 -translate-x-1/2 -translate-y-full bg-sky-500 shadow-sm transition-transform duration-300 ease-linear"
                    style={{ transform: `translateX(-50%) rotate(${secDeg}deg)`, transformOrigin: "bottom" }}
                >
                    <div className="absolute -bottom-4 left-1/2 h-8 w-1 -translate-x-1/2 bg-sky-500 rounded-b-full" />
                </div>

                {/* Center Cap */}
                <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sky-500 shadow-lg" />
            </div>

            {/* Data Display */}
            <div className="mt-12 w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="order-2 md:order-1 flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-white/60 shadow-sm backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 mb-1">الماضي</span>
                    <span className="text-sm font-medium text-slate-600" dir="ltr">{pastText || "..."}</span>
                </div>

                <div className="order-1 md:order-2">
                    <div className="text-6xl font-black tracking-tighter text-slate-900" dir="ltr">
                        {String(hours).padStart(2, '0')}
                        <span className="animate-pulse text-sky-500">:</span>
                        {String(minutes).padStart(2, '0')}
                    </div>
                    <div className="text-slate-400 font-medium mt-2" dir="ltr">{time.toDateString()}</div>
                </div>

                <div className="order-3 flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-white/60 shadow-sm backdrop-blur-md">
                    <span className="text-xs font-semibold text-sky-500 mb-1">المستقبل</span>
                    <span className="text-sm font-medium text-slate-600" dir="ltr">{futureText || "..."}</span>
                </div>
            </div>
        </div>
    );
}
