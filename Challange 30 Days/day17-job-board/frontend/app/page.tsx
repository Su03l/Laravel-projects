"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import JobCard from "@/components/Jobs/JobCard";
import JobFilters from "@/components/Jobs/JobFilters";

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (filters: any = {}) => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );

      const { data } = await api.get("/jobs", { params });
      setJobs(data.data);
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
    fetchJobs(filters);
  };

  return (
    <div className="-mt-8"> 
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl isolate">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.600),theme(colors.slate.900))] opacity-50"></div>
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-slate-900 shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>

        <div className="relative px-6 py-24 sm:px-12 sm:py-32 lg:px-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Perfect Job</span><br />
            That Fits Your Life
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Join thousands of companies and startups hiring top talent.
            Whether you are looking for remote work, a new career path, or your next big break.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Floating Filters */}
        <JobFilters onFilter={handleFilter} />

        <div className="mt-16 mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Latest Opportunities</h2>
            <div className="text-sm text-slate-500">Showing {jobs.length} jobs</div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 h-64 animate-pulse shadow-sm border border-slate-100">
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded"></div>
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
                <div className="text-center py-24">
                  <div className="bg-slate-50 inline-flex items-center justify-center w-24 h-24 rounded-full mb-6">
                    <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-slate-900">No jobs found</h3>
                  <p className="mt-2 text-slate-500 max-w-sm mx-auto">We couldn't find any jobs matching your current filters. Try adjusting your search criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
