"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Company = {
  id: number;
  company_name: string;
  career_url: string;
};

type Job = {
  id: number;
  company_name: string;
  job_title: string;
  location: string;
  apply_url: string;
};

export default function AdminPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  async function fetchCompanies() {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setCompanies(data);
    }
  }

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

  async function refreshDashboard() {
    await fetchCompanies();
    await fetchJobs();
  }

  async function addCompany() {
    try {
      if (!name || !url) {
        alert("Please enter company name and URL");
        return;
      }

      setLoading(true);

      const { error } = await supabase.from("companies").insert([
        {
          company_name: name,
          career_url: url,
        },
      ]);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      alert("Company added successfully");

      setName("");
      setUrl("");

      refreshDashboard();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function clearJobs() {
    const confirmed = confirm(
      "Are you sure you want to delete all jobs?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("jobs")
      .delete()
      .neq("id", 0);

    if (error) {
      console.error(error);
      alert("Failed to clear jobs");
      return;
    }

    alert("All jobs cleared");

    refreshDashboard();
  }

  async function deleteJob(id: number) {
    const confirmed = confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete job");
      return;
    }

    alert("Job deleted");

    refreshDashboard();
  }

  async function runScraper() {
    try {
      alert("Scraper started. Please wait.");

      const response = await fetch(
        "https://vesta-production-f851.up.railway.app/scrape-jobs"
      );

      const result = await response.json();

      alert(
        `Scraper finished. Jobs found: ${result.jobs_found}`
      );

      refreshDashboard();

    } catch (error) {
      console.error(error);

      alert(
        "Scraper failed. Railway backend may be offline."
      );
    }
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h1 className="text-3xl font-bold">
            Vesta Admin Login
          </h1>

          <p className="mt-3 text-slate-300">
            Secure admin access for Vesta AI Platform
          </p>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-6 w-full rounded-xl bg-slate-800 px-4 py-3 outline-none"
          />

          <button
            onClick={() => {
              if (password === "Vesta2017") {
                setIsAuthenticated(true);
              } else {
                alert("Incorrect password");
              }
            }}
            className="mt-4 w-full rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600"
          >
            Login
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold">
          Vesta Admin Dashboard
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Total Companies
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {companies.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Total Jobs
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {jobs.length}
            </h2>
          </div>

        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-2xl font-semibold">
            Vesta System Status
          </h2>

          <div className="mt-4 space-y-2 text-slate-300">

            <p>
              Backend Status:
              <span className="ml-2 text-green-400 font-semibold">
                Running
              </span>
            </p>

            <p>
              Scheduler:
              <span className="ml-2 text-green-400 font-semibold">
                Active Daily at 10:00 AM CST
              </span>
            </p>

            <p>
              Frontend:
              <span className="ml-2 text-green-400 font-semibold">
                Online
              </span>
            </p>

            <p>
              Database:
              <span className="ml-2 text-green-400 font-semibold">
                Connected
              </span>
            </p>

          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">

          <button
            onClick={clearJobs}
            className="rounded-xl bg-red-500 px-6 py-3 font-semibold hover:bg-red-600"
          >
            Clear All Jobs
          </button>

          <button
            onClick={runScraper}
            className="rounded-xl bg-green-500 px-6 py-3 font-semibold hover:bg-green-600"
          >
            Run Job Scraper Now
          </button>

        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-2xl font-semibold">
            Add Career Site
          </h2>

          <div className="mt-6 flex flex-col gap-4">

            <input
              type="text"
              placeholder="Company Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl bg-slate-800 px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="Career URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="rounded-xl bg-slate-800 px-4 py-3 outline-none"
            />

            <button
              type="button"
              onClick={addCompany}
              disabled={loading}
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Company"}
            </button>

          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-2xl font-semibold">
            Saved Career Sites
          </h2>

          <div className="mt-6 space-y-4">

            {companies.length === 0 && (
              <p className="text-slate-400">
                No companies added yet.
              </p>
            )}

            {companies.map((company) => (
              <div
                key={company.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <h3 className="text-lg font-semibold">
                  {company.company_name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {company.career_url}
                </p>

              </div>
            ))}

          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-2xl font-semibold">
            Manage Jobs
          </h2>

          <div className="mt-6 space-y-4">

            {jobs.length === 0 && (
              <p className="text-slate-400">
                No jobs available.
              </p>
            )}

            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="text-sm text-blue-400">
                  {job.company_name}
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                  {job.job_title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {job.location}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">

                  <a
                    href={job.apply_url}
                    target="_blank"
                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600"
                  >
                    View Job
                  </a>

                  <button
                    onClick={() => deleteJob(job.id)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600"
                  >
                    Delete Job
                  </button>

                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </main>
  );
}