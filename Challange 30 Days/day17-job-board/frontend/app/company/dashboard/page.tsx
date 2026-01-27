"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CompanyDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Job Creation State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newJob, setNewJob] = useState({
        title: "",
        description: "",
        location: "",
        work_type: "full-time",
        salary: "",
        tags: "", // Comma separated for input
    });
    const [creating, setCreating] = useState(false);


    const fetchMyJobs = async () => {
        // Since backend doesn't filter, we filter client side
        try {
            const { data } = await api.get("/jobs?limit=100");


            if (user) {
                const myJobs = data.data.filter((job: any) => job.company?.id === user.id || job.user_id === user.id);
                setJobs(myJobs);
            }
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.type !== 'company') {
                router.push('/');
                return;
            }
            fetchMyJobs();
        }
    }, [user, authLoading, router]);

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const payload = {
                ...newJob,
                tags: newJob.tags.split(',').map(t => t.trim()).filter(t => t)
            };
            await api.post('/jobs', payload);
            setIsModalOpen(false);
            setNewJob({ title: "", description: "", location: "", work_type: "full-time", salary: "", tags: "" });
            fetchMyJobs(); // Refresh
        } catch (error) {
            alert("Failed to create job");
        } finally {
            setCreating(false);
        }
    }

    if (authLoading || loading) return <div className="p-10">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                >
                    + Post New Job
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
                <ul role="list" className="divide-y divide-gray-200">
                    {jobs.length === 0 ? (
                        <li className="px-6 py-10 text-center text-gray-500">
                            You haven't posted any jobs yet.
                        </li>
                    ) : (
                        jobs.map((job) => (
                            <li key={job.id}>
                                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium leading-6 text-blue-600">
                                            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                                        </h3>
                                        <div className="mt-1 max-w-2xl text-sm text-gray-500">
                                            {job.location} • {job.work_type} • Posted on {new Date(job.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Link
                                            href={`/company/jobs/${job.id}/applications`}
                                            className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                                        >
                                            View Applications
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Create Job Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Post a New Job</h2>
                        <form onSubmit={handleCreateJob} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 h-24"
                                    value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Salary (Optional)</label>
                                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Work Type</label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={newJob.work_type} onChange={e => setNewJob({ ...newJob, work_type: e.target.value })}
                                    >
                                        <option value="full-time">Full Time</option>
                                        <option value="part-time">Part Time</option>
                                        <option value="contract">Contract</option>
                                        <option value="freelance">Freelance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                                    <input type="text" required placeholder="react, laravel, design" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={newJob.tags} onChange={e => setNewJob({ ...newJob, tags: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Post Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
