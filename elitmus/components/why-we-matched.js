import Link from "next/link";
import { compareTraits } from "@/lib/questions";
import { SparklesIcon } from "./icons";

// Premium: compares my quiz answers with theirs. Free users see a locked teaser.
export default function WhyWeMatched({ name, mine, theirs, premium }) {
  const { shared, different, sameAnswers } = compareTraits(mine, theirs);
  if (shared.length + different.length + sameAnswers.length === 0) return null;

  if (!premium) {
    return (
      <Link href="/premium" className="card group flex items-center gap-4 p-4 transition hover:shadow-lift">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-accent to-[#f2a65a] text-white">
          <SparklesIcon className="size-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-medium">
            {shared.length > 0
              ? `You and ${name} share ${shared.length} ${shared.length === 1 ? "trait" : "traits"}`
              : `See how you and ${name} compare`}
          </span>
          <span className="text-sm text-ink-soft">See which ones, and why you might click · Premium</span>
        </span>
        <span className="chip shrink-0 bg-ink px-3 text-xs text-paper transition group-hover:bg-accent">Unlock</span>
      </Link>
    );
  }

  return (
    <section className="card animate-rise overflow-hidden">
      <div className="flex items-center gap-2 bg-linear-to-r from-accent-soft to-surface px-5 py-3">
        <SparklesIcon className="size-4 text-accent" />
        <p className="eyebrow text-accent-dark">Why you might click</p>
      </div>
      <div className="flex flex-col gap-4 p-5">
        {shared.length > 0 && (
          <div>
            <p className="text-sm text-ink-soft">You&apos;re both</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {shared.map((t) => (
                <span key={t} className="chip bg-accent-soft text-accent-dark">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
        {different.length > 0 && (
          <div>
            <p className="text-sm text-ink-soft">Where you differ (often a good balance)</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm">
              {different.map((d) => (
                <li key={d.mine} className="flex flex-wrap items-center gap-x-2">
                  <span className="font-medium">You: {d.mine}</span>
                  <span className="text-muted">·</span>
                  <span className="text-ink-soft">
                    {name}: {d.theirs}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {sameAnswers.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink-soft">You gave the same answer to</p>
            {sameAnswers.map((s) => (
              <div key={s.question} className="rounded-2xl bg-paper px-4 py-3">
                <p className="text-xs text-muted">{s.question}</p>
                <p className="mt-1 font-display text-lg leading-snug">{s.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
