"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useAuth();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: string; text: string } | null>(
        null
    );

    // Unwrap params using React.use()
    const { id } = use(params);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error("Failed to fetch job", error);
                router.push("/");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, router]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        try {
            await api.post(`/jobs/${id}/apply`, { cover_letter: coverLetter });
            setMessage({ type: "success", text: "Successfully applied!" });
            setTimeout(() => {
                setIsModalOpen(false);
                setCoverLetter("");
                setMessage(null);
            }, 2000);
        } catch (error: any) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to apply.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">← Back to Jobs</Link>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
                <div className="p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                            <div className="mt-2 text-lg text-gray-600 flex items-center">
                                {job.company?.name && <span className="font-semibold text-gray-900 mr-2">{job.company.name}</span>}
                                <span className="text-gray-400 mx-2">•</span>
                                <span>{job.location}</span>
                                <span className="text-gray-400 mx-2">•</span>
                                <span className="capitalize">{job.work_type}</span>
                            </div>
                        </div>
                        {user?.type === "seeker" && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                            >
                                Apply Now
                            </button>
                        )}
                        {!user && (
                            <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">
                                Login to Apply
                            </Link>
                        )}
                    </div>

                    <div className="mt-8">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {job.tags?.map((tag: any) => (
                                <span key={tag.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>

                        {job.salary && (
                            <div className="mb-6 p-4 bg-green-50 rounded-lg inline-block">
                                <span className="text-green-800 font-semibold">Salary: ${job.salary}</span>
                            </div>
                        )}

                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Job Description</h2>
                        <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                            {job.description}
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4">Apply for {job.title}</h2>

                        {message && (
                            <div className={`p-3 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleApply}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cover Letter (Optional)
                                </label>
                                <textarea
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-[150px] p-3 border"
                                    placeholder="Introduce yourself..."
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? "Applying..." : "Submit Application"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
