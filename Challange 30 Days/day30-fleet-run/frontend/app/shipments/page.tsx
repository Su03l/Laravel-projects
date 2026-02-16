'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Shipment } from '@/types/api';
import { Eye, FileText, CheckCircle, Clock, Truck, Plus, X, Package } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function ShipmentsPage() {
    const [page, setPage] = useState(1);
    const [selectedPOD, setSelectedPOD] = useState<string | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['shipments', page],
        queryFn: async () => {
            // Mock data if API fails or for initial dev
            try {
                const response = await api.get(`/shipments?page=${page}`);
                return response.data.data;
            } catch (error) {
                return {
                    data: [
                        { id: 1001, tracking_number: 'TRK-885421', status: 'delivered', driver: { user: { name: 'Ahmed' } }, pickup_address: 'Riyadh Warehouse A', delivery_address: 'Jeddah Branch 1', proof_of_delivery_path: 'https://via.placeholder.com/600x400?text=POD+Image' },
                        { id: 1002, tracking_number: 'TRK-992154', status: 'in_transit', driver: { user: { name: 'Khalid' } }, pickup_address: 'Dammam Port', delivery_address: 'Riyadh Main Hub', proof_of_delivery_path: null },
                        { id: 1003, tracking_number: 'TRK-774125', status: 'pending', driver: null, pickup_address: 'Supplier X', delivery_address: 'Warehouse B', proof_of_delivery_path: null },
                        { id: 1004, tracking_number: 'TRK-332154', status: 'picked_up', driver: { user: { name: 'Omar' } }, pickup_address: 'Factory Zone', delivery_address: 'Airport Cargo', proof_of_delivery_path: null },
                    ],
                    meta: { current_page: page, last_page: 5, total: 50 }
                };
            }
        }
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'pending': 'bg-gray-500/20 text-gray-300 border-gray-500/50',
            'picked_up': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
            'in_transit': 'bg-orange-500/20 text-orange-300 border-orange-500/50',
            'delivered': 'bg-green-500/20 text-green-300 border-green-500/50',
            'cancelled': 'bg-red-500/20 text-red-300 border-red-500/50',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles['pending']} capitalize`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Shipments</h2>
                    <p className="text-gray-400 mt-1">Manage and track your logistics operations.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-all shadow-lg shadow-indigo-500/20">
                    <Plus className="w-5 h-5 mr-2" />
                    New Shipment
                </button>
            </div>

            <div className="glass-card overflow-hidden rounded-xl border border-white/10">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-[#252525]/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tracking #</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Driver</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Route</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-[#1a1a1a]/40">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center">
                                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : data?.data?.map((shipment: Shipment) => (
                                <tr key={shipment.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Package className="h-5 w-5 text-indigo-400 mr-3" />
                                            <span className="text-sm font-medium text-white">{shipment.tracking_number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(shipment.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {shipment.driver ? (
                                            <div className="flex items-center text-sm text-gray-300">
                                                <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center mr-2 text-xs">
                                                    {shipment.driver.user?.name?.charAt(0)}
                                                </div>
                                                {shipment.driver.user?.name}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-300">
                                            <div className="flex items-center mb-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></div>
                                                {shipment.pickup_address}
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                                                {shipment.delivery_address}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {shipment.status === 'delivered' && shipment.proof_of_delivery_path && (
                                            <button
                                                onClick={() => setSelectedPOD(shipment.proof_of_delivery_path!)}
                                                className="text-indigo-400 hover:text-indigo-300 transition-colors mr-3"
                                                title="View POD"
                                            >
                                                <FileText className="h-5 w-5" />
                                            </button>
                                        )}
                                        <button className="text-gray-400 hover:text-white transition-colors">
                                            <Eye className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data?.meta && (
                    <div className="bg-[#1a1a1a]/60 px-6 py-3 border-t border-white/5 flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                            Showing page <span className="font-bold text-white">{data.meta.current_page}</span> of <span className="font-bold text-white">{data.meta.last_page}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page === data.meta.last_page}
                                className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* POD Modal */}
            {selectedPOD && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative bg-[#252525] rounded-xl max-w-2xl w-full border border-white/10 shadow-2xl p-6">
                        <button
                            onClick={() => setSelectedPOD(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            Proof of Delivery
                        </h3>
                        <div className="rounded-lg overflow-hidden bg-[#1a1a1a] border border-white/5">
                            <img src={selectedPOD} alt="Proof of Delivery" className="w-full h-auto object-contain max-h-[60vh]" />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => window.open(selectedPOD, '_blank')}
                                className="text-sm text-indigo-400 hover:text-indigo-300"
                            >
                                Open Original
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
