"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import JobFilters from "@/components/JobFilters";

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

    if (data) {
      setJobs(data);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text = `
        ${job.company_name}
        ${job.job_title}
        ${job.location}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [jobs, search]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Vesta AI Platform
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            Daily AI Powered Job Feed
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Discover AI, ML, Full Stack, Cloud, and Software Engineering jobs
            collected automatically from company career portals.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                Total Jobs
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {jobs.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                Search Results
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {filteredJobs.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                ATS Sources
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-400">
                Greenhouse • Lever • Workday
              </h2>
            </div>

          </div>

        </section>

        <section className="mt-8">
          <JobFilters
            search={search}
            setSearch={setSearch}
          />
        </section>

        <section className="mt-8 grid gap-5">

          {filteredJobs.map((job) => {

            const text = `
              ${job.job_title}
              ${job.location}
            `.toLowerCase();

            const badges = [];

            if (text.includes("ai")) badges.push("AI");
            if (text.includes("machine learning")) badges.push("ML");
            if (text.includes("react")) badges.push("React");
            if (text.includes("java")) badges.push("Java");
            if (text.includes("cloud")) badges.push("Cloud");
            if (text.includes("remote")) badges.push("Remote");
            if (text.includes("python")) badges.push("Python");
            if (text.includes("aws")) badges.push("AWS");
            if (text.includes("azure")) badges.push("Azure");
            if (text.includes("gcp")) badges.push("GCP");

            return (

              <div
                key={job.id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500 hover:shadow-2xl"
              >

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>

                    <p className="text-sm font-semibold text-blue-400">
                      {job.company_name}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {job.job_title}
                    </h2>

                    <p className="mt-3 text-slate-300">
                      {job.location}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {badges.map((badge) => (

                        <span
                          key={badge}
                          className="rounded-full border border-blue-500 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300"
                        >
                          {badge}
                        </span>

                      ))}

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <a
                      href={job.apply_url}
                      target="_blank"
                      className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600"
                    >
                      Apply Now
                    </a>

                  </div>

                </div>

              </div>

            );

          })}

          {filteredJobs.length === 0 && (

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">

              <h2 className="text-3xl font-bold">
                No Jobs Found
              </h2>

              <p className="mt-3 text-slate-400">
                Try searching for AI, Java, React, Cloud, Remote, etc.
              </p>

            </div>

          )}

        </section>

      </div>
    </main>
  );
}