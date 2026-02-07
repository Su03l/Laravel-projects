"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import api from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminUser } from "@/types" // Ensure this is exported from types
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2, Trash2, Ban, CheckCircle } from "lucide-react"

export default function AdminPage() {
    const { user } = useAuthStore()
    const router = useRouter()
    const [users, setUsers] = useState<AdminUser[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [banModalOpen, setBanModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
    const [banType, setBanType] = useState<'permanent' | 'temporary'>('permanent')
    const [banDays, setBanDays] = useState('7')

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/profile')
            return;
        }
        fetchUsers()
    }, [user, router])

    async function fetchUsers() {
        try {
            const response = await api.get('/admin/users')
            setUsers(response.data.users || response.data) // Adjust based on actual API response structure
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBanClick = (user: AdminUser) => {
        setSelectedUser(user)
        setBanModalOpen(true)
    }

    const confirmBan = async () => {
        if (!selectedUser) return;
        try {
            await api.post(`/admin/users/${selectedUser.id}/ban`, {
                type: banType,
                days: banType === 'temporary' ? banDays : null
            })
            toast.success("User banned successfully")
            setBanModalOpen(false)
            fetchUsers() // Refresh list
        } catch (e) {
            console.error(e)
        }
    }

    const handleRemoveAvatar = async (userId: number) => {
        if (!confirm("Are you sure you want to remove this user's avatar?")) return;
        try {
            await api.delete(`/admin/users/${userId}/avatar`)
            toast.success("Avatar removed")
            fetchUsers()
        } catch (e) {
            console.error(e)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>{u.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {u.avatar && <img src={u.avatar} className="w-6 h-6 rounded-full" />}
                                            {u.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{u.role}</TableCell>
                                    <TableCell>
                                        {u.is_banned ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Banned
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="destructive" size="sm" onClick={() => handleBanClick(u)}>
                                                <Ban className="w-4 h-4 mr-1" /> Ban
                                            </Button>
                                            {u.avatar && (
                                                <Button variant="outline" size="sm" onClick={() => handleRemoveAvatar(u.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={banModalOpen} onOpenChange={setBanModalOpen}>
                <DialogHeader>
                    <DialogTitle>Ban User: {selectedUser?.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Ban Type</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input type="radio" value="permanent" checked={banType === 'permanent'} onChange={() => setBanType('permanent')} />
                                Permanent
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" value="temporary" checked={banType === 'temporary'} onChange={() => setBanType('temporary')} />
                                Temporary
                            </label>
                        </div>
                    </div>
                    {banType === 'temporary' && (
                        <div className="space-y-2">
                            <Label>Days</Label>
                            <Input type="number" value={banDays} onChange={(e) => setBanDays(e.target.value)} min="1" />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setBanModalOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmBan}>Confirm Ban</Button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}
