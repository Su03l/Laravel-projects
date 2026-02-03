"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { User, Lock, Mail } from "lucide-react";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false); // For fetching initial data if needed
    const [savingInfo, setSavingInfo] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
    });

    const [passwordData, setPasswordData] = useState({
        currnet_password: "", // Note: API might expect 'current_password' or similar. Assuming standard laravel fortify/breeze often uses current_password, key from instructions was PUT /profile/password
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        // Fetch profile data
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUserInfo({
                    name: res.data.name || "",
                    email: res.data.email || "",
                });
            } catch (error) {
                console.error(error);
                // toast.error("فشل تحميل البيانات الشخصية");
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingInfo(true);
        try {
            await api.put('/profile', userInfo);
            toast.success("تم تحديث المعلومات بنجاح");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "لابد التحقق من كلمة المرور"); // Changed message to generic failure
        } finally {
            setSavingInfo(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.password !== passwordData.password_confirmation) {
            toast.error("كلمتا المرور غير متطابقتين");
            return;
        }

        setSavingPassword(true);
        try {
            await api.put('/profile/password', passwordData);
            toast.success("تم تغيير كلمة المرور بنجاح");
            setPasswordData({ currnet_password: "", password: "", password_confirmation: "" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل تغيير كلمة المرور");
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">الملف الشخصي</h1>
                <p className="text-slate-500 mt-1">إدارة معلوماتك الشخصية والأمان.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Update Info */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500">
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">المعلومات الأساسية</h2>
                    </div>

                    <form onSubmit={handleUpdateInfo} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
                            <input
                                type="text"
                                value={userInfo.name}
                                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={userInfo.email}
                                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 pl-10" // Padding for icon if LTR, but we are RTL so maybe no padding needed or icon on left?
                                />
                                {/* <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /> */}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={savingInfo}
                                className="w-full md:w-auto bg-sky-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sky-600 focus:ring-4 focus:ring-sky-100 transition-all"
                            >
                                {savingInfo ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                        <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">الأمان وكلمة المرور</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور الحالية</label>
                            <input
                                type="password"
                                value={passwordData.currnet_password}
                                onChange={(e) => setPasswordData({ ...passwordData, currnet_password: e.target.value })}
                                className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                value={passwordData.password}
                                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                value={passwordData.password_confirmation}
                                onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                className="w-full rounded-lg border-slate-300 border px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={savingPassword}
                                className="w-full md:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 focus:ring-4 focus:ring-slate-100 transition-all"
                            >
                                {savingPassword ? "جاري التحديث..." : "تحديث كلمة المرور"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
