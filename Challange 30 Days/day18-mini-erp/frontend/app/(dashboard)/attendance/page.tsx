'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DataTable from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

export default function AttendancePage() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Modals & Form State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        check_in: '',
        check_out: '',
        status: 'present'
    });

    const fetchAttendance = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/attendance?page=${page}`);
            setAttendance(response.data.data.data || []);
            setPagination({
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                total: response.data.data.total
            });
        } catch (error) {
            console.error('Attendance fetch error', error);
            // toast.error('فشل تحميل سجل الحضور');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (record: any) => {
        setSelectedRecord(record);
        setFormData({
            check_in: record.check_in || '',
            check_out: record.check_out || '',
            status: record.status
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRecord) return;
        setFormLoading(true);
        try {
            await api.put(`/attendance/${selectedRecord.id}`, formData);
            toast.success('تم تحديث السجل بنجاح');
            setIsEditModalOpen(false);
            setSelectedRecord(null);
            fetchAttendance(pagination.current_page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تحديث السجل');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (record: any) => {
        setSelectedRecord(record);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedRecord) return;
        setFormLoading(true);
        try {
            await api.delete(`/attendance/${selectedRecord.id}`);
            toast.success('تم حذف السجل بنجاح');
            setIsDeleteModalOpen(false);
            setSelectedRecord(null);
            fetchAttendance(pagination.current_page);
        } catch (error: any) {
            toast.error('فشل حذف السجل');
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const columns = [
        {
            header: 'الموظف',
            accessor: 'user.name',
            render: (row: any) => row.user?.name || '-'
        },
        {
            header: 'التاريخ',
            accessor: 'date',
            render: (row: any) => new Date(row.date).toLocaleDateString('ar-EG')
        },
        { header: 'وقت الدخول', accessor: 'check_in' },
        { header: 'وقت الخروج', accessor: 'check_out', render: (row: any) => row.check_out || '-' },
        { header: 'ساعات العمل', accessor: 'work_hours', render: (row: any) => row.work_hours ? `${row.work_hours} ساعة` : '-' },
        {
            header: 'الحالة',
            accessor: 'status',
            render: (row: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'present' ? 'bg-emerald-100 text-emerald-600' :
                        row.status === 'late' ? 'bg-amber-100 text-amber-600' :
                            'bg-slate-100 text-slate-500'
                    }`}>
                    {row.status === 'present' ? 'حاضر' : row.status === 'late' ? 'متأخر' : 'غياب'}
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
            <h2 className="text-2xl font-bold text-slate-900">سجل الحضور والانصراف</h2>
            <DataTable
                columns={columns}
                data={attendance}
                loading={loading}
                pagination={{ ...pagination, onPageChange: fetchAttendance }}
            />

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="تعديل سجل الحضور">
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">وقت الدخول</label>
                            <input type="time" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" step="1" value={formData.check_in} onChange={e => setFormData({ ...formData, check_in: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">وقت الخروج</label>
                            <input type="time" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" step="1" value={formData.check_out} onChange={e => setFormData({ ...formData, check_out: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">الحالة</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="present">حاضر</option>
                            <option value="late">متأخر</option>
                            <option value="absent">غائب</option>
                            <option value="excused">معذور</option>
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
                message={`هل أنت متأكد من رغبتك في حذف هذا السجل؟`}
                isLoading={formLoading}
            />
        </div>
    );
}
