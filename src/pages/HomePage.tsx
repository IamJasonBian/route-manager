import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, LineChart, Plane, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 lg:space-y-24">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-950/60 px-6 py-14 shadow-2xl shadow-cyan-950/20 sm:px-10 sm:py-20 lg:px-16">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-400/5 blur-3xl"
          aria-hidden
        />

        <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/90">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Route intelligence
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
          See the window before you commit.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          Compare corridors, watch price pressure, and plan trips with context — not just a list of fares.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Open trip canvas
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Search flights
          </Link>
        </div>
      </section>

      <section aria-labelledby="flows-heading">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="flows-heading" className="text-xl font-semibold text-white">
              Three ways in
            </h2>
            <p className="mt-1 text-sm text-slate-500">Pick a flow — same data, different intent.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <FeatureCard
            to="/plan"
            title="Plan"
            description="Timeline, price ribbon, and booking pressure in one calm surface."
            icon={<Compass className="h-6 w-6" />}
            accent="from-cyan-500/20 to-transparent"
          />
          <FeatureCard
            to="/search"
            title="Search"
            description="Shop live offers with airports, dates, and trip type in a focused layout."
            icon={<Plane className="h-6 w-6" />}
            accent="from-violet-500/15 to-transparent"
          />
          <FeatureCard
            to="/trends"
            title="Trends"
            description="History and bands so you know if today’s fare is noise or signal."
            icon={<LineChart className="h-6 w-6" />}
            accent="from-amber-500/15 to-transparent"
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  to,
  icon,
  accent,
  className = '',
}: {
  title: string;
  description: string;
  to: string;
  icon: ReactNode;
  accent: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-6 transition duration-300 hover:border-cyan-500/30 hover:bg-slate-900/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition group-hover:opacity-100 ${accent}`}
        aria-hidden
      />
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-cyan-300 ring-1 ring-white/10 transition group-hover:text-cyan-200">
        {icon}
      </div>
      <h3 className="relative mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
      <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-cyan-400/80 group-hover:text-cyan-300">
        Continue
        <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
