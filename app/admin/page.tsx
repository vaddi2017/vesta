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
};

export default function AdminPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchCompanies() {
    const { data } = await supabase
      .from("companies")
      .select("*")
      .order("id", { ascending: false });

    if (data) setCompanies(data);
  }

  async function fetchJobs() {
    const { data } = await supabase.from("jobs").select("id");

    if (data) setJobs(data);
  }

  async function refreshDashboard() {
    fetchCompanies();
    fetchJobs();
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
    if (!confirm("Are you sure you want to delete all jobs?")) return;

    const { error } = await supabase.from("jobs").delete().neq("id", 0);

    if (error) {
      alert("Failed to clear jobs");
      return;
    }

    alert("All jobs cleared");
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
      alert("Scraper failed. Railway backend may be offline.");
    }
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Vesta Admin Dashboard</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total Companies</p>
            <h2 className="mt-2 text-4xl font-bold">{companies.length}</h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total Jobs</p>
            <h2 className="mt-2 text-4xl font-bold">{jobs.length}</h2>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Vesta System Status</h2>

          <div className="mt-4 space-y-2 text-slate-300">
            <p>
              Backend Status:
              <span className="ml-2 font-semibold text-green-400">
                Running
              </span>
            </p>

            <p>
              Scheduler:
              <span className="ml-2 font-semibold text-green-400">
                Active Daily at 10:00 AM CST
              </span>
            </p>

            <p>
              Frontend:
              <span className="ml-2 font-semibold text-green-400">
                Online
              </span>
            </p>

            <p>
              Database:
              <span className="ml-2 font-semibold text-green-400">
                Connected
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
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
          <h2 className="text-2xl font-semibold">Add Career Site</h2>

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
          <h2 className="text-2xl font-semibold">Saved Career Sites</h2>

          <div className="mt-6 space-y-4">
            {companies.length === 0 && (
              <p className="text-slate-400">No companies added yet.</p>
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
      </div>
    </main>
  );
}