"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyApplicationsPage() {
    const { user, loading: authLoading } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [editingApp, setEditingApp] = useState<any | null>(null);
    const [editCoverLetter, setEditCoverLetter] = useState("");
    const [updating, setUpdating] = useState(false);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get("/my-applications");
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.type !== 'seeker') {
                router.push('/');
                return;
            }
            fetchApplications();
        }
    }, [user, authLoading, router]);

    const handleWithdraw = async (id: number) => {
        if (!confirm("Are you sure you want to withdraw this application?")) return;
        try {
            await api.delete(`/applications/${id}`);
            setApplications(apps => apps.filter(app => app.id !== id));
        } catch (error) {
            alert("Failed to withdraw application");
        }
    }

    const openEditModal = (app: any) => {
        setEditingApp(app);
        setEditCoverLetter(app.cover_letter || "");
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingApp) return;
        setUpdating(true);
        try {
            await api.put(`/applications/${editingApp.id}`, { cover_letter: editCoverLetter });
            setApplications(apps => apps.map(app => app.id === editingApp.id ? { ...app, cover_letter: editCoverLetter } : app));
            setEditingApp(null);
        } catch (error) {
            alert("Failed to update application");
        } finally {
            setUpdating(false);
        }
    }

    if (authLoading || loading) return <div className="p-10">Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
                <ul role="list" className="divide-y divide-gray-200">
                    {applications.length === 0 ? (
                        <li className="px-6 py-10 text-center text-gray-500">
                            You haven't applied to any jobs yet.
                        </li>
                    ) : (
                        applications.map((app) => (
                            <li key={app.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                                <Link href={`/jobs/${app.job.id}`} className="hover:text-blue-600">
                                                    {app.job.title}
                                                </Link>
                                            </h3>
                                            <p className="text-sm text-gray-500">{app.job.company?.name}</p>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        Applied on {new Date(app.created_at).toLocaleDateString()}
                                    </div>
                                    {app.cover_letter && (
                                        <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded italic">
                                            "{app.cover_letter}"
                                        </div>
                                    )}
                                    {app.status === 'pending' && (
                                        <div className="mt-4 flex space-x-3">
                                            <button
                                                onClick={() => openEditModal(app)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Edit Cover Letter
                                            </button>
                                            <button
                                                onClick={() => handleWithdraw(app.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Withdraw
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Edit Modal */}
            {editingApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Edit Cover Letter</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <textarea
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-[150px] p-3 border"
                                    value={editCoverLetter}
                                    onChange={(e) => setEditCoverLetter(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingApp(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    disabled={updating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    disabled={updating}
                                >
                                    {updating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
