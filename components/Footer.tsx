import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Vesta AI
          </h2>

          <p className="mt-2 max-w-md text-sm text-slate-400">
            AI-powered daily job discovery platform for Software Engineers,
            AI/ML Engineers, Cloud Engineers, and Full Stack Developers.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">

          <Link
            href="/"
            className="text-slate-400 hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/jobs"
            className="text-slate-400 hover:text-white"
          >
            Jobs
          </Link>

          <Link
            href="/saved"
            className="text-slate-400 hover:text-white"
          >
            Saved Jobs
          </Link>

          <Link
            href="/admin"
            className="text-slate-400 hover:text-white"
          >
            Admin
          </Link>

        </div>

      </div>

      <div className="border-t border-slate-800 px-6 py-4 text-center text-sm text-slate-500">
        © 2026 Vesta AI. All rights reserved.
      </div>
    </footer>
  );
}