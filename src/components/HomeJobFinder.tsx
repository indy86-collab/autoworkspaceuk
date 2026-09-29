"use client";

import { ArrowUpRight, Check, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Category = { slug: string; name: string; icon: string; explanation: string };

const jobs = [
  { id: "lift", label: "Get under it", hint: "Brakes, exhausts, suspension", categories: ["rent-a-ramp", "vehicle-lift-hire", "self-service-garage"] },
  { id: "space", label: "Bring my own car", hint: "A bay, tools and time to work", categories: ["self-service-garage", "garage-bay-hire", "rent-a-ramp"] },
  { id: "paint", label: "Make it shine", hint: "Paint, prep or detail", categories: ["spray-booth-hire", "detailing-bay-hire"] },
  { id: "trade", label: "Run the job", hint: "Trade-ready workshop space", categories: ["automotive-workshop-hire", "hgv-workshop-hire"] },
] as const;

export function HomeJobFinder({ categories }: { categories: readonly Category[] }) {
  const [selected, setSelected] = useState<string>(jobs[0].id);
  const job = jobs.find((item) => item.id === selected) ?? jobs[0];
  const matches = useMemo(() => categories.filter((category) => (job.categories as readonly string[]).includes(category.slug)), [categories, job]);

  return (
    <section className="site-wrap relative z-10 -mt-16 pb-8 sm:-mt-20">
      <div className="overflow-hidden rounded-[1.5rem] border border-[#dedbd4] bg-paper shadow-[0_24px_70px_rgb(24_33_31/0.16)]">
        <div className="grid lg:grid-cols-[.8fr_1.2fr]">
          <div className="bg-[#f0e8de] p-6 sm:p-9">
            <div className="flex items-center gap-2 text-accent"><Sparkles className="h-4 w-4" /><span className="eyebrow">Start with the job</span></div>
            <h2 className="mt-4 max-w-sm font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">What are you here to do?</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-ink/65">Tell us the job. We’ll surface the kinds of space that make sense.</p>
            <div className="mt-7 grid gap-2">
              {jobs.map((item) => (
                <button key={item.id} type="button" onClick={() => setSelected(item.id)} className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${selected === item.id ? "border-ink bg-ink text-white" : "border-ink/10 bg-white/55 text-ink hover:border-accent"}`}>
                  <span><span className="block font-display font-bold">{item.label}</span><span className={`mt-0.5 block text-xs ${selected === item.id ? "text-white/65" : "text-ink/55"}`}>{item.hint}</span></span>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${selected === item.id ? "bg-accent" : "bg-ink/5"}`}>{selected === item.id ? <Check className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 sm:p-9">
            <div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-accent">Good places to start</p><h3 className="mt-2 font-display text-2xl font-bold text-ink">{job.label}</h3></div><span className="rounded-full bg-[#f0e8de] px-3 py-1.5 text-xs font-bold text-ink/65">{matches.length} paths</span></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {matches.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} className="group rounded-2xl border border-[#dedbd4] bg-white p-4 transition hover:-translate-y-1 hover:border-accent hover:shadow-lg"><span className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f6dfd1] text-accent font-display font-bold">{category.icon.slice(0, 1).toUpperCase()}</span><ArrowUpRight className="h-4 w-4 text-ink/35 transition group-hover:text-accent" /></span><span className="mt-5 block font-display font-bold text-ink">{category.name}</span><span className="mt-1 block text-sm leading-5 text-ink/55">{category.explanation}</span></Link>)}
            </div>
            <Link href="/browse" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-ink"><MapPin className="h-4 w-4" /> Browse every workspace <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
