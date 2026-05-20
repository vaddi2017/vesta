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
    const { data } = await supabase
      .from("companies")
      .select("*")
      .order("id", { ascending: false });

    if (data) setCompanies(data);
  }

  async function fetchJobs() {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .order("id", { ascending: false });

    if (data) setJobs(data);
  }

  async function refreshDashboard() {
    await fetchCompanies();
    await fetchJobs();
  }

  async function addCompany() {
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

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Company added successfully");

    setName("");
    setUrl("");

    refreshDashboard();
  }

  async function clearJobs() {
    if (!confirm("Delete all jobs?")) return;

    const { error } = await supabase
      .from("jobs")
      .delete()
      .neq("id", 0);

    if (error) {
      alert("Failed to clear jobs");
      return;
    }

    alert("All jobs cleared");

    refreshDashboard();
  }

  async function deleteJob(id: number) {
    if (!confirm("Delete this job?")) return;

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete job");
      return;
    }

    refreshDashboard();
  }

  async function deleteCompany(id: number) {
    if (!confirm("Delete this company career site?")) return;

    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete company");
      return;
    }

    alert("Company deleted");

    refreshDashboard();
  }

  async function runScraper() {
    try {
      alert("Scraper started. Please wait.");

      const response = await fetch(
        "https://vesta-production-f851.up.railway.app/scrape-jobs"
      );

      const result = await response.json();

      alert(`Scraper finished. Jobs found: ${result.jobs_found}`);

      refreshDashboard();

    } catch (error) {
      console.error(error);

      alert("Scraper failed.");
    }
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Vesta Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold">
            Secure Login
          </h1>

          <p className="mt-3 text-slate-300">
            Enter your admin password.
          </p>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
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
      <div className="mx-auto max-w-7xl">

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Vesta Control Center
          </p>

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>
              <h1 className="text-4xl font-bold md:text-6xl">
                Admin Dashboard
              </h1>

              <p className="mt-4 max-w-2xl text-slate-300">
                Manage jobs, companies, scraper controls, and system status.
              </p>
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-800"
            >
              Logout
            </button>

          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                Companies
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {companies.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                Jobs
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {jobs.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                Backend
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-400">
                Online
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-400">
                Scheduler
              </p>

              <h2 className="mt-2 text-2xl font-bold text-green-400">
                Active
              </h2>
            </div>

          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-2xl font-semibold">
              Add Career Site
            </h2>

            <div className="mt-6 flex flex-col gap-4">

              <input
                type="text"
                placeholder="Company name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                placeholder="Career URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />

              <button
                onClick={addCompany}
                disabled={loading}
                className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Company"}
              </button>

            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-2xl font-semibold">
              Scraper Controls
            </h2>

            <div className="mt-6 grid gap-4">

              <button
                onClick={runScraper}
                className="rounded-xl bg-green-500 px-6 py-3 font-semibold hover:bg-green-600"
              >
                Run Job Scraper Now
              </button>

              <button
                onClick={clearJobs}
                className="rounded-xl bg-red-500 px-6 py-3 font-semibold hover:bg-red-600"
              >
                Clear All Jobs
              </button>

              <a
                href="/jobs"
                className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold hover:bg-slate-800"
              >
                View Public Jobs Page
              </a>

            </div>
          </div>

        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-2xl font-semibold">
            Saved Career Sites
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            {companies.map((company) => (
              <div
                key={company.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <p className="text-sm text-blue-400">
                  Career Site
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  {company.company_name}
                </h3>

                <p className="mt-2 break-all text-sm text-slate-400">
                  {company.career_url}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">

                  <a
                    href={company.career_url}
                    target="_blank"
                    className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600"
                  >
                    Open Site
                  </a>

                  <button
                    onClick={() => deleteCompany(company.id)}
                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600"
                  >
                    Delete Company
                  </button>

                </div>
              </div>
            ))}

          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-2xl font-semibold">
            Manage Jobs
          </h2>

          <div className="mt-6 space-y-4">

            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >
                <p className="text-sm text-blue-400">
                  {job.company_name}
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  {job.job_title}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {job.location}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">

                  <a
                    href={job.apply_url}
                    target="_blank"
                    className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600"
                  >
                    View Job
                  </a>

                  <button
                    onClick={() => deleteJob(job.id)}
                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600"
                  >
                    Delete Job
                  </button>

                </div>
              </div>
            ))}

          </div>
        </section>

      </div>
    </main>
  );
}