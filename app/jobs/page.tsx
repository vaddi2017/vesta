"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import JobFilters from "@/components/JobFilters";
import Navbar from "@/components/Navbar";

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

  async function saveJob(job: Job) {
    const { error } = await supabase.from("saved_jobs").insert({
      company_name: job.company_name,
      job_title: job.job_title,
      location: job.location,
      apply_url: job.apply_url,
    });

    if (error) {
      alert("Failed to save job");
      return;
    }

    alert("Job saved successfully");
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text = `${job.company_name} ${job.job_title} ${job.location}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [jobs, search]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
              Vesta AI Jobs
            </p>

            <h1 className="mt-4 text-5xl font-bold">
              Today&apos;s Fresh Jobs
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Jobs collected by Vesta AI Agent from company career portals.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Total Jobs</p>
                <h2 className="mt-2 text-4xl font-bold">{jobs.length}</h2>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">Search Results</p>
                <h2 className="mt-2 text-4xl font-bold">
                  {filteredJobs.length}
                </h2>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <JobFilters search={search} setSearch={setSearch} />
          </section>

          <section className="mt-8 grid gap-5">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500 hover:shadow-2xl"
              >
                <p className="text-sm font-semibold text-blue-400">
                  {job.company_name}
                </p>

                <h2 className="mt-2 text-2xl font-bold">{job.job_title}</h2>

                <p className="mt-3 text-slate-300">{job.location}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => saveJob(job)}
                    className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold hover:bg-emerald-600"
                  >
                    Save Job
                  </button>

                  <a
                    href={job.apply_url}
                    target="_blank"
                    className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
                <h2 className="text-3xl font-bold">No Jobs Found</h2>
                <p className="mt-3 text-slate-400">
                  Try searching for AI, Java, React, Cloud, Remote, etc.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}