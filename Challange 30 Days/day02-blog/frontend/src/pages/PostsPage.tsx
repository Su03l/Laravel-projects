import { useState, useEffect } from 'react';
import { postsAPI, categoriesAPI } from '../services/api';
import { Post, Category } from '../types';
import Modal from '../components/Modal';

const PostsPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category_id: 0
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            const [postsRes, categoriesRes] = await Promise.all([
                postsAPI.getAll(),
                categoriesAPI.getAll()
            ]);
            setPosts(postsRes.data);
            setCategories(categoriesRes.data);
            setError(null);
        } catch (err) {
            setError('فشل في تحميل البيانات. تأكد من تشغيل الباك اند.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Open modal for create
    const openCreateModal = () => {
        setEditingPost(null);
        setFormData({ title: '', content: '', category_id: categories[0]?.id || 0 });
        setIsModalOpen(true);
    };

    // Open modal for edit
    const openEditModal = (post: Post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            content: post.content,
            category_id: post.category_id
        });
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        setFormData({ title: '', content: '', category_id: 0 });
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) return;

        setSubmitting(true);
        try {
            if (editingPost) {
                await postsAPI.update(editingPost.id, formData);
            } else {
                await postsAPI.create(formData);
            }
            closeModal();
            fetchData();
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete post
    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

        try {
            await postsAPI.delete(id);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء الحذف');
        }
    };

    // Get category name
    const getCategoryName = (categoryId: number) => {
        return categories.find(c => c.id === categoryId)?.name || 'غير محدد';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">المقالات</h1>
                    <p className="text-gray-600 mt-1">إدارة مقالات المدونة</p>
                </div>
                <button
                    onClick={openCreateModal}
                    disabled={categories.length === 0}
                    className="px-5 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    إضافة مقال
                </button>
            </div>

            {/* Warning if no categories */}
            {!loading && categories.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800">
                    يجب إضافة تصنيف واحد على الأقل قبل إنشاء المقالات
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchData}
                        className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            ) : posts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مقالات</h3>
                    <p className="text-gray-600 mb-6">ابدأ بإضافة أول مقال لمدونتك</p>
                    {categories.length > 0 && (
                        <button
                            onClick={openCreateModal}
                            className="px-5 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                        >
                            إضافة مقال
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                            {getCategoryName(post.category_id)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(post.created_at).toLocaleDateString('ar-SA')}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-xl mb-2">{post.title}</h3>
                                    <p className="text-gray-600 line-clamp-2">{post.content}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                    <button
                                        onClick={() => openEditModal(post)}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingPost ? 'تعديل المقال' : 'إضافة مقال جديد'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            العنوان
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                            placeholder="عنوان المقال"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            التصنيف
                        </label>
                        <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            المحتوى
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all resize-none"
                            rows={5}
                            placeholder="محتوى المقال..."
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'جاري الحفظ...' : editingPost ? 'تحديث' : 'إضافة'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PostsPage;
