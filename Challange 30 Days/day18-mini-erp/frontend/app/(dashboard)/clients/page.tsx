'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Modals & Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        status: 'active'
    });

    const resetForm = () => {
        setFormData({
            company_name: '',
            contact_person: '',
            email: '',
            phone: '',
            status: 'active'
        });
    };

    const fetchClients = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/clients?page=${page}`);
            setClients(response.data.data.data);
            setPagination({
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                total: response.data.data.total
            });
        } catch (error) {
            console.error(error);
            toast.error('فشل تحميل بيانات العملاء');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await api.post('/clients', formData);
            toast.success('تم إضافة العميل بنجاح');
            setIsAddModalOpen(false);
            resetForm();
            fetchClients(1);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل إضافة العميل');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditClick = (client: any) => {
        setSelectedClient(client);
        setFormData({
            company_name: client.company_name,
            contact_person: client.contact_person,
            email: client.email,
            phone: client.phone,
            status: client.status
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient) return;
        setFormLoading(true);
        try {
            await api.put(`/clients/${selectedClient.id}`, formData);
            toast.success('تم تحديث بيانات العميل بنجاح');
            setIsEditModalOpen(false);
            setSelectedClient(null);
            resetForm();
            fetchClients(pagination.current_page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تحديث العميل');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (client: any) => {
        setSelectedClient(client);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedClient) return;
        setFormLoading(true);
        try {
            await api.delete(`/clients/${selectedClient.id}`);
            toast.success('تم حذف العميل بنجاح');
            setIsDeleteModalOpen(false);
            setSelectedClient(null);
            fetchClients(pagination.current_page);
        } catch (error: any) {
            toast.error('فشل حذف العميل');
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const columns = [
        { header: 'الشركة', accessor: 'company_name', className: 'font-bold text-slate-900' },
        { header: 'الشخص المسؤول', accessor: 'contact_person' },
        { header: 'البريد الإلكتروني', accessor: 'email' },
        { header: 'الهاتف', accessor: 'phone' },
        {
            header: 'الحالة',
            accessor: 'status',
            render: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {row.status === 'active' ? 'نشط' : 'غير نشط'}
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
            <h2 className="text-2xl font-bold text-slate-900">إدارة العملاء</h2>
            <DataTable
                columns={columns}
                data={clients}
                loading={loading}
                pagination={{ ...pagination, onPageChange: fetchClients }}
                actionButton={{ label: 'إضافة عميل', onClick: () => { resetForm(); setIsAddModalOpen(true); } }}
            />

            {/* Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إضافة عميل جديد">
                <form onSubmit={handleAdd} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">اسم الشركة</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الشخص المسؤول</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.contact_person} onChange={e => setFormData({ ...formData, contact_person: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                        <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الحالة</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>
                        <Button type="submit" disabled={formLoading}>{formLoading ? 'جاري الحفظ...' : 'حفظ'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="تعديل بيانات العميل">
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">اسم الشركة</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الشخص المسؤول</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.contact_person} onChange={e => setFormData({ ...formData, contact_person: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                        <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الحالة</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
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
                message={`هل أنت متأكد من رغبتك في حذف العميل "${selectedClient?.company_name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
                isLoading={formLoading}
            />
        </div>
    );
}
