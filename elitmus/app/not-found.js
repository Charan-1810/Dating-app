import Link from "next/link";
import { CompassIcon } from "@/components/icons";

// Shown for unknown URLs, and when a page calls notFound() (e.g. a blocked or deleted profile)
export default function NotFound() {
  return (
    <main className="page-narrow flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <p className="font-display text-8xl text-accent">404</p>
      <h1 className="font-display text-3xl">Nothing to see here</h1>
      <p className="max-w-sm text-ink-soft">
        This page doesn&apos;t exist, or the profile is no longer available.
      </p>
      <Link href="/browse" className="btn btn-primary mt-2">
        <CompassIcon className="size-4" />
        Back to browsing
      </Link>
    </main>
  );
}
