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
    const q = search.toLowerCase();

    return (
      (job.job_title.toLowerCase().includes(q) ||
        job.company_name.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)) &&
      (companyFilter === "All" || job.company_name === companyFilter) &&
      (locationFilter === "All" || job.location === locationFilter)
    );
  });

  function getInitials(company: string) {
    return company
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Vesta AI Job Agent
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Today&apos;s Fresh Jobs
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Fresh roles collected automatically from company career sites by
            the Vesta AI agent.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Total Jobs</p>
              <h2 className="mt-2 text-3xl font-bold">{jobs.length}</h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Companies</p>
              <h2 className="mt-2 text-3xl font-bold">
                {companies.length - 1}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">Filtered Results</p>
              <h2 className="mt-2 text-3xl font-bold">
                {filteredJobs.length}
              </h2>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search title, company, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
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
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </section>

        <section className="mt-8 grid gap-5">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-lg font-bold text-white">
                    {getInitials(job.company_name)}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-blue-400">
                      {job.company_name}
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold">
                      {job.job_title}
                    </h2>

                    <p className="mt-2 text-slate-300">
                      {job.location || "Not specified"}
                    </p>
                  </div>
                </div>

                <a
                  href={job.apply_url}
                  target="_blank"
                  className="rounded-xl bg-blue-500 px-6 py-3 text-center font-semibold hover:bg-blue-600"
                >
                  Apply Now
                </a>
              </div>
            </article>
          ))}

          {filteredJobs.length === 0 && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              No jobs found.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}