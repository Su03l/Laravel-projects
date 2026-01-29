'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Eye, Check, X } from 'lucide-react';

export default function LeavesManagementPage() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    const [selectedLeave, setSelectedLeave] = useState<any>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(false);

    const fetchLeaves = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/leaves?page=${page}`);
            setLeaves(response.data.data.data || []);
            setPagination({
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                total: response.data.data.total
            });
        } catch (error) {
            console.error(error);
            toast.error('فشل تحميل الطلبات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleViewDetails = (leave: any) => {
        setSelectedLeave(leave);
        setRejectionReason('');
        setShowRejectionInput(false);
        setIsDetailsModalOpen(true);
    };

    const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
        if (status === 'rejected' && !showRejectionInput) {
            setShowRejectionInput(true);
            return;
        }

        if (status === 'rejected' && !rejectionReason.trim()) {
            toast.error('الرجاء كتابة سبب الرفض');
            return;
        }

        setActionLoading(true);
        try {
            await api.put(`/leaves/${selectedLeave.id}/status`, {
                status,
                rejection_reason: status === 'rejected' ? rejectionReason : null
            });
            toast.success(`تم ${status === 'approved' ? 'قبول' : 'رفض'} الطلب بنجاح`);
            setIsDetailsModalOpen(false);
            fetchLeaves(pagination.current_page);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'حدث خطأ ما');
        } finally {
            setActionLoading(false);
        }
    };

    const leavesTypes: any = {
        annual: 'سنوية',
        sick: 'مرضية',
        unpaid: 'بدون راتب',
        emergency: 'طارئة'
    };

    const columns = [
        {
            header: 'الموظف',
            accessor: 'user.name',
            render: (row: any) => row.user?.name || '-'
        },
        {
            header: 'النوع',
            accessor: 'type',
            render: (row: any) => leavesTypes[row.type] || row.type
        },
        {
            header: 'من',
            accessor: 'start_date',
            render: (row: any) => new Date(row.start_date).toLocaleDateString('ar-EG')
        },
        {
            header: 'إلى',
            accessor: 'end_date',
            render: (row: any) => new Date(row.end_date).toLocaleDateString('ar-EG')
        },
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
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[row.status]}`}>
                        {labels[row.status] || row.status}
                    </span>
                );
            }
        },
        {
            header: 'عرض',
            accessor: 'actions',
            render: (row: any) => (
                <button
                    onClick={() => handleViewDetails(row)}
                    className="p-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    title="التفاصيل"
                >
                    <Eye size={18} />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">إدارة طلبات الإجازات</h2>
            <DataTable
                columns={columns}
                data={leaves}
                loading={loading}
                pagination={{ ...pagination, onPageChange: fetchLeaves }}
            />

            {/* Details Modal */}
            <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="تفاصيل الطلب">
                {selectedLeave && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 block">الموظف</span>
                                <span className="font-semibold">{selectedLeave.user?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">القسم</span>
                                <span className="font-semibold">{selectedLeave.user?.department || '-'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">نوع الإجازة</span>
                                <span className="font-semibold">{leavesTypes[selectedLeave.type]}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">المدة</span>
                                <span className="font-semibold">
                                    {new Date(selectedLeave.start_date).toLocaleDateString('ar-EG')} - {new Date(selectedLeave.end_date).toLocaleDateString('ar-EG')}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                            <span className="text-gray-500 block text-xs mb-1">سبب الإجازة:</span>
                            <p className="text-gray-800 text-sm">{selectedLeave.reason}</p>
                        </div>

                        {selectedLeave.status === 'pending' ? (
                            <div className="mt-6 border-t pt-4">
                                {showRejectionInput && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">سبب الرفض</label>
                                        <textarea
                                            className="w-full border rounded-md p-2 text-sm"
                                            rows={2}
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="اكتب سبب الرفض هنا..."
                                        />
                                    </div>
                                )}
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        onClick={() => handleStatusUpdate('rejected')}
                                        variant="danger"
                                        disabled={actionLoading}
                                        className="flex items-center gap-2"
                                    >
                                        <X size={16} />
                                        {showRejectionInput ? 'تأكيد الرفض' : 'رفض الطلب'}
                                    </Button>
                                    {!showRejectionInput && (
                                        <Button
                                            onClick={() => handleStatusUpdate('approved')}
                                            variant="primary" // Assuming primary is green-ish, or default
                                            disabled={actionLoading}
                                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            <Check size={16} />
                                            قبول الطلب
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 border-t pt-4">
                                <span className="block text-sm font-medium text-gray-500">حالة الطلب:</span>
                                <div className={`mt-2 p-2 rounded text-center font-bold ${selectedLeave.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                    }`}>
                                    {selectedLeave.status === 'approved' ? 'تم قبول الطلب' : 'تم رفض الطلب'}
                                </div>
                                {selectedLeave.status === 'rejected' && selectedLeave.rejection_reason && (
                                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                        سبب الرفض: {selectedLeave.rejection_reason}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
