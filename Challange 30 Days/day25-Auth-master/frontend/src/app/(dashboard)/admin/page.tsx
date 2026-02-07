"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import api from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminUser } from "@/types"
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
import { Loader2, Trash2, Ban, CheckCircle, Shield, Plus } from "lucide-react"

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
            setUsers(response.data.data || response.data)
        } catch (e) {
            console.error(e)
            toast.error("فشل في جلب قائمة المستخدمين")
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
            toast.success("تم حظر المستخدم بنجاح")
            setBanModalOpen(false)
            fetchUsers() // Refresh list
        } catch (e) {
            toast.error("فشل حظر المستخدم")
        }
    }

    const handleRemoveAvatar = async (userId: number) => {
        if (!confirm("هل أنت متأكد من حذف صورة هذا المستخدم؟")) return;
        try {
            await api.delete(`/admin/users/${userId}/avatar`)
            toast.success("تم حذف الصورة")
            fetchUsers()
        } catch (e) {
            toast.error("فشل حذف الصورة")
        }
    }

    if (isLoading) {
        return <div className="flex justify-center p-8 pt-20"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>
    }

    return (
        <div className="space-y-6 pt-20 pb-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent w-fit">
                    لوحة التحكم
                </h1>
                <Button onClick={() => router.push('/admin/create-user')} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة مستخدم
                </Button>
            </div>

            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl ring-1 ring-white/50">
                <CardHeader>
                    <CardTitle className="text-xl">إدارة المستخدمين</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <Table dir="rtl">
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="text-right">#</TableHead>
                                    <TableHead className="text-right">الاسم</TableHead>
                                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                                    <TableHead className="text-right">الدور</TableHead>
                                    <TableHead className="text-right">الحالة</TableHead>
                                    <TableHead className="text-right">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell>{u.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {u.avatar ? (
                                                    <img src={u.avatar} className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                                        {u.name ? u.name.charAt(0) : "?"}
                                                    </div>
                                                )}
                                                <span className="font-medium">{u.name || "مستخدم غير معروف"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{u.email}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {u.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {u.is_banned ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                                    <Ban className="w-3 h-3" />
                                                    محظور
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                                    <CheckCircle className="w-3 h-3" />
                                                    نشط
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="destructive" size="sm" onClick={() => handleBanClick(u)} title="حظر">
                                                    <Ban className="w-4 h-4" />
                                                </Button>
                                                {u.avatar && (
                                                    <Button variant="outline" size="sm" onClick={() => handleRemoveAvatar(u.id)} title="حذف الصورة">
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={banModalOpen} onOpenChange={setBanModalOpen}>
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"></div>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                حظر المستخدم: {selectedUser?.name}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-6">
                            <div className="space-y-3">
                                <Label className="text-base">نوع الحظر</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all flex-1">
                                        <input type="radio" value="permanent" checked={banType === 'permanent'} onChange={() => setBanType('permanent')} className="text-red-600 focus:ring-red-500" />
                                        <span className="font-medium">دائم</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-orange-200 hover:bg-orange-50 transition-all flex-1">
                                        <input type="radio" value="temporary" checked={banType === 'temporary'} onChange={() => setBanType('temporary')} className="text-orange-600 focus:ring-orange-500" />
                                        <span className="font-medium">مؤقت</span>
                                    </label>
                                </div>
                            </div>
                            {banType === 'temporary' && (
                                <div className="space-y-2">
                                    <Label>عدد الأيام</Label>
                                    <Input type="number" value={banDays} onChange={(e) => setBanDays(e.target.value)} min="1" className="text-center" />
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setBanModalOpen(false)}>إلغاء</Button>
                            <Button variant="destructive" onClick={confirmBan}>تأكيد الحظر</Button>
                        </DialogFooter>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
