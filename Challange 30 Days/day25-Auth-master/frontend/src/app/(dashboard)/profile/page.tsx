"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import api from "@/services/api"
import { User, Phone, Save, Shield, KeyRound, Loader2, UploadCloud } from "lucide-react"

const profileSchema = z.object({
    name: z.string().min(2),
    phone: z.string().min(10).optional().or(z.literal("")),
})

const passwordSchema = z.object({
    current_password: z.string().min(1),
    password: z.string().min(8),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
})

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone || "",
        },
    })

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
    })

    async function onProfileSubmit(data: z.infer<typeof profileSchema>) {
        setIsLoading(true)
        try {
            // Send as JSON since backend handles it or formData?
            // The DTO handles request->file('avatar') separately.
            // Request->input('name') handles JSON or Form.
            const response = await api.post('/profile/update', data)
            updateUser(response.data.data || response.data)
            toast.success("Profile updated successfully")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    async function onPasswordSubmit(data: z.infer<typeof passwordSchema>) {
        setIsLoading(true)
        try {
            await api.post('/profile/change-password', data)
            toast.success("Password changed successfully")
            passwordForm.reset()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to change password")
        } finally {
            setIsLoading(false)
        }
    }

    async function toggle2FA() {
        try {
            const shouldEnable = !user?.two_factor_enabled;
            const response = await api.post('/profile/2fa', { enable: shouldEnable })
            updateUser({ ...user!, two_factor_enabled: shouldEnable })
            toast.success(response.data.message || "2FA status updated")
        } catch (e) {
            console.error(e)
            toast.error("Failed to update 2FA settings")
        }
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('avatar', file);
        // We must also append other fields if the backend replaces them with null if missing?
        // DTO logic: `name: $request->input('name')`. If missing in input, it might be null.
        // If we only send avatar, name might become null!
        // Let's send current name/phone as well to be safe.
        formData.append('name', user?.name || "");
        if (user?.phone) formData.append('phone', user.phone);

        setIsUploading(true);
        try {
            const res = await api.post('/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            updateUser(res.data.data || res.data);
            toast.success("Avatar updated");
        } catch (e) {
            toast.error("Failed to upload avatar")
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Profile Settings
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Manage your account information and security details.
                    </p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-12">
                {/* Left Column: Avatar & Personal Info */}
                <div className="md:col-span-12 lg:col-span-7 space-y-8">
                    <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-xl ring-1 ring-white/50">
                        <CardHeader>
                            <CardTitle className="text-2xl text-left bg-transparent text-foreground">Personal Information</CardTitle>
                            <CardDescription className="text-left">
                                Update your photo and personal details here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 p-1 shadow-lg relative group">
                                    <div className="h-full w-full rounded-full bg-white overflow-hidden flex items-center justify-center relative">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <span className="text-3xl font-bold text-blue-600">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Loader2 className="h-8 w-8 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <label htmlFor="avatar" className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors hover:scale-105 active:scale-95">
                                        <UploadCloud className="h-4 w-4" />
                                        <input
                                            id="avatar"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                                <div className="text-center sm:text-left space-y-1">
                                    <h3 className="font-semibold text-lg text-foreground">Profile Photo</h3>
                                    <p className="text-sm text-muted-foreground">
                                        This will be displayed on your profile.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            startIcon={<User className="h-4 w-4" />}
                                            {...profileForm.register("name")}
                                            error={profileForm.formState.errors.name?.message}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            startIcon={<Phone className="h-4 w-4" />}
                                            {...profileForm.register("phone")}
                                            error={profileForm.formState.errors.phone?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto min-w-[150px]">
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Security */}
                <div className="md:col-span-12 lg:col-span-5 space-y-8">
                    <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-xl ring-1 ring-white/50 h-full">
                        <CardHeader>
                            <CardTitle className="text-2xl text-left bg-transparent text-foreground">Security Settings</CardTitle>
                            <CardDescription className="text-left">
                                Manage your password and 2FA.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* 2FA Toggle */}
                            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                                            <p className="text-xs text-muted-foreground">Add an extra layer of security.</p>
                                        </div>
                                    </div>
                                    <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${user?.two_factor_enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                        onClick={toggle2FA}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user?.two_factor_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </div>

                            {/* Password Form */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2">
                                    <KeyRound className="h-5 w-5 text-muted-foreground" />
                                    <h3 className="font-medium">Change Password</h3>
                                </div>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">Current Password</Label>
                                        <Input id="current_password" type="password" {...passwordForm.register("current_password")} error={passwordForm.formState.errors.current_password?.message} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password">New Password</Label>
                                        <Input id="new_password" type="password" {...passwordForm.register("password")} error={passwordForm.formState.errors.password?.message} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                        <Input id="password_confirmation" type="password" {...passwordForm.register("password_confirmation")} error={passwordForm.formState.errors.password_confirmation?.message} />
                                    </div>
                                    <Button type="submit" isLoading={isLoading} variant="outline" className="w-full">
                                        Update Password
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
