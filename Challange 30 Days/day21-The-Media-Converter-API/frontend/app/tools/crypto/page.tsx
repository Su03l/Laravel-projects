"use client";

import { useState, useEffect } from "react";
import { ToolShell } from "@/components/layout/tool-shell";
import { Button } from "@/components/ui/button";
import { RefreshCw, DollarSign, Globe, Info } from "lucide-react";
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

    // Determine which currencies are available
    const availableCurrencies = data?.bpi ? Object.keys(data.bpi) : [];
    const hasData = availableCurrencies.length > 0;

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
                ) : hasData ? (
                    <div className={`grid gap-8 ${availableCurrencies.length === 1 ? 'md:grid-cols-1 max-w-lg mx-auto' : 'md:grid-cols-3'
                        }`}>
                        {availableCurrencies.map((code) => {
                            const info = data.bpi[code];
                            return (
                                <CryptoHugeCard
                                    key={code}
                                    currency={code}
                                    rate={info.rate}
                                    desc={info.description}
                                    icon={code === 'USD' ? DollarSign : Globe}
                                    color={code === 'USD' ? 'sky' : (code === 'GBP' ? 'indigo' : 'emerald')}
                                    scale={availableCurrencies.length === 1} // Scale up if it's the only one
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">لا توجد بيانات متاحة حالياً</p>
                        <p className="text-xs text-slate-400 mt-2">يرجى التحقق من اتصال الخادم</p>
                    </div>
                )}

                <div className="mt-12 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                    Powered by CoinDesk API
                </div>

                {data?.disclaimer && (
                    <div className="mt-4 flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-medium text-amber-600 border border-amber-100">
                            <Info size={14} />
                            {data.disclaimer}
                        </div>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}

function CryptoHugeCard({ rate, desc, icon: Icon, color, scale }: any) {
    const colorStyles: Record<string, string> = {
        sky: "bg-sky-50 text-sky-600 border-sky-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    const rateStr = String(rate || "0.00");

    const displayWhole = rateStr.includes('.') ? rateStr.split('.')[0] : rateStr;
    const displayFraction = rateStr.includes('.') ? rateStr.split('.')[1] : '00';

    return (
        <div className={`relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-lg transition-transform hover:-translate-y-2 hover:shadow-2xl ${scale ? 'p-12 scale-100 md:scale-110' : 'p-8'
            }`}>
            <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${colorStyles[color] || colorStyles.sky}`}>
                <Icon size={32} />
            </div>

            <h3 className="text-lg font-bold text-slate-400 uppercase tracking-wider">{desc}</h3>

            <div className="mt-4 flex items-baseline gap-1" dir="ltr">
                <span className={`font-black tracking-tighter text-slate-900 ${scale ? 'text-6xl md:text-7xl' : 'text-4xl lg:text-5xl'}`}>
                    {displayWhole}
                </span>
                <span className="text-xl font-bold text-slate-400">
                    .{displayFraction.substring(0, 2)}
                </span>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-500">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Rate
            </div>
        </div>
    )
}
