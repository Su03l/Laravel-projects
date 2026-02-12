"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare, Search, LayoutTemplate, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserMenu } from "./UserMenu"
import api from "@/lib/axios"
import { useState, useEffect } from "react"
import { useUIStore } from "@/store/ui-store"

// localStorage helper for chat history
function getLocalChats(): { id: string; title: string; created_at: string }[] {
    if (typeof window === "undefined") return []
    try {
        return JSON.parse(localStorage.getItem("genius_chats") || "[]")
    } catch {
        return []
    }
}

export function saveLocalChat(id: string, title: string) {
    if (typeof window === "undefined") return
    const chats = getLocalChats()
    // Don't duplicate
    if (chats.some(c => c.id === id)) return
    chats.unshift({ id, title, created_at: new Date().toISOString() })
    // Keep max 50
    localStorage.setItem("genius_chats", JSON.stringify(chats.slice(0, 50)))
}

export function removeLocalChat(id: string) {
    if (typeof window === "undefined") return
    const chats = getLocalChats().filter(c => c.id !== id)
    localStorage.setItem("genius_chats", JSON.stringify(chats))
}

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()
    const [search, setSearch] = useState("")
    const { closeSidebar } = useUIStore()

    const { data: chats, isLoading } = useQuery({
        queryKey: ['chats', search],
        queryFn: async () => {
            try {
                const res = await api.get(search ? `/api/chats/search?q=${search}` : '/api/chats')
                const apiChats = res.data?.data || res.data || []
                if (Array.isArray(apiChats) && apiChats.length > 0) {
                    // Sync API chats to localStorage
                    apiChats.forEach((c: any) => saveLocalChat(String(c.id), c.title))
                    return apiChats
                }
                return apiChats
            } catch {
                // Fallback to localStorage when API fails
                if (!search) {
                    return getLocalChats()
                }
                // Filter local chats by search
                return getLocalChats().filter(c =>
                    c.title.toLowerCase().includes(search.toLowerCase())
                )
            }
        },
        retry: 1,
        refetchOnWindowFocus: false,
    })

    return (
        <div className={cn("flex flex-col h-full glass-strong", className)}>
            {/* Logo */}
            <div className="px-4 pt-5 pb-2">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/20">
                        <Zap className="h-5 w-5 text-[#39ff14]" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        Genius<span className="text-[#39ff14]">Lab</span>
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="p-3 space-y-2">
                <Button
                    className="w-full justify-start gap-2 bg-[#39ff14] text-black font-bold hover:bg-[#39ff14]/80 h-11 glow-green"
                    asChild
                    onClick={closeSidebar}
                >
                    <Link href="/chat">
                        <Plus className="w-5 h-5" />
                        محادثة جديدة
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-zinc-800 hover:border-[#39ff14]/30 hover:text-[#39ff14] h-10 bg-transparent"
                    asChild
                    onClick={closeSidebar}
                >
                    <Link href="/templates">
                        <LayoutTemplate className="w-4 h-4" />
                        القوالب الجاهزة
                    </Link>
                </Button>

                <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-zinc-600" />
                    <Input
                        placeholder="بحث في المحادثات..."
                        className="pr-9 bg-black/20 border-zinc-800/50 focus-visible:ring-[#39ff14]/30 h-9 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1 px-2">
                <div className="space-y-1 p-1">
                    {!isLoading && Array.isArray(chats) && chats.map((chat: { id: string; title: string; created_at: string }) => (
                        <Button
                            key={chat.id}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-2 font-normal truncate h-auto py-3 px-3 rounded-xl transition-all",
                                pathname === `/chat/${chat.id}`
                                    ? "bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/10"
                                    : "hover:bg-white/5 text-zinc-400 hover:text-white"
                            )}
                            asChild
                            onClick={closeSidebar}
                        >
                            <Link href={`/chat/${chat.id}`}>
                                <MessageSquare className="w-4 h-4 shrink-0" />
                                <div className="flex flex-col items-start truncate overflow-hidden">
                                    <span className="truncate w-full text-right text-sm">{chat.title}</span>
                                    <span className="text-[10px] text-zinc-600">{new Date(chat.created_at).toLocaleDateString('ar')}</span>
                                </div>
                            </Link>
                        </Button>
                    ))}

                    {isLoading && (
                        <div className="space-y-2 p-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-10 w-full bg-white/5 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    )}

                    {!isLoading && (!chats || (Array.isArray(chats) && chats.length === 0)) && (
                        <div className="text-center text-zinc-600 text-xs py-8">
                            لا يوجد محادثات سابقة
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* User */}
            <UserMenu />
        </div>
    )
}
