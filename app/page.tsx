import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-10 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
              Vesta AI
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
              AI Powered Daily Job Discovery Platform
            </h1>

            <p className="mt-6 max-w-3xl text-lg text-slate-300">
              Vesta automatically scans company career portals and brings fresh
              AI, ML, Full Stack, Cloud, and Software Engineering jobs into one
              clean daily feed.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/jobs"
                className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600"
              >
                Browse Jobs
              </Link>

              <Link
                href="/saved"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
              >
                View Saved Jobs
              </Link>
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">Daily Fresh Jobs</h2>

              <p className="mt-3 text-slate-400">
                Automatically collects fresh roles from company career sites.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">Smart Filters</h2>

              <p className="mt-3 text-slate-400">
                Search for AI, ML, React, Java, Cloud, Remote, and more.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold">Saved Jobs</h2>

              <p className="mt-3 text-slate-400">
                Save interesting jobs and return to them anytime.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}