import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAge } from "@/lib/options";
import { mainPhoto } from "@/lib/photos";
import { describeTarget } from "@/lib/prompts";
import { Avatar, EmptyState, PageHeader, Spinner } from "@/components/ui";
import { ChevronRightIcon, CompassIcon, HeartIcon, VerifiedIcon } from "@/components/icons";

const CARD_FIELDS =
  "id, name, birthdate, city, is_verified, personality, last_active_at, photos(path, position)";

export default function LikesPage() {
  return (
    <main className="page">
      <PageHeader eyebrow="Likes" title="Who's into you" subtitle="Every like here came with a note. Like someone back to match and start talking." />
      <Suspense fallback={<Spinner label="Loading likes" />}>
        <LikesContent />
      </Suspense>
    </main>
  );
}

async function LikesContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: received }, { data: matches }] = await Promise.all([
    supabase
      .from("likes")
      .select(`target, comment, created_at, sender:profiles!likes_from_user_fkey(${CARD_FIELDS})`)
      .eq("to_user", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("matches").select("id, user_a, user_b").order("created_at", { ascending: false }),
  ]);

  const matchedIds = matches.map((m) => (m.user_a === user.id ? m.user_b : m.user_a));
  const matchIdFor = Object.fromEntries(
    matches.map((m) => [m.user_a === user.id ? m.user_b : m.user_a, m.id])
  );
  const waiting = received.filter((like) => !matchedIds.includes(like.sender.id));

  const { data: matchedProfiles } = await supabase
    .from("profiles")
    .select(CARD_FIELDS)
    .in("id", matchedIds);

  // Opening this page counts as "seen": reset the unread badge
  await supabase
    .from("profiles")
    .update({ likes_seen_at: new Date().toISOString() })
    .eq("id", user.id);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 font-display text-2xl">
          Matches
          <span className="chip bg-sand px-2.5 py-0.5 font-sans text-xs text-ink-soft">{matchedProfiles.length}</span>
        </h2>
        {matchedProfiles.length === 0 ? (
          <p className="text-sm text-ink-soft">No matches yet. When you and someone like each other, they&apos;ll appear here.</p>
        ) : (
          <div className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {matchedProfiles.map((p) => (
              <Link key={p.id} href={`/chat/${matchIdFor[p.id]}`} className="group flex w-20 shrink-0 flex-col items-center gap-2">
                <span className="rounded-full bg-linear-to-br from-accent to-[#f2a65a] p-[3px] transition group-hover:scale-105">
                  <span className="block rounded-full bg-paper p-[2px]">
                    <Avatar path={mainPhoto(p.photos)?.path} name={p.name} className="size-[68px] text-2xl" />
                  </span>
                </span>
                <span className="w-full truncate text-center text-sm font-medium">{p.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 font-display text-2xl">
          Liked you
          <span className="chip bg-accent-soft px-2.5 py-0.5 font-sans text-xs text-accent-dark">{waiting.length}</span>
        </h2>
        {waiting.length === 0 ? (
          <EmptyState icon={HeartIcon} title="No new likes yet" text="Thoughtful profiles get thoughtful likes. Add detail to your prompts, or go find someone worth liking.">
            <Link href="/browse" className="btn btn-primary mt-2">
              <CompassIcon className="size-4" />
              Browse people
            </Link>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {waiting.map((like) => (
              <Link
                key={like.sender.id}
                href={`/profile/${like.sender.id}`}
                className="card group flex min-w-0 animate-rise gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Avatar path={mainPhoto(like.sender.photos)?.path} name={like.sender.name} className="size-16 rounded-2xl! text-2xl" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="flex items-center gap-1.5">
                    <span className="font-display text-xl">{like.sender.name}</span>
                    <span className="text-ink-soft">{getAge(like.sender.birthdate)}</span>
                    {like.sender.is_verified && <VerifiedIcon className="size-4" />}
                    <ChevronRightIcon className="ml-auto size-4 text-muted transition group-hover:translate-x-0.5" />
                  </p>
                  <p className="truncate text-xs text-muted">Liked {describeTarget(like.target)}</p>
                  <p className="mt-1.5 rounded-2xl rounded-tl-md bg-accent-soft px-3.5 py-2.5 font-display text-[15px] leading-snug">
                    &ldquo;{like.comment}&rdquo;
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
