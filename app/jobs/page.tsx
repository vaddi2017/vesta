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

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text =
        `${job.company_name} ${job.job_title} ${job.location}`.toLowerCase();

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
              Today's Fresh Jobs
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Jobs collected automatically from company career portals.
            </p>

          </section>

          <section className="mt-8">
            <JobFilters
              search={search}
              setSearch={setSearch}
            />
          </section>

          <section className="mt-8 grid gap-5">

            {filteredJobs.map((job) => (

              <div
                key={job.id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
              >

                <p className="text-sm font-semibold text-blue-400">
                  {job.company_name}
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {job.job_title}
                </h2>

                <p className="mt-3 text-slate-300">
                  {job.location}
                </p>

                <div className="mt-4">
                  <a
                    href={job.apply_url}
                    target="_blank"
                    className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600 inline-block"
                  >
                    Apply Now
                  </a>
                </div>

              </div>

            ))}

          </section>

        </div>
      </main>
    </>
  );
}