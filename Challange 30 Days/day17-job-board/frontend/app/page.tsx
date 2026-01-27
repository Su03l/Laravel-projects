"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import JobCard from "@/components/Jobs/JobCard";
import JobFilters from "@/components/Jobs/JobFilters";

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchJobs = async (page = 1, filters: any = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        )
      };

      const { data } = await api.get("/jobs", { params });

      // Handle Laravel Pagination Structure
      // It might be data.data (items) and data (meta) depending on how it's returned
      // Inspecting controller: return response()->json($query->paginate(10));
      // This returns { data: [...], current_page: 1, last_page: x, ... } directly.

      setJobs(data.data);
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total
      });
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilter = (filters: any) => {
    setCurrentFilters(filters);
    fetchJobs(1, filters);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchJobs(newPage, currentFilters);
      // Scroll to top of job list
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }

  return (
    <div className="-mt-8 pb-20">
      {/* MODERN HERO SECTION */}
      <div className="relative isolate overflow-hidden bg-white pt-14 pb-16 lg:pb-24">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-indigo-50 to-white"></div>
        <div className="absolute inset-y-0 left-0 -z-10 w-1/2 bg-gradient-to-r from-blue-50/50 to-transparent"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-3xl text-center pt-10 sm:pt-16">
            {/* Badge Removed per user request */}

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-backwards delay-100 leading-tight font-sans">
              اكتشف <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-indigo-600">وظيفتك المثالية</span> <br className="hidden sm:block" />
              وحقق طموحك اليوم.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-backwards delay-200">
              انضم لآلاف الشركات والستارتبس اللي يدورون على مواهب مثلك.
              سواء كنت تدور على دوام كامل، عمل عن بعد، أو فرصة جديدة تغير مسارك المهني.
            </p>
          </div>
        </div>

        {/* Background Shapes for depth */}
        <div className="absolute right-1/2 top-0 -z-10 translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* Floating Filters - Overlapping Hero */}
        <JobFilters onFilter={handleFilter} />

        <div className="mt-20">
          <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">أحدث الفرص الوظيفية</h2>
              <p className="text-slate-500 mt-1">تصفح أجدد الوظائف المضافة اليوم</p>
            </div>
            <div className="hidden sm:block text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {pagination.total} وظيفة متاحة
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 h-72 animate-pulse shadow-sm border border-slate-100">
                  <div className="flex gap-4 mb-6">
                    <div className="h-12 w-12 bg-slate-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3 mt-8">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {jobs.length === 0 && (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="bg-slate-50 inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ring-8 ring-slate-50">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">ما لقينا شي :(</h3>
                  <p className="mt-2 text-slate-500 max-w-sm mx-auto">حاول تغير في الفلاتر أو جرب كلمات ثانية.</p>
                </div>
              )}

              {/* Pagination Controls */}
              {pagination.lastPage > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
                      // Show first, last, current, and surrounding pages
                      (page === 1 || page === pagination.lastPage || (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)) ? (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${pagination.currentPage === page
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                              : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                            }`}
                        >
                          {page}
                        </button>
                      ) : (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) ? (
                        <span key={page} className="text-slate-400">...</span>
                      ) : null
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.lastPage}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
