"use client";

import { useState } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, ArrowRightLeft } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { TextResponse } from "@/types";

export default function TextPage() {
    const [text, setText] = useState("");
    const [results, setResults] = useState<TextResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleProcess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            // Assuming GET request as per original specs
            const res = await api.get<TextResponse>(`/tools/text?text=${encodeURIComponent(text)}`);
            setResults(res.data);
            toast.success("تمت المعالجة بنجاح");
        } catch (err) {
            toast.error("حدث خطأ في المعالجة");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (val: string) => {
        navigator.clipboard.writeText(val);
        toast.success("تم النسخ");
    };

    return (
        <ToolShell
            title="منسق النصوص"
            description="أداة بسيطة لتحويل النصوص: Slug, Uppercase, Trim, Limit."
        >
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-slate-900">إدخال النص</h3>
                        <form onSubmit={handleProcess} className="space-y-4">
                            <Input
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder="أكتب النص هنا..."
                                className="h-12 text-lg"
                            />
                            <Button type="submit" className="w-full" disabled={loading || !text.trim()}>
                                <ArrowRightLeft className="ml-2 h-4 w-4" />
                                {loading ? "جاري المعالجة..." : "تحويل النص"}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="space-y-4">
                    {results ? (
                        <>
                            <ResultItem label="Slug (رابط دائم)" value={results.slug} onCopy={() => copyToClipboard(results.slug)} />
                            <ResultItem label="Uppercase (حروف كبيرة)" value={results.upper} onCopy={() => copyToClipboard(results.upper)} />
                            <ResultItem label="Trimmed (بدون مسافات)" value={results.trim} onCopy={() => copyToClipboard(results.trim)} />
                            <ResultItem label="Limited (مختصر)" value={results.limit} onCopy={() => copyToClipboard(results.limit)} />
                        </>
                    ) : (
                        <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                            النتائج ستظهر هنا
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}

function ResultItem({ label, value, onCopy }: { label: string, value: string, onCopy: () => void }) {
    return (
        <div className="group relative rounded-lg border border-slate-200 bg-white p-4 hover:border-sky-300 transition-colors">
            <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
            <div className="flex items-center justify-between gap-2">
                <code className="block flex-1 overflow-x-auto font-mono text-sm text-slate-800" dir="ltr">
                    {value}
                </code>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-sky-600" onClick={onCopy}>
                    <Copy size={14} />
                </Button>
            </div>
        </div>
    )
}
