"use client";

import { useState } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Download, RefreshCw } from "lucide-react";
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
        // In this specific case, since the API returns an image stream/blob directly via GET,
        // we can construct the URL directly. 
        // However, to ensure validity, we might want to fetch it or just display it.
        // Displaying directly is faster and easier for standard img tags.
        // Let's assume direct URL usage for Image, but if we needed to "download", we might need to fetch blob.

        try {
            // Simulate "processing" for better UX
            await new Promise(resolve => setTimeout(resolve, 600));

            const url = `${API_BASE_URL}/tools/qr?text=${encodeURIComponent(text)}`;
            setQrUrl(url);
            toast.success("تم توليد رمز QR بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء توليد الرمز");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolShell
            title="مولد رموز QR"
            description="قم بتحويل أي نص أو رابط إلى رمز استجابة سريعة (QR Code)."
        >
            <div className="grid gap-6 md:grid-cols-2">
                {/* Input Section */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="text" className="text-sm font-medium text-slate-700">
                                النص أو الرابط
                            </label>
                            <Input
                                id="text"
                                placeholder="https://example.com"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                autoFocus
                                className="text-left ltr" // Force LTR for URLs if needed, but 'text-left' is good for URLs
                                dir="ltr"
                            />
                        </div>
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            <RefreshCw className="ml-2 h-4 w-4" />
                            توليد الرمز
                        </Button>
                    </form>
                </div>

                {/* Result Section */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-h-[300px]">
                    {qrUrl ? (
                        <div className="space-y-4 text-center animate-in zoom-in-95 duration-300">
                            <div className="overflow-hidden rounded-lg border-2 border-dashed border-slate-200 p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={qrUrl}
                                    alt="QR Code"
                                    className="h-48 w-48 object-contain"
                                    key={qrUrl} // Force re-render on new URL
                                />
                            </div>
                            <div className="flex justify-center">
                                <Button variant="outline" size="sm" onClick={() => {
                                    window.open(qrUrl, '_blank');
                                    toast.success("جاري فتح الصورة...");
                                }}>
                                    <Download className="ml-2 h-4 w-4" />
                                    تحميل / فتح
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-400">
                            <QrCode className="mx-auto mb-3 h-12 w-12 opacity-50" />
                            <p>أدخل النص للمعاينة هنا</p>
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
