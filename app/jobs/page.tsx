"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Job = {
  id: number;
  company_name: string;
  job_title: string;
  location: string;
  apply_url: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  async function fetchJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    if (data) setJobs(data);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const companies = useMemo(() => {
    return ["All", ...Array.from(new Set(jobs.map((job) => job.company_name)))];
  }, [jobs]);

  const locations = useMemo(() => {
    return ["All", ...Array.from(new Set(jobs.map((job) => job.location)))];
  }, [jobs]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.job_title.toLowerCase().includes(search.toLowerCase()) ||
      job.company_name.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());

    const matchesCompany =
      companyFilter === "All" || job.company_name === companyFilter;

    const matchesLocation =
      locationFilter === "All" || job.location === locationFilter;

    return matchesSearch && matchesCompany && matchesLocation;
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Today&apos;s Fresh Jobs</h1>

        <p className="mt-3 text-slate-300">
          Jobs collected by Vesta AI Agent
        </p>

        <div className="mt-8 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search jobs, company, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl bg-slate-800 px-4 py-3 outline-none"
          />

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="rounded-xl bg-slate-800 px-4 py-3 outline-none"
          >
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="rounded-xl bg-slate-800 px-4 py-3 outline-none"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>

        <div className="mt-8 grid gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-sm text-blue-400">{job.company_name}</p>

              <h2 className="mt-2 text-2xl font-semibold">{job.job_title}</h2>

              <p className="mt-2 text-slate-300">{job.location}</p>

              <a
                href={job.apply_url}
                target="_blank"
                className="mt-4 inline-block rounded-xl bg-blue-500 px-5 py-2 font-semibold hover:bg-blue-600"
              >
                Apply
              </a>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <p className="text-slate-400">No jobs found.</p>
          )}
        </div>
      </div>
    </main>
  );
}