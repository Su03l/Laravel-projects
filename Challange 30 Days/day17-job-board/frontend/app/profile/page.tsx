"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, mutate, loading: authLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
        website: "",
        avatar: "",
        cv_path: "",
        type: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchProfile();
        }
    }, [user, authLoading]);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profile');
            setFormData({
                name: data.name || "",
                email: data.email || "",
                bio: data.bio || "",
                website: data.website || "",
                avatar: data.avatar || "",
                cv_path: data.cv_path || "",
                type: data.type || "seeker",
            });
            setPreviewAvatar(data.avatar || "");
        } catch (error) {
            console.error("Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cv') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (type === 'avatar') {
                setAvatarFile(file);
                setPreviewAvatar(URL.createObjectURL(file));
            } else {
                setCvFile(file);
            }
        }
    }

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data.url; // Assuming backend returns full URL or path
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let avatarUrl = formData.avatar;
            let cvUrl = formData.cv_path;

            if (avatarFile) {
                const res = await uploadFile(avatarFile);
                avatarUrl = res;
            }

            if (cvFile) {
                const res = await uploadFile(cvFile);
                cvUrl = res;
            }

            const payload = {
                name: formData.name,
                bio: formData.bio,
                website: formData.website,
                avatar: avatarUrl,
                cv_path: cvUrl
            };

            await api.put('/profile', payload);
            await mutate(); // Refresh auth context
            alert("تم تحديث الملف الشخصي بنجاح! 🎉");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("صار خطأ أثناء التحديث..");
        } finally {
            setSaving(false);
        }
    }

    if (loading || authLoading) return <div className="p-20 text-center">جاري تحميل البيانات...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">إعدادات الحساب</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
                    {/* Header & Avatar */}
                    <div className="p-8">
                        <h2 className="text-lg font-medium leading-6 text-slate-900 mb-6">المعلومات الشخصية</h2>

                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full bg-slate-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                                    {previewAvatar ? (
                                        <img src={previewAvatar} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-slate-300">{formData.name.charAt(0)}</span>
                                    )}
                                </div>
                                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                    </svg>
                                </label>
                                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold leading-7 text-slate-900">الصورة الشخصية</h3>
                                <p className="text-sm leading-6 text-slate-500">مسموح JPG, GIF, PNG. حجم أقصى 5MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="p-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900">الاسم الكامل</label>
                            <div className="mt-2">
                                <input type="text" name="name" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="block w-full rounded-xl border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">البريد الإلكتروني</label>
                            <div className="mt-2">
                                <input type="email" name="email" id="email" disabled value={formData.email} className="block w-full rounded-xl border-0 py-3 text-slate-500 bg-slate-50 shadow-sm ring-1 ring-inset ring-slate-200 sm:text-sm sm:leading-6 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="bio" className="block text-sm font-medium leading-6 text-slate-900">نبذة عنك</label>
                            <div className="mt-2">
                                <textarea id="bio" name="bio" rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="block w-full rounded-xl border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-600">اكتب وصف مختصر عن نفسك أو شركتك.</p>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="website" className="block text-sm font-medium leading-6 text-slate-900">الموقع الإلكتروني</label>
                            <div className="mt-2">
                                <input type="url" name="website" id="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="block w-full rounded-xl border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" placeholder="https://example.com" />
                            </div>
                        </div>

                        {/* Seeker Specific - CV */}
                        {formData.type === 'seeker' && (
                            <div className="col-span-full">
                                <label htmlFor="cv" className="block text-sm font-medium leading-6 text-slate-900">السيرة الذاتية (CV)</label>
                                <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-10 bg-slate-50 hover:bg-white transition-colors">
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-slate-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                        </svg>
                                        <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                                            <label htmlFor="cv-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                                                <span>ارفع ملف جديد</span>
                                                <input id="cv-upload" name="cv-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'cv')} />
                                            </label>
                                            <p className="pl-1">أو اسحب وأفلت هنا</p>
                                        </div>
                                        <p className="text-xs leading-5 text-slate-600">PDF, DOCX up to 10MB</p>
                                        {cvFile && (
                                            <p className="mt-2 text-sm font-semibold text-green-600">تم اختيار: {cvFile.name}</p>
                                        )}
                                        {formData.cv_path && !cvFile && (
                                            <p className="mt-2 text-sm text-slate-500">يوجد ملف حالياً: <a href={formData.cv_path} target="_blank" className="text-blue-600 hover:underline">عرض الملف</a></p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 bg-slate-50">
                        <button type="button" onClick={() => router.back()} className="text-sm font-semibold leading-6 text-slate-900">إلغاء</button>
                        <button type="submit" disabled={saving} className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 disabled:opacity-70">
                            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
