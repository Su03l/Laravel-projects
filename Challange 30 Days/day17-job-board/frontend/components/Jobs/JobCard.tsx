import Link from "next/link";

interface Job {
    id: number;
    title: string;
    description: string;
    location: string;
    work_type: string;
    salary: string;
    created_at: string;
    company: {
        id: number;
        name: string;
        avatar?: string;
    };
    tags: {
        id: number;
        name: string;
    }[];
}

interface JobCardProps {
    job: Job;
}

export default function JobCard({ job }: JobCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 p-6 flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{job.company.name}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
                        {job.work_type}
                    </span>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                        <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {job.location}
                    </div>
                    {job.salary && (
                        <div className="flex items-center">
                            <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salary}
                        </div>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                        >
                            #{tag.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <Link
                    href={`/jobs/${job.id}`}
                    className="block w-full text-center rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-100 transition"
                >
                    View Details
                </Link>
            </div>

        </div>
    );
}
