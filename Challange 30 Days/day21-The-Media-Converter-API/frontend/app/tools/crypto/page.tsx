"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { Button } from "@/components/ui/button";
import { Bitcoin, RefreshCw, TrendingUp } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function CryptoPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchPrice = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/tools/crypto");
            setData(response.data);
        } catch (error) {
            toast.error("فشل في جلب أسعار العملات");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrice();
    }, [fetchPrice]);

    return (
        <ToolShell
            title="أسعار العملات الرقمية"
            description="تابع سعر البيتكوين (Bitcoin) لحظة بلحظة مقابل العملات العالمية."
        >
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex justify-end">
                    <Button onClick={fetchPrice} disabled={loading} variant="outline">
                        <RefreshCw className={`ml-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        تحديث السعر
                    </Button>
                </div>

                {loading ? (
                    <div className="h-48 w-full animate-pulse rounded-2xl bg-slate-100" />
                ) : data?.bpi ? (
                    <div className="grid gap-6 md:grid-cols-3">
                        {Object.keys(data.bpi).map((currency) => {
                            const item = data.bpi[currency];
                            return (
                                <div key={currency} className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{currency}</h3>
                                    <div className="mt-2 text-2xl font-black text-sky-600">
                                        {/* Dangerous HTML just for symbol if needed, or stick to simple text */}
                                        <span dangerouslySetInnerHTML={{ __html: item.symbol }} />
                                        {parseFloat(item.rate.replace(',', '')).toFixed(2)}
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        <Bitcoin className="mx-auto mb-4 h-12 w-12 opacity-20" />
                        لا توجد بيانات متاحة حالياً
                    </div>
                )}

                {data?.time && (
                    <div className="mt-8 text-center text-sm text-slate-400" dir="ltr">
                        Last updated: {data.time.updated}
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
