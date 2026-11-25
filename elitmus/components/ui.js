// Small shared building blocks used across pages.
// No "use client" and no hooks, so they work in both server and client components.
import Link from "next/link";
import { APP_NAME } from "@/lib/brand";
import { photoUrl } from "@/lib/photos";
import { CheckIcon, VerifiedIcon } from "./icons";

export function Wordmark({ className = "text-2xl" }) {
  return (
    <span className={`font-display font-semibold tracking-tight ${className}`}>
      {APP_NAME.toLowerCase()}
      <span className="text-accent">.</span>
    </span>
  );
}

export function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <header className="mb-6 flex flex-col gap-2 sm:mb-8">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="font-display text-[2rem] leading-[1.1] font-medium tracking-tight text-balance sm:text-[2.5rem]">
        {title}
      </h1>
      {subtitle && <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft text-pretty">{subtitle}</p>}
      {children}
    </header>
  );
}

export function VerifiedBadge() {
  return (
    <span className="chip bg-sky-soft text-sky">
      <VerifiedIcon className="size-4" />
      eLitmus verified
    </span>
  );
}

export function ActiveBadge() {
  return (
    <span className="chip bg-sage-soft text-sage">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-sage opacity-40" />
        <span className="relative inline-flex size-2 rounded-full bg-sage" />
      </span>
      Active this week
    </span>
  );
}

export function Avatar({ path, name, className = "size-10" }) {
  if (path) {
    return <img src={photoUrl(path)} alt="" className={`${className} shrink-0 rounded-full object-cover`} />;
  }
  return (
    <span className={`${className} grid shrink-0 place-items-center rounded-full bg-sand font-display text-ink-soft`}>
      {name?.[0]}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line px-6 py-14 text-center">
      {Icon && (
        <span className="grid size-12 place-items-center rounded-full bg-sand text-ink-soft">
          <Icon className="size-5" />
        </span>
      )}
      <p className="font-display text-xl">{title}</p>
      {text && <p className="max-w-sm text-sm text-ink-soft">{text}</p>}
      {children}
    </div>
  );
}

export function Spinner({ label = "Loading" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted">
      <span className="size-5 animate-spin rounded-full border-2 border-line border-t-ink" />
      {label}…
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-[4/5] animate-pulse bg-sand" />
          <div className="flex flex-col gap-2 p-4">
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-sand" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-sand" />
          </div>
        </div>
      ))}
    </div>
  );
}

// The 4 parts of a profile. Shown at the top of each setup page as a progress guide.
const STEPS = [
  { label: "Basics", href: "/settings" },
  { label: "Photos", href: "/photos" },
  { label: "Personality", href: "/personality" },
  { label: "Prompts", href: "/prompts" },
];

export function Stepper({ current, linked = true }) {
  return (
    <ol className="mb-6 flex items-center gap-2 sm:mb-8">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const dot = (
          <span
            className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition ${
              active ? "bg-ink text-paper" : done ? "bg-accent text-white" : "border border-line bg-surface text-muted"
            }`}
          >
            {done ? <CheckIcon className="size-3.5" /> : i + 1}
          </span>
        );
        const content = (
          <>
            {dot}
            <span className={`text-sm ${active ? "font-medium text-ink" : "hidden text-muted sm:inline"}`}>
              {step.label}
            </span>
          </>
        );
        return (
          <li key={step.label} className="flex flex-1 items-center gap-2 last:flex-none">
            {linked && !active ? (
              <Link href={step.href} className="flex items-center gap-2 hover:opacity-75">
                {content}
              </Link>
            ) : (
              <span className="flex items-center gap-2">{content}</span>
            )}
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line" />}
          </li>
        );
      })}
    </ol>
  );
}
