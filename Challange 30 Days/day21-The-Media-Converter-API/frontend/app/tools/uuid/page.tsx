"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { UuidResponse } from "@/types";

export default function UuidPage() {
    const [data, setData] = useState<UuidResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<UuidResponse>("/tools/uuid");
            setData(response.data);
            // Optional: Toast on refresh only if manual, but initial load shouldn't toast probably.
            // We'll leave it simple.
        } catch (error) {
            toast.error("فشل في جلب المعرفات");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        toast.success("تم النسخ بنجاح");
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const manualRefresh = () => {
        fetchData();
        toast.success("تم تحديث المعرفات");
    };

    return (
        <ToolShell
            title="مولد المعرفات (UUID)"
            description="توليد معرفات فريدة (Universally Unique Identifiers) لاستخدامها في الأنظمة."
        >
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex justify-end">
                    <Button onClick={manualRefresh} disabled={loading} variant="outline">
                        <RefreshCw className={`ml-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        تحديث
                    </Button>
                </div>

                <div className="grid gap-4">
                    {loading ? (
                        // Skeleton loading
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-200" />
                        ))
                    ) : data ? (
                        <>
                            <UuidItem
                                label="معرف فريد (UUID 1)"
                                value={data.id_1}
                                onCopy={() => copyToClipboard(data.id_1, 'id1')}
                                isCopied={copiedKey === 'id1'}
                            />
                            <UuidItem
                                label="معرف فريد (UUID 2)"
                                value={data.id_2}
                                onCopy={() => copyToClipboard(data.id_2, 'id2')}
                                isCopied={copiedKey === 'id2'}
                            />
                            <UuidItem
                                label="سلسلة عشوائية"
                                value={data.random_string}
                                onCopy={() => copyToClipboard(data.random_string, 'rand')}
                                isCopied={copiedKey === 'rand'}
                            />
                        </>
                    ) : (
                        <div className="text-center text-red-500">حدث خطأ في تحميل البيانات</div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}

function UuidItem({
    label,
    value,
    onCopy,
    isCopied
}: {
    label: string;
    value: string;
    onCopy: () => void;
    isCopied: boolean;
}) {
    return (
        <div className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-sky-300">
            <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
            <div className="flex items-center justify-between gap-4">
                <code className="font-mono text-sm text-slate-900">{value}</code>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={onCopy}
                    className={isCopied ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-slate-400 hover:text-sky-600"}
                >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                </Button>
            </div>
        </div>
    );
}
