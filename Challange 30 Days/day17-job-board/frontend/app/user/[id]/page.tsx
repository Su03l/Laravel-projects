"use client";

import { use, useEffect, useState } from "react";
import api from "@/lib/axios";
import { Mail, FileText, Globe, Calendar, User as UserIcon } from "lucide-react";
import { useParams } from "next/navigation";

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    // Decode the ID since it's actually a name and might be URL encoded
    const userName = decodeURIComponent(id);

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Determine if we are using ID or Name. The backend now expects Name at /users/{name}.
                // We pass the raw ID (which is the name) to the API.
                const { data } = await api.get(`/users/${id}`);
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
            <div className="w-12 h-12 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
            <div className="text-center max-w-md">
                <div className="bg-zinc-100 p-6 rounded-full inline-block mb-4">
                    <UserIcon className="w-12 h-12 text-zinc-400" />
                </div>
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">المستخدم غير موجود</h1>
                <p className="text-zinc-500">تأكد من الرابط وحاول مرة أخرى.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 overflow-hidden border border-zinc-100">
                    {/* Cover Pattern */}
                    <div className="h-40 bg-zinc-900 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-zinc-700 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-zinc-700 rounded-full blur-3xl"></div>
                        </div>
                    </div>

                    <div className="px-8 pb-10">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-6 flex justify-center sm:justify-start">
                            <div className="p-1.5 bg-white rounded-full shadow-lg">
                                <div className="h-32 w-32 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-zinc-400">{profile.name.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-1">{profile.name}</h1>
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <span className={`px-3 py-1 rounded-full border ${profile.type === 'company'
                                            ? 'bg-zinc-900 text-white border-zinc-900'
                                            : 'bg-white text-zinc-600 border-zinc-200'
                                        }`}>
                                        {profile.type === 'company' ? 'شركة' : 'باحث عن عمل'}
                                    </span>
                                    {profile.created_at && (
                                        <span className="text-zinc-400 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            انضم {new Date(profile.created_at).getFullYear()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {profile.cv_path && (
                                <a
                                    href={profile.cv_path}
                                    target="_blank"
                                    download
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-900/10"
                                >
                                    <FileText className="w-4 h-4" />
                                    تحميل السيرة الذاتية
                                </a>
                            )}
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">نبذة تعريفية</h3>
                                <p className="text-zinc-600 leading-relaxed text-lg">
                                    {profile.bio}
                                </p>
                            </div>
                        )}

                        {/* Contact & Links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-100 pt-8">
                            <div className="group flex items-center gap-3 p-4 rounded-2xl border border-zinc-100 bg-zinc-50 hover:border-zinc-200 transition-colors">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-100 group-hover:text-zinc-900 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">البريد الإلكتروني</p>
                                    <p className="text-sm font-medium text-zinc-900 truncate dir-ltr text-right">{profile.email}</p>
                                </div>
                            </div>

                            {profile.website && (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 p-4 rounded-2xl border border-zinc-100 bg-zinc-50 hover:border-zinc-200 transition-colors cursor-pointer"
                                >
                                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-100 group-hover:text-blue-600 transition-colors">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-0.5">الموقع الإلكتروني</p>
                                        <p className="text-sm font-medium text-blue-600 truncate dir-ltr text-right">{profile.website.replace(/^https?:\/\//, '')}</p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
