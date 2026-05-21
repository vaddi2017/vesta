"use client";

import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Jobs", href: "/jobs" },
  { name: "Saved", href: "/saved" },
  { name: "Admin", href: "/admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  function goTo(path: string) {
    window.location.href = path;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <button
          onClick={() => goTo("/")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-xl font-bold text-white">
            V
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">Vesta AI</h1>
            <p className="text-xs text-slate-400">Daily Job Platform</p>
          </div>
        </button>

        <nav className="flex flex-wrap items-center gap-3">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => goTo(item.href)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-500 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}