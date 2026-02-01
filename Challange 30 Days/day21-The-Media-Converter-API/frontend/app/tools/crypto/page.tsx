"use client";

import { useState, useEffect } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { Button } from "@/components/ui/button";
import { TrendingUp, RefreshCw, DollarSign, Globe } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function CryptoPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchPrice = async () => {
        setLoading(true);
        try {
            const response = await api.get("/tools/crypto");
            setData(response.data);
        } catch {
            toast.error("خطأ في الاتصال");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPrice(); }, []);

    return (
        <ToolShell title="أسعار العملات الرقمية" description="متابعة حية لسعر البيتكوين (BTC) مقابل العملات العالمية.">
            <div className="mx-auto max-w-5xl">
                {/* Helper Actions */}
                <div className="mb-8 flex justify-end">
                    <Button variant="ghost" onClick={fetchPrice} disabled={loading} className="text-slate-500 hover:text-sky-600">
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading && "animate-spin"}`} />
                        تحديث البيانات
                    </Button>
                </div>

                {loading ? (
                    <div className="grid gap-8 md:grid-cols-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 animate-pulse rounded-[2.5rem] bg-slate-100" />)}
                    </div>
                ) : data?.bpi ? (
                    <div className="grid gap-8 md:grid-cols-3">
                        <CryptoHugeCard
                            currency="USD"
                            rate={data.bpi.USD.rate}
                            desc={data.bpi.USD.description}
                            icon={DollarSign}
                            color="sky"
                        />
                        <CryptoHugeCard
                            currency="GBP"
                            rate={data.bpi.GBP.rate}
                            desc={data.bpi.GBP.description}
                            icon={Globe}
                            color="indigo"
                        />
                        <CryptoHugeCard
                            currency="EUR"
                            rate={data.bpi.EUR.rate}
                            desc={data.bpi.EUR.description}
                            icon={Globe}
                            color="emerald"
                        />
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400">لا توجد بيانات</div>
                )}

                <div className="mt-12 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                    Powered by CoinDesk API
                </div>
            </div>
        </ToolShell>
    );
}

function CryptoHugeCard({ currency, rate, desc, icon: Icon, color }: any) {
    const colorStyles: Record<string, string> = {
        sky: "bg-sky-50 text-sky-600 border-sky-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-lg transition-transform hover:-translate-y-2 hover:shadow-2xl">
            <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${colorStyles[color]}`}>
                <Icon size={32} />
            </div>

            <h3 className="text-lg font-bold text-slate-400 uppercase tracking-wider">{desc}</h3>

            <div className="mt-4 flex items-baseline gap-1" dir="ltr">
                <span className={`text-4xl lg:text-5xl font-black tracking-tighter text-slate-900`}>
                    {rate.split('.')[0]}
                </span>
                <span className="text-xl font-bold text-slate-400">
                    .{rate.split('.')[1]?.slice(0, 2) || "00"}
                </span>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-500">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Rate
            </div>
        </div>
    )
}
