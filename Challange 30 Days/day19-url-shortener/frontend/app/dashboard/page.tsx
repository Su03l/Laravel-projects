'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/axios';
import { Link as LinkType } from '@/types';
import { Stats } from '@/components/dashboard/Stats';
import { LinkCard } from '@/components/dashboard/LinkCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Loader2, Search, Zap, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const [links, setLinks] = useState<LinkType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form States
    const [newUrl, setNewUrl] = useState('');
    const [newName, setNewName] = useState('');

    // Edit State
    const [editingLink, setEditingLink] = useState<LinkType | null>(null);
    const [editUrl, setEditUrl] = useState('');
    const [editName, setEditName] = useState('');

    // Fetch Links
    const fetchLinks = async () => {
        try {
            const { data } = await api.get<{ data: LinkType[] }>('/links');
            const linksData = Array.isArray(data) ? data : (data.data || []);
            setLinks(linksData);
        } catch (error) {
            toast.error('ما قدرنا نجيب الروابط، تأكد من النت');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    // Create Link
    const handleCreateWrapper = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUrl) return;

        setIsCreating(true);
        try {
            const { data } = await api.post<{ data: LinkType }>('/links', {
                url: newUrl,
                name: newName || undefined,
            });
            const newLink = data.data || data;
            setLinks([newLink as LinkType, ...links]);
            toast.success('تم! الرابط جاهز للاستخدام');
            setNewUrl('');
            setNewName('');
        } catch (error: any) {
            const message = error.response?.data?.message || 'فشلنا في تقصير الرابط';
            toast.error(message);
        } finally {
            setIsCreating(false);
        }
    };

    // Delete Link
    const handleDelete = async (id: number) => {
        if (!confirm('أكيد تبي تحذف الرابط؟ تراه بيختفي للأبد')) return;
        try {
            await api.delete(`/links/${id}`);
            setLinks(links.filter(l => l.id !== id));
            toast.success('تم الحذف');
        } catch (error) {
            toast.error('صار خطأ بالحذف');
        }
    };

    // Edit Link
    const openEditModal = (link: LinkType) => {
        setEditingLink(link);
        setEditUrl(link.original_url);
        setEditName(link.name || '');
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLink) return;

        try {
            const { data } = await api.put<{ data: LinkType }>(`/links/${editingLink.id}`, {
                url: editUrl,
                name: editName || undefined,
            });
            const updatedLink = data.data || data;
            setLinks(links.map(l => l.id === editingLink.id ? (updatedLink as LinkType) : l));
            toast.success('تحدث الرابط بنجاح');
            setEditingLink(null);
        } catch (error) {
            toast.error('ما قدرنا نحدث الرابط');
        }
    };

    // Stats
    const stats = useMemo(() => {
        return {
            totalLinks: links.length,
            totalVisits: links.reduce((sum, link) => sum + link.visits, 0),
        };
    }, [links]);

    // Filtered Links
    const filteredLinks = links.filter(link =>
    (link.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.original_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.short_code.includes(searchQuery))
    );

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">نظرة عامة</h1>
                <p className="text-slate-500">مرحباً بعودتك! إليك ملخص نشاطك وروابطك.</p>
            </div>

            {/* Stats Grid */}
            <Stats totalLinks={stats.totalLinks} totalVisits={stats.totalVisits} />

            {/* Hero Create Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 px-8 py-16 text-white shadow-2xl shadow-blue-200 dark:shadow-none md:px-16">
                {/* Decoration Circles */}
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />

                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-white backdrop-blur-md shadow-inner ring-1 ring-white/20">
                            <Zap className="h-10 w-10 text-yellow-300 drop-shadow-md" fill="currentColor" />
                        </div>
                    </div>
                    <h2 className="mb-6 text-4xl font-black tracking-tight drop-shadow-sm">ابدأ بتقصير رابط جديد</h2>
                    <p className="mb-10 text-sky-50 text-xl font-medium leading-relaxed opacity-90">
                        حط رابطك هنا وضبطه بضغطة زر، سريع وبسيط.
                    </p>

                    <form onSubmit={handleCreateWrapper} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-5 md:flex-row">
                            <Input
                                placeholder="حط الرابط الطويل هنا..."
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                required
                                className="h-20 border-0 bg-white shadow-xl text-2xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-sky-300/50 text-right px-8 rounded-2xl"
                            />
                            <Input
                                placeholder="اسم الرابط (اختياري)"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="h-20 border-0 bg-white/10 backdrop-blur-sm text-xl text-white placeholder:text-blue-100 focus:bg-white/20 focus:ring-2 focus:ring-white/30 text-right px-8 md:w-1/3 rounded-2xl placeholder-shown:placeholder:text-opacity-80"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="h-20 w-full text-2xl font-bold bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-xl rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                            isLoading={isCreating}
                        >
                            <Plus className="ml-3 h-8 w-8" />
                            إنشاء رابط مختصر
                        </Button>
                    </form>
                </div>
            </div>

            {/* Links Section */}
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">روابطك الأخيرة</h2>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute right-3.5 top-3.5 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="ابحث.."
                            className="h-12 w-full pr-12 text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Layout for Links */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
                    </div>
                ) : filteredLinks.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
                        <p className="text-xl text-slate-500">ما فيه روابط! أنشئ أول رابط لك فوق ⚡️</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredLinks.map((link) => (
                            <LinkCard
                                key={link.id}
                                link={link}
                                onDelete={handleDelete}
                                onEdit={openEditModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingLink}
                onClose={() => setEditingLink(null)}
                title="تعديل الرابط"
            >
                <form onSubmit={handleUpdate} className="space-y-6">
                    <Input
                        label="الرابط الأصلي"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        required
                        className="text-right dir-ltr h-14"
                    />
                    <Input
                        label="اسم الرابط"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="مثل: صفحتي الشخصية"
                        className="text-right h-14"
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setEditingLink(null)}>
                            هونّت
                        </Button>
                        <Button type="submit">
                            حفظ
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
