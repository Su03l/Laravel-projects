'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // State for Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        department_id: '1', // Default IT
        job_title: '',
        salary: '',
        joining_date: '',
    });

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'employee',
            department_id: '1',
            job_title: '',
            salary: '',
            joining_date: '',
        });
    };

    const fetchEmployees = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/employees?page=${page}`);
            setEmployees(response.data.data.data);
            setPagination({
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                total: response.data.data.total
            });
        } catch (error) {
            console.error(error);
            toast.error('فشل تحميل بيانات الموظفين');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await api.post('/employees', formData);
            toast.success('تم إضافة الموظف بنجاح');
            setIsAddModalOpen(false);
            resetForm();
            fetchEmployees(1);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل إضافة الموظف');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditClick = (employee: any) => {
        setSelectedEmployee(employee);
        setFormData({
            name: employee.user.name,
            email: employee.user.email,
            password: '', // Password optional on edit
            role: employee.user.role,
            department_id: employee.department?.id || '1',
            job_title: employee.job_title,
            salary: employee.salary,
            joining_date: employee.joining_date,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;
        setFormLoading(true);
        try {
            // Remove password if empty to avoid overwriting with empty string
            const dataToSend = { ...formData };
            if (!dataToSend.password) delete (dataToSend as any).password;

            await api.put(`/employees/${selectedEmployee.id}`, dataToSend);
            toast.success('تم تحديث بيانات الموظف بنجاح');
            setIsEditModalOpen(false);
            setSelectedEmployee(null);
            resetForm();
            fetchEmployees(pagination.current_page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تحديث الموظف');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (employee: any) => {
        setSelectedEmployee(employee);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedEmployee) return;
        setFormLoading(true);
        try {
            await api.delete(`/employees/${selectedEmployee.id}`);
            toast.success('تم حذف الموظف بنجاح');
            setIsDeleteModalOpen(false);
            setSelectedEmployee(null);
            fetchEmployees(pagination.current_page);
        } catch (error: any) {
            toast.error('فشل حذف الموظف');
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const columns = [
        { header: '#', accessor: 'id' },
        { header: 'الاسم', accessor: 'user.name', className: 'font-bold' },
        { header: 'البريد الإلكتروني', accessor: 'user.email' },
        { header: 'القسم', accessor: 'department.name' },
        { header: 'المسمى الوظيفي', accessor: 'job_title' },
        {
            header: 'تاريخ الانضمام',
            accessor: 'joining_date',
            render: (row: any) => new Date(row.joining_date).toLocaleDateString('ar-EG')
        },
        {
            header: 'الراتب',
            accessor: 'salary',
            render: (row: any) => row.salary ? `${parseFloat(row.salary).toLocaleString()} ريال` : '-'
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

    // Dummy Departments (In real app, fetch from API)
    // Assuming backend seed sets IDs 1-5
    const departments = [
        { id: 1, name: 'IT Department' },
        { id: 2, name: 'HR Department' },
        { id: 3, name: 'Sales Department' },
        { id: 4, name: 'Marketing' },
        { id: 5, name: 'Finance' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">إدارة الموظفين</h2>
            <DataTable
                columns={columns}
                data={employees}
                loading={loading}
                pagination={{ ...pagination, onPageChange: fetchEmployees }}
                actionButton={{ label: 'إضافة موظف', onClick: () => { resetForm(); setIsAddModalOpen(true); } }}
            />

            {/* Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إضافة موظف جديد">
                <form onSubmit={handleAdd} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الاسم</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                        <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
                        <input type="password" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">القسم</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.department_id} onChange={e => setFormData({ ...formData, department_id: e.target.value })}>
                                {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الدور</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="employee">موظف</option>
                                <option value="hr">HR</option>
                                <option value="admin">مدير نظام</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">المسمى الوظيفي</label>
                            <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.job_title} onChange={e => setFormData({ ...formData, job_title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الراتب</label>
                            <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">تاريخ الانضمام</label>
                        <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.joining_date} onChange={e => setFormData({ ...formData, joining_date: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>
                        <Button type="submit" disabled={formLoading}>{formLoading ? 'جاري الحفظ...' : 'حفظ'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="تعديل بيانات الموظف">
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الاسم</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                        <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">كلمة المرور (اختياري)</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="اتركه فارغاً إذا لم ترد التغيير" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">القسم</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.department_id} onChange={e => setFormData({ ...formData, department_id: e.target.value })}>
                                {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الدور</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="employee">موظف</option>
                                <option value="hr">HR</option>
                                <option value="admin">مدير نظام</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">المسمى الوظيفي</label>
                            <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.job_title} onChange={e => setFormData({ ...formData, job_title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الراتب</label>
                            <input type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">تاريخ الانضمام</label>
                        <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.joining_date} onChange={e => setFormData({ ...formData, joining_date: e.target.value })} />
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
                message={`هل أنت متأكد من رغبتك في حذف الموظف "${selectedEmployee?.user?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
                isLoading={formLoading}
            />
        </div>
    );
}
