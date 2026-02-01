"use client";

import { useState } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Download, RefreshCw, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/api";

export default function QrPage() {
    const [text, setText] = useState("");
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            toast.error("الرجاء إدخال نص لتوليد الرمز");
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const url = `${API_BASE_URL}/tools/qr?text=${encodeURIComponent(text)}`;
            setQrUrl(url);
            toast.success("تم التوليد بنجاح");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolShell title="مولد رموز QR" description="أنشئ رموز استجابة سريعة فورية عالية الدقة.">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
                {/* Input Section */}
                <div className="rounded-[2.5rem] border border-white/50 bg-white p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-50 blur-3xl opacity-50 pointer-events-none" />

                    <div className="relative">
                        <h3 className="mb-6 text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Zap className="text-amber-500 fill-amber-500" size={24} />
                            إعدادات الرمز
                        </h3>

                        <form onSubmit={handleGenerate} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-lg font-medium text-slate-700">المحتوى (رابط أو نص)</label>
                                <Input
                                    placeholder="https://example.com"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="h-16 rounded-2xl border-slate-200 bg-slate-50 px-6 text-xl shadow-inner transition-all focus:bg-white focus:ring-4 focus:ring-sky-100"
                                    dir="ltr"
                                />
                            </div>
                            <Button type="submit" className="h-16 w-full rounded-2xl text-lg font-bold shadow-lg shadow-sky-200 transition-transform hover:-translate-y-1 active:translate-y-0" isLoading={isLoading}>
                                <RefreshCw className="ml-3 h-6 w-6" />
                                توليد الرمز الآن
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Result Preview */}
                <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-white/50 bg-slate-50/50 p-12 text-center min-h-[500px] relative">
                    {qrUrl ? (
                        <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center gap-8 w-full">
                            <div className="relative group cursor-pointer" onClick={() => window.open(qrUrl, '_blank')}>
                                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sky-400 to-indigo-400 opacity-20 blur-xl transition-opacity group-hover:opacity-40" />
                                <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={qrUrl} alt="QR Code" className="h-64 w-64 object-contain mix-blend-multiply" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full max-w-xs">
                                <Button variant="outline" className="h-14 rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold" onClick={() => window.open(qrUrl, '_blank')}>
                                    <Download className="ml-2 h-5 w-5" />
                                    تحميل الصورة
                                </Button>
                                <p className="text-xs text-slate-400 font-medium">PNG • High Quality</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-300 flex flex-col items-center gap-4">
                            <div className="h-32 w-32 rounded-3xl bg-slate-200/50 flex items-center justify-center border-2 border-dashed border-slate-300">
                                <QrCode size={48} className="opacity-20" />
                            </div>
                            <p className="text-lg font-medium">النتيجة ستظهر هنا</p>
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
