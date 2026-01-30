'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/axios';
import { Link as LinkType } from '@/types';
import { Stats } from '@/components/dashboard/Stats';
import { LinkCard } from '@/components/dashboard/LinkCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Loader2, Search } from 'lucide-react';
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
        <div className="space-y-8">
            {/* Create Section */}
            <div className="mx-auto max-w-2xl text-center">
                <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
                    قصر روابطك الطويلة
                </h1>
                <p className="mb-8 text-slate-600 dark:text-slate-400">
                    حط الرابط الطويل تحت وازهلها، بنضبطك برابط قصير ومرتب.
                </p>

                <form onSubmit={handleCreateWrapper} className="relative flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                        <Input
                            placeholder="حط رابطك الطويل هنا.."
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            required
                            className="h-12 text-lg shadow-sm text-right"
                        />
                        <Input
                            placeholder="اسم مميز للرابط (اختياري)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="h-10 text-sm text-right"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="h-auto px-8 text-lg font-semibold shadow-sky-200"
                        isLoading={isCreating}
                    >
                        قصرّه لي!
                    </Button>
                </form>
            </div>

            {/* Stats */}
            <Stats totalLinks={stats.totalLinks} totalVisits={stats.totalVisits} />

            {/* Links List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">قائمة روابطك</h2>
                    <div className="relative w-64">
                        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="ابحث عن رابط..."
                            className="pr-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                    </div>
                ) : filteredLinks.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-700">
                        <p className="text-slate-500">ما عندك روابط للحين.. ابدأ فوق وجرب!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
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
                <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                        label="الرابط الأصلي"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        required
                        className="text-right dir-ltr"
                    />
                    <Input
                        label="اسم الرابط"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="مثل: صفحتي الشخصية"
                        className="text-right"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setEditingLink(null)}>
                            هونّت
                        </Button>
                        <Button type="submit">
                            احفظ التغييرات
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
