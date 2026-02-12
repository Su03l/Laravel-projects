"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Zap, Coins } from "lucide-react"
import { Sidebar } from "./Sidebar"
import { useAuth } from "@/context/AuthContext"

export function Header() {
    const { user } = useAuth()

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 glass-strong border-b border-zinc-800/30 px-4 md:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 md:hidden hover:bg-white/5">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 border-zinc-800/50 bg-zinc-950 w-[280px]">
                    <Sidebar />
                </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 font-bold text-lg tracking-tight md:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
                    <Zap className="h-4 w-4 text-[#39ff14]" />
                </div>
                <span>
                    Genius<span className="text-[#39ff14]">Lab</span>
                </span>
            </div>

            <div className="mr-auto flex items-center gap-3">
                {user && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-zinc-800/50">
                        <Coins className="w-3.5 h-3.5 text-[#39ff14]" />
                        <span className="text-sm font-mono font-bold text-[#39ff14]">{user.wallet_balance ?? 0}</span>
                        <span className="text-xs text-zinc-500">نقطة</span>
                    </div>
                )}
            </div>
        </header>
    )
}
