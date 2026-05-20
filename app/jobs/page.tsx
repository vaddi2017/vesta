"use client";

import { useEffect, useState } from "react";
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

  async function fetchJobs() {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .gte("expires_at", new Date().toISOString())
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setJobs(data);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold">
          Today&apos;s Fresh Jobs
        </h1>

        <p className="mt-3 text-slate-300">
          Jobs collected by Vesta AI Agent
        </p>

        <div className="mt-8 grid gap-4">

          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-sm text-blue-400">
                {job.company_name}
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {job.job_title}
              </h2>

              <p className="mt-2 text-slate-300">
                {job.location}
              </p>

              <a
                href={job.apply_url}
                target="_blank"
                className="mt-4 inline-block rounded-xl bg-blue-500 px-5 py-2 font-semibold hover:bg-blue-600"
              >
                Apply
              </a>
            </div>
          ))}

          {jobs.length === 0 && (
            <p className="text-slate-400">
              No jobs found.
            </p>
          )}

        </div>
      </div>
    </main>
  );
}