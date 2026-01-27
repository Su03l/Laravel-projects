"use client";

import { useEffect } from "react";

export default function LogSuppressor() {
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            const originalLog = console.log;
            const originalInfo = console.info;
            const originalWarn = console.warn;
            const originalError = console.error;

            const shouldSuppress = (args: any[]) => {
                const msg = args[0];
                if (typeof msg === 'string') {
                    return (
                        msg.includes('[Fast Refresh]') ||
                        msg.includes('[HMR]') ||
                        msg.includes('rebuilding')
                    );
                }
                return false;
            };

            console.log = (...args) => {
                if (!shouldSuppress(args)) originalLog.apply(console, args);
            };

            console.info = (...args) => {
                if (!shouldSuppress(args)) originalInfo.apply(console, args);
            };

        }
    }, []);

    return null;
}
