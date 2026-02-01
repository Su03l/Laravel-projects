"use client";

import { ToolShell } from "@/components/layout/tool-shell";
import { API_BASE_URL } from "@/lib/api";

export default function ImagePage() {
    // Since the user spec says GET /tools/image returns a PNG stream, 
    // we can simply display it.

    return (
        <ToolShell
            title="صورة عشوائية"
            description="عرض صورة تم توليدها أو جلبها من الخادم."
        >
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <img
                    src={`${API_BASE_URL}/tools/image`}
                    alt="Generated Content"
                    className="max-w-full rounded-lg shadow-md"
                />
                <p className="mt-4 text-sm text-slate-400">
                    يتم تحميل الصورة مباشرة من الخادم: /tools/image
                </p>
            </div>
        </ToolShell>
    );
}
