"use client"

import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, Wallet, Coins } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export function UserMenu() {
    const { user, logout, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 p-4 border-t border-zinc-800/50">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="border-t border-zinc-800/30 p-4">
            <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 ring-2 ring-[#39ff14]/20 ring-offset-2 ring-offset-background">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                    <AvatarFallback className="bg-[#39ff14]/10 text-[#39ff14] font-bold">
                        {user.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-sm truncate">{user.name}</span>
                    <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-[#39ff14]" />
                        <span className="text-xs text-[#39ff14] font-mono font-bold">
                            {user.wallet_balance ?? 0}
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white"
                    asChild
                    title="الإعدادات"
                >
                    <Link href="/settings"><Settings className="h-4 w-4" /></Link>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white"
                    asChild
                    title="المحفظة"
                >
                    <Link href="/wallet"><Wallet className="h-4 w-4" /></Link>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400"
                    onClick={() => logout()}
                    title="تسجيل الخروج"
                >
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
