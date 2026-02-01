"use client";

import { useState } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { Button } from "@/components/ui/button";
import { Copy, Wand2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { TextResponse } from "@/types";

export default function TextPage() {
    const [text, setText] = useState("");
    const [results, setResults] = useState<TextResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleProcess = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const res = await api.get<TextResponse>(`/tools/text?text=${encodeURIComponent(text)}`);
            setResults(res.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolShell title="منسق النصوص" description="أدوات ذكية لمعالجة النصوص وتحويلها.">
            <div className="grid gap-8 lg:grid-cols-12">
                {/* Input Area */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="relative rounded-3xl border border-slate-200 bg-white p-2 shadow-sm focus-within:ring-4 focus-within:ring-sky-100 transition-shadow">
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="اكتب النص هنا..."
                            className="h-64 w-full resize-none rounded-2xl bg-transparent p-6 text-lg placeholder:text-slate-300 focus:outline-none"
                        />
                        <div className="absolute bottom-4 left-4">
                            <Button onClick={handleProcess} disabled={loading || !text} className="shadow-lg shadow-sky-200 rounded-xl px-6">
                                <Wand2 className="ml-2 h-4 w-4" />
                                معالجة
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-7 space-y-4">
                    {results ? (
                        <>
                            <ResultRow label="Slug (URL Friendly)" value={results.slug} />
                            <ResultRow label="UPPERCASE" value={results.upper} />
                            <ResultRow label="Trimmed" value={results.trim} />
                            <ResultRow label="Limited Characters" value={results.limit} />
                        </>
                    ) : (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
                            <p>النتائج ستظهر هنا بعد المعالجة</p>
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}

function ResultRow({ label, value }: { label: string, value: string }) {
    const copy = () => {
        navigator.clipboard.writeText(value);
        toast.success("تم النسخ");
    };

    return (
        <div className="group flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
                <button onClick={copy} className="text-slate-300 hover:text-sky-600 transition-colors">
                    <Copy size={18} />
                </button>
            </div>
            <div className="font-mono text-lg text-slate-800 break-all" dir="ltr">
                {value}
            </div>
        </div>
    )
}
