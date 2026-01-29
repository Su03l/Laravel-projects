'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function MyLeavesPage() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'annual',
        start_date: '',
        end_date: '',
        reason: ''
    });

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await api.get('/my-leaves');
            // ApiResponse wrapper -> data (Array) [Non-paginated]
            setLeaves(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error('فشل تحميل سجل الإجازات');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await api.post('/leaves', formData);
            toast.success('تم تقديم طلب الإجازة بنجاح');
            setIsModalOpen(false);
            setFormData({ type: 'annual', start_date: '', end_date: '', reason: '' });
            fetchLeaves();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تقديم الطلب');
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const leavesTypes: any = {
        annual: 'سنوية',
        sick: 'مرضية',
        unpaid: 'بدون راتب',
        emergency: 'طارئة'
    };

    const columns = [
        {
            header: 'نوع الإجازة',
            accessor: 'type',
            render: (row: any) => leavesTypes[row.type] || row.type
        },
        {
            header: 'من تاريخ',
            accessor: 'start_date',
            render: (row: any) => new Date(row.start_date).toLocaleDateString('ar-EG')
        },
        {
            header: 'إلى تاريخ',
            accessor: 'end_date',
            render: (row: any) => new Date(row.end_date).toLocaleDateString('ar-EG')
        },
        { header: 'السبب', accessor: 'reason' },
        {
            header: 'الحالة',
            accessor: 'status',
            render: (row: any) => {
                const colors: any = {
                    pending: 'bg-amber-100 text-amber-600',
                    approved: 'bg-emerald-100 text-emerald-600',
                    rejected: 'bg-rose-100 text-rose-600'
                };
                const labels: any = {
                    pending: 'قيد المراجعة',
                    approved: 'مقبولة',
                    rejected: 'مرفوضة'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[row.status] || 'bg-slate-100'}`}>
                        {labels[row.status] || row.status}
                    </span>
                );
            }
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">سجل الإجازات</h2>
            <DataTable
                columns={columns}
                data={leaves}
                loading={loading}
                actionButton={{ label: 'طلب إجازة', onClick: () => setIsModalOpen(true) }}
            />

            {/* Request Leave Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="تقديم طلب إجازة">
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">نوع الإجازة</label>
                        <select
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="annual">سنوية</option>
                            <option value="sick">مرضية</option>
                            <option value="unpaid">بدون راتب</option>
                            <option value="emergency">طارئة</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">من تاريخ</label>
                            <input
                                type="date"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                value={formData.start_date}
                                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">إلى تاريخ</label>
                            <input
                                type="date"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                value={formData.end_date}
                                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">السبب</label>
                        <textarea
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            rows={3}
                            value={formData.reason}
                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
                        <Button type="submit" disabled={formLoading}>{formLoading ? 'جاري التقديم...' : 'تقديم الطلب'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
