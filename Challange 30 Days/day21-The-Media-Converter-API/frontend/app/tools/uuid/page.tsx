"use client";

import { useState, useCallback, useEffect } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Layers, Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { UuidResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function UuidPage() {
    const [data, setData] = useState<UuidResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<UuidResponse>("/tools/uuid");
            setData(response.data);
        } catch {
            toast.error("فشل الاتصال");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        toast.success("تم النسخ");
        setTimeout(() => setCopiedKey(null), 1500);
    };

    return (
        <ToolShell title="مولد المعرفات (UUID)" description="معرفات فريدة عالمية (Universally Unique Identifiers) جاهزة للاستخدام.">
            <div className="mx-auto max-w-4xl space-y-10">

                <div className="flex justify-end">
                    <Button
                        onClick={fetchData}
                        disabled={loading}
                        size="lg"
                        className="rounded-xl px-8 font-bold shadow-lg shadow-sky-100"
                    >
                        <RefreshCw className={cn("ml-2 h-5 w-5", loading && "animate-spin")} />
                        توليد دفعة جديدة
                    </Button>
                </div>

                <div className="grid gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-32 animate-pulse rounded-3xl bg-slate-100" />)
                    ) : data ? (
                        <>
                            <UuidBigCard
                                label="Primary UUID (v4)"
                                value={data.id_1}
                                copied={copiedKey === 'id1'}
                                onCopy={() => copyToClipboard(data.id_1, 'id1')}
                                idx="01"
                            />
                            <UuidBigCard
                                label="Secondary UUID (v4)"
                                value={data.id_2}
                                copied={copiedKey === 'id2'}
                                onCopy={() => copyToClipboard(data.id_2, 'id2')}
                                idx="02"
                            />
                            <UuidBigCard
                                label="Random Crypto String"
                                value={data.random_string}
                                copied={copiedKey === 'rand'}
                                onCopy={() => copyToClipboard(data.random_string, 'rand')}
                                idx="03"
                                isMono={true}
                            />
                        </>
                    ) : null}
                </div>
            </div>
        </ToolShell>
    );
}

function UuidBigCard({ label, value, copied, onCopy, idx, isMono = true }: any) {
    return (
        <div
            onClick={onCopy}
            className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-400">{idx}</span>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">{label}</h3>
                    </div>
                    <div className={cn(
                        "break-all text-xl md:text-3xl font-bold text-slate-800 transition-colors group-hover:text-sky-600",
                        isMono && "font-mono"
                    )} dir="ltr">
                        {value}
                    </div>
                </div>

                <div className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
                    copied ? "bg-green-100 text-green-600 scale-110" : "bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500"
                )}>
                    {copied ? <Check size={32} /> : <Copy size={28} />}
                </div>
            </div>
        </div>
    )
}
