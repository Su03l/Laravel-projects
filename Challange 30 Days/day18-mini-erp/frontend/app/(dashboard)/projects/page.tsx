'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Modals & Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Lists for Dropdowns
    const [clients, setClients] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        client_id: '',
        manager_id: '',
        description: '',
        budget: '',
        status: 'pending',
        start_date: '',
        deadline: ''
    });

    const resetForm = () => {
        setFormData({
            name: '',
            client_id: clients.length > 0 ? clients[0].id : '',
            manager_id: employees.length > 0 ? employees[0].data?.id || employees[0].id : '', // Handle different structures if needed
            description: '',
            budget: '',
            status: 'pending',
            start_date: '',
            deadline: ''
        });
    };

    const fetchProjects = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/projects?page=${page}`);
            setProjects(response.data.data.data || []);
            setPagination({
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                total: response.data.data.total
            });
        } catch (error) {
            console.error(error);
            toast.error('فشل تحميل المشاريع');
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [clientsRes, employeesRes] = await Promise.all([
                api.get('/clients?per_page=100'), // Get enough clients
                api.get('/employees?per_page=100') // Get enough employees
            ]);
            setClients(clientsRes.data.data.data || []);
            setEmployees(employeesRes.data.data.data || []);
        } catch (error) {
            console.error('Failed to fetch dropdown data', error);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await api.post('/projects', formData);
            toast.success('تم إنشاء المشروع بنجاح');
            setIsAddModalOpen(false);
            resetForm();
            fetchProjects(1);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل إنشاء المشروع');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditClick = (project: any) => {
        setSelectedProject(project);
        setFormData({
            name: project.name,
            client_id: project.client_id,
            manager_id: project.manager_id,
            description: project.description || '',
            budget: project.budget,
            status: project.status,
            start_date: project.start_date || '',
            deadline: project.deadline || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject) return;
        setFormLoading(true);
        try {
            await api.put(`/projects/${selectedProject.id}`, formData);
            toast.success('تم تحديث المشروع بنجاح');
            setIsEditModalOpen(false);
            setSelectedProject(null);
            resetForm();
            fetchProjects(pagination.current_page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تحديث المشروع');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (project: any) => {
        setSelectedProject(project);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedProject) return;
        setFormLoading(true);
        try {
            await api.delete(`/projects/${selectedProject.id}`);
            toast.success('تم حذف المشروع بنجاح');
            setIsDeleteModalOpen(false);
            setSelectedProject(null);
            fetchProjects(pagination.current_page);
        } catch (error: any) {
            toast.error('فشل حذف المشروع');
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchDropdownData();
    }, []);

    const columns = [
        { header: 'اسم المشروع', accessor: 'name', className: 'font-bold' },
        { header: 'العميل', accessor: 'client.company_name' },
        { header: 'مدير المشروع', accessor: 'manager.name' },
        {
            header: 'الميزانية',
            accessor: 'budget',
            render: (row: any) => row.budget ? `${parseFloat(row.budget).toLocaleString()} ريال` : '-'
        },
        {
            header: 'الحالة',
            accessor: 'status',
            render: (row: any) => {
                const colors: any = {
                    pending: 'bg-amber-100 text-amber-600',
                    active: 'bg-sky-100 text-sky-600',
                    completed: 'bg-emerald-100 text-emerald-600',
                    hold: 'bg-rose-100 text-rose-600'
                };
                const labels: any = {
                    pending: 'قيد الانتظار',
                    active: 'جاري العمل',
                    completed: 'مكتمل',
                    hold: 'معلق'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[row.status] || 'bg-slate-100'}`}>
                        {labels[row.status] || row.status}
                    </span>
                );
            }
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
            <h2 className="text-2xl font-bold text-slate-900">المشاريع</h2>
            <DataTable
                columns={columns}
                data={projects}
                loading={loading}
                pagination={{ ...pagination, onPageChange: fetchProjects }}
                actionButton={{ label: 'مشروع جديد', onClick: () => { resetForm(); setIsAddModalOpen(true); } }}
            />

            {/* Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إنشاء مشروع جديد">
                <form onSubmit={handleAdd} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">اسم المشروع</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">العميل</label>
                            <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.client_id} onChange={e => setFormData({ ...formData, client_id: e.target.value })}>
                                <option value="">اختر عميل</option>
                                {clients.map(client => <option key={client.id} value={client.id}>{client.company_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">مدير المشروع</label>
                            <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.manager_id} onChange={e => setFormData({ ...formData, manager_id: e.target.value })}>
                                <option value="">اختر مدير</option>
                                {employees.map((emp: any) => <option key={emp.id} value={emp.user?.id || emp.id}>{emp.user?.name || emp.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الميزانية</label>
                        <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الوصف</label>
                        <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">تاريخ البدء</label>
                            <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الموعد النهائي</label>
                            <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الحالة</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="pending">قيد الانتظار</option>
                            <option value="active">جاري العمل</option>
                            <option value="completed">مكتمل</option>
                            <option value="hold">معلق</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>
                        <Button type="submit" disabled={formLoading}>{formLoading ? 'جاري الحفظ...' : 'حفظ'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="تعديل المشروع">
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">اسم المشروع</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">العميل</label>
                            <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.client_id} onChange={e => setFormData({ ...formData, client_id: e.target.value })}>
                                <option value="">اختر عميل</option>
                                {clients.map(client => <option key={client.id} value={client.id}>{client.company_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">مدير المشروع</label>
                            <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.manager_id} onChange={e => setFormData({ ...formData, manager_id: e.target.value })}>
                                <option value="">اختر مدير</option>
                                {employees.map((emp: any) => <option key={emp.id} value={emp.user?.id || emp.id}>{emp.user?.name || emp.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الميزانية</label>
                        <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الوصف</label>
                        <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">تاريخ البدء</label>
                            <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الموعد النهائي</label>
                            <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الحالة</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="pending">قيد الانتظار</option>
                            <option value="active">جاري العمل</option>
                            <option value="completed">مكتمل</option>
                            <option value="hold">معلق</option>
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
                message={`هل أنت متأكد من رغبتك في حذف المشروع "${selectedProject?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
                isLoading={formLoading}
            />
        </div>
    );
}
