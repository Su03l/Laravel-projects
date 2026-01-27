"use client";

import { useState } from "react";

interface JobFiltersProps {
    onFilter: (filters: any) => void;
}

export default function JobFilters({ onFilter }: JobFiltersProps) {
    const [filters, setFilters] = useState({
        search: "",
        location: "",
        work_type: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter(filters);
    }

    return (
        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-4xl mx-auto -mt-10 relative z-20">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        name="search"
                        placeholder="وش الوظيفة اللي ببالك؟"
                        className="block w-full rounded-xl border-none ring-1 ring-slate-200 py-3 pr-10 pl-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all sm:text-sm h-12 text-right"
                        value={filters.search}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        name="location"
                        placeholder="المدينة / المكان"
                        className="block w-full rounded-xl border-none ring-1 ring-slate-200 py-3 pr-10 pl-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all sm:text-sm h-12 text-right"
                        value={filters.location}
                        onChange={handleChange}
                    />
                </div>

                <div className="md:w-48">
                    <select
                        name="work_type"
                        className="block w-full rounded-xl border-none ring-1 ring-slate-200 py-3 pr-3 pl-10 text-slate-900 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all sm:text-sm h-12 text-right"
                        value={filters.work_type}
                        onChange={handleChange}
                        style={{ backgroundImage: 'none' }} // Remove default chevron to add custom one if needed, or keeping it simpel
                    >
                        <option value="">كل الأنواع</option>
                        <option value="full-time">دوام كامل</option>
                        <option value="part-time">دوام جزئي</option>
                        <option value="contract">عقد</option>
                        <option value="freelance">مستقل (فريلانس)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white rounded-xl px-8 py-3 font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 active:scale-95 whitespace-nowrap h-12 flex items-center justify-center font-sans"
                >
                    بحث
                </button>
            </form>
        </div>
    );
}
