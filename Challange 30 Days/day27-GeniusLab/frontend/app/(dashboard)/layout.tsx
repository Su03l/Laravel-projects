"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Header } from "@/components/dashboard/Header"
import { Sidebar } from "@/components/dashboard/Sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center space-y-4">
                    <div className="relative w-12 h-12 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-[#39ff14]/20" />
                        <Loader2 className="h-12 w-12 animate-spin text-[#39ff14]" />
                    </div>
                    <p className="text-zinc-500 text-sm">جاري التحميل...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="grid min-h-screen md:grid-cols-[280px_1fr] bg-background">
            <aside className="hidden md:block border-l border-zinc-800/50">
                <Sidebar className="sticky top-0 h-screen" />
            </aside>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-gradient-to-b from-background to-background/95">
                    {children}
                </main>
            </div>
        </div>
    )
}
