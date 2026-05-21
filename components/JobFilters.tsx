"use client";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

const quickFilters = [
  "AI",
  "Machine Learning",
  "React",
  "Java",
  "Cloud",
  "Remote",
];

export default function JobFilters({ search, setSearch }: Props) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white">
        Search Jobs
      </h2>

      <div className="mt-5 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search AI, React, Java, Remote..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <button
          onClick={() => setSearch("")}
          className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {quickFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSearch(filter)}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-blue-500 hover:text-white"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}