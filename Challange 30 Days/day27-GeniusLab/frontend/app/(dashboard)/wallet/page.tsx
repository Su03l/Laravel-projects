"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, TrendingDown, Wallet as WalletIcon, Coins, ArrowUpDown } from "lucide-react"
import api from "@/lib/axios"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/context/AuthContext"

interface Transaction {
    id: number
    type: string
    credits: number
    description: string
    created_at: string
}

interface WalletData {
    stats: {
        current_balance: number
        total_usage: number
        total_deposits: number
    }
    transactions: Transaction[]
}

export default function WalletPage() {
    const { user } = useAuth()

    const { data, isLoading } = useQuery<WalletData>({
        queryKey: ['wallet'],
        queryFn: async () => {
            const res = await api.get('/api/wallet')
            return res.data
        }
    })

    const statCards = [
        {
            title: "الرصيد الحالي",
            value: data?.stats?.current_balance ?? user?.wallet_balance ?? 0,
            icon: WalletIcon,
            color: "#39ff14",
            suffix: "نقطة"
        },
        {
            title: "إجمالي الشحن",
            value: data?.stats?.total_deposits ?? 0,
            icon: TrendingUp,
            color: "#00d4ff",
            suffix: "نقطة"
        },
        {
            title: "إجمالي الاستخدام",
            value: Math.abs(data?.stats?.total_usage ?? 0),
            icon: TrendingDown,
            color: "#a855f7",
            suffix: "نقطة"
        },
    ]

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight gradient-text">المحفظة</h1>
                <p className="text-zinc-500 mt-1">إدارة رصيدك ومعاملاتك</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                {statCards.map((stat, i) => (
                    <Card key={i} className="glass border-zinc-800/30 hover-card-glow relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(135deg, ${stat.color}, transparent)` }} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                            <CardTitle className="text-sm font-medium text-zinc-400">{stat.title}</CardTitle>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold font-mono" style={{ color: stat.color }}>
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}
                            </div>
                            <p className="text-xs text-zinc-600 mt-1">{stat.suffix}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Transactions */}
            <Card className="glass border-zinc-800/30">
                <CardHeader className="flex flex-row items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-zinc-800/50 flex items-center justify-center">
                        <ArrowUpDown className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">سجل المعاملات</CardTitle>
                        <p className="text-xs text-zinc-500">آخر العمليات على حسابك</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800/30 hover:bg-transparent">
                                <TableHead className="text-right text-zinc-500">النوع</TableHead>
                                <TableHead className="text-right text-zinc-500">الوصف</TableHead>
                                <TableHead className="text-right text-zinc-500">التاريخ</TableHead>
                                <TableHead className="text-right text-zinc-500">القيمة</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#39ff14]" />
                                    </TableCell>
                                </TableRow>
                            ) : data?.transactions?.length ? (
                                data.transactions.map((t) => (
                                    <TableRow key={t.id} className="border-zinc-800/20 hover:bg-white/[0.02]">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {t.type === 'deposit' ? (
                                                    <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center">
                                                        <TrendingUp className="h-3 w-3 text-green-400" />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                                                        <TrendingDown className="h-3 w-3 text-red-400" />
                                                    </div>
                                                )}
                                                <span className="text-sm">{t.type === 'deposit' ? "إيداع" : "استخدام"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-400">{t.description}</TableCell>
                                        <TableCell className="text-sm text-zinc-500 font-mono">
                                            {new Date(t.created_at).toLocaleDateString('ar')}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-sm font-mono font-bold ${t.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                                                {t.type === 'deposit' ? "+" : "-"}{Math.abs(t.credits)}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-zinc-600">
                                        <Coins className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        لا يوجد معاملات بعد
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
