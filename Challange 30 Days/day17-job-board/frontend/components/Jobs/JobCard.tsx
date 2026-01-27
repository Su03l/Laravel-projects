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
    // Helpers for formatting
    const formattedDate = new Date(job.created_at).toLocaleDateString('ar-SA', {
        day: 'numeric', month: 'long'
    });

    const translateWorkType = (type: string) => {
        const types: any = {
            'full-time': 'دوام كامل',
            'part-time': 'دوام جزئي',
            'contract': 'عقد',
            'freelance': 'فريلانس',
        }
        return types[type] || type;
    }

    return (
        <div className="group bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100/50 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between h-full text-right">

            {/* Top Section */}
            <div>
                <div className="flex justify-between items-start mb-4">
                    {/* Company Icon Placeholder */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">
                            {job.company.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-500">{job.company.name}</h4>
                            <p className="text-xs text-slate-400">{formattedDate}</p>
                        </div>
                    </div>

                    <span className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 capitalize">
                        {translateWorkType(job.work_type)}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    <Link href={`/jobs/${job.id}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {job.title}
                    </Link>
                </h3>

                <div className="flex items-center text-sm text-slate-500 mb-4 gap-4">
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                    </span>
                    {job.salary && (
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salary}
                        </span>
                    )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {job.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag.id}
                            className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600"
                        >
                            #{tag.name}
                        </span>
                    ))}
                    {job.tags.length > 3 && (
                        <span className="inline-flex items-center text-xs text-slate-400">+ {job.tags.length - 3}</span>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600 group-hover:underline decoration-blue-200 underline-offset-4 transition-all">
                    التفاصيل
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-45 rotate-180">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
