'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Modals & Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Lists for Dropdowns
    const [projects, setProjects] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        project_id: '',
        amount: '',
        issue_date: '',
        due_date: '',
        status: 'unpaid'
    });

    const resetForm = () => {
        setFormData({
            project_id: projects.length > 0 ? projects[0].id : '',
            amount: '',
            issue_date: '',
            due_date: '',
            status: 'unpaid'
        });
    };

    const fetchInvoices = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/invoices?page=${page}`);
            setInvoices(response.data.data.data || []);
            setPagination({
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                total: response.data.data.total
            });
        } catch (error) {
            console.error('Invoices fetch error', error);
            toast.error('فشل تحميل الفواتير');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects?per_page=100');
            setProjects(response.data.data.data || []);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await api.post('/invoices', formData);
            toast.success('تم إنشاء الفاتورة بنجاح');
            setIsAddModalOpen(false);
            resetForm();
            fetchInvoices(1);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل إنشاء الفاتورة');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditClick = (invoice: any) => {
        setSelectedInvoice(invoice);
        setFormData({
            project_id: invoice.project_id,
            amount: invoice.amount,
            issue_date: invoice.issue_date,
            due_date: invoice.due_date,
            status: invoice.status
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoice) return;
        setFormLoading(true);
        try {
            await api.put(`/invoices/${selectedInvoice.id}`, formData);
            toast.success('تم تحديث الفاتورة بنجاح');
            setIsEditModalOpen(false);
            setSelectedInvoice(null);
            resetForm();
            fetchInvoices(pagination.current_page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تحديث الفاتورة');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (invoice: any) => {
        setSelectedInvoice(invoice);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedInvoice) return;
        setFormLoading(true);
        try {
            await api.delete(`/invoices/${selectedInvoice.id}`);
            toast.success('تم حذف الفاتورة بنجاح');
            setIsDeleteModalOpen(false);
            setSelectedInvoice(null);
            fetchInvoices(pagination.current_page);
        } catch (error: any) {
            toast.error('فشل حذف الفاتورة');
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
        fetchProjects();
    }, []);

    const columns = [
        { header: 'رقم الفاتورة', accessor: 'invoice_number', className: 'font-mono text-xs' },
        {
            header: 'المشروع',
            accessor: 'project.name',
            render: (row: any) => row.project?.name || '-'
        },
        { header: 'المبلغ', accessor: 'amount', render: (row: any) => `${parseFloat(row.amount).toLocaleString()} ريال` },
        {
            header: 'تاريخ الاستحقاق',
            accessor: 'due_date',
            render: (row: any) => new Date(row.due_date).toLocaleDateString('ar-EG')
        },
        {
            header: 'الحالة',
            accessor: 'status',
            render: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'paid' ? 'bg-emerald-100 text-emerald-600' :
                        row.status === 'overdue' ? 'bg-red-100 text-red-600' :
                            'bg-amber-100 text-amber-600'
                    }`}>
                    {row.status === 'paid' ? 'مدفوعة' : row.status === 'overdue' ? 'متأخرة' : 'غير مدفوعة'}
                </span>
            )
        },
        {
            header: 'إجراءات',
            accessor: 'actions',
            render: (row: any) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEditClick(row)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="تعديل"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(row)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="حذف"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">الفواتير والمالية</h2>
            <DataTable
                columns={columns}
                data={invoices}
                loading={loading}
                pagination={{ ...pagination, onPageChange: fetchInvoices }}
                actionButton={{ label: 'إنشاء فاتورة', onClick: () => { resetForm(); setIsAddModalOpen(true); } }}
            />

            {/* Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إنشاء فاتورة جديدة">
                <form onSubmit={handleAdd} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">المشروع</label>
                        <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.project_id} onChange={e => setFormData({ ...formData, project_id: e.target.value })}>
                            <option value="">اختر مشروع</option>
                            {projects.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">المبلغ</label>
                        <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">تاريخ الإصدار</label>
                            <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.issue_date} onChange={e => setFormData({ ...formData, issue_date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">تاريخ الاستحقاق</label>
                            <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الحالة</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="unpaid">غير مدفوعة</option>
                            <option value="paid">مدفوعة</option>
                            <option value="overdue">متأخرة</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>
                        <Button type="submit" disabled={formLoading}>{formLoading ? 'جاري الحفظ...' : 'حفظ'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="تعديل الفاتورة">
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">المشروع</label>
                        <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.project_id} onChange={e => setFormData({ ...formData, project_id: e.target.value })}>
                            <option value="">اختر مشروع</option>
                            {projects.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">المبلغ</label>
                        <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">تاريخ الإصدار</label>
                            <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.issue_date} onChange={e => setFormData({ ...formData, issue_date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">تاريخ الاستحقاق</label>
                            <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الحالة</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="unpaid">غير مدفوعة</option>
                            <option value="paid">مدفوعة</option>
                            <option value="overdue">متأخرة</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>إلغاء</Button>
                        <Button type="submit" disabled={formLoading}>{formLoading ? 'جاري التحديث...' : 'تحديث'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="تأكيد الحذف"
                message={`هل أنت متأكد من رغبتك في حذف الفاتورة "${selectedInvoice?.invoice_number}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
                isLoading={formLoading}
            />
        </div>
    );
}
