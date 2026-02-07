"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, token } = useAuthStore()
    const router = useRouter()
    // Hydration fix: Zustand persist needs time to rehydrate from localStorage
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    useEffect(() => {
        if (isHydrated && (!isAuthenticated || !token)) {
            router.push("/login")
        }
    }, [isHydrated, isAuthenticated, token, router])

    if (!isHydrated || !isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <DashboardNav />
            <main className="container mx-auto py-6 px-4">
                {children}
            </main>
        </div>
    )
}
