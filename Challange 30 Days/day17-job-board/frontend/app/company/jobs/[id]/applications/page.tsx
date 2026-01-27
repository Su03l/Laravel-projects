"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { id } = use(params);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get(`/jobs/${id}/applications`);
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
            // alert("Unauthorized or Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [id]);

    const updateStatus = async (appId: number, newStatus: string) => {
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            // Update local state
            setApplications(apps => apps.map(app => app.id === appId ? { ...app, status: newStatus } : app));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    }

    if (loading) return <div className="p-10">Loading applications...</div>;

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <Link href="/company/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">← Back to Dashboard</Link>
                <h1 className="text-2xl font-bold text-gray-900">Applicants ({applications.length})</h1>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
                {applications.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No applications yet.</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover Letter</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((app) => (
                                <tr key={app.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                                {app.user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{app.user.name}</div>
                                                <div className="text-sm text-gray-500">{app.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 max-w-xs truncate" title={app.cover_letter}>{app.cover_letter || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {app.status === 'pending' && (
                                            <>
                                                <button onClick={() => updateStatus(app.id, 'accepted')} className="text-green-600 hover:text-green-900 mr-4">Accept</button>
                                                <button onClick={() => updateStatus(app.id, 'rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                                            </>
                                        )}
                                        {app.status !== 'pending' && (
                                            <span className="text-gray-400">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
