"use client"

import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { authService } from "@/services/authService"

export function DashboardNav() {
    const { user, logout } = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await authService.logout()
        } catch (e) {
            // Ignore 401 or other errors during logout
            console.warn("Logout failed on server, clearing local session.", e)
        } finally {
            logout()
            router.push("/login")
            toast.success("Logged out successfully")
        }
    }

    return (
        <header className="border-b bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/profile" className="text-lg font-bold">
                        AuthMaster
                    </Link>
                    <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
                        <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
                            Profile
                        </Link>
                        {user?.role === 'admin' && (
                            <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                                Admin Panel
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground mr-2">
                        {user?.name}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )
}
