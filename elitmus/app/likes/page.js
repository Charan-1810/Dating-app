import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ProfileCard from "@/components/profile-card";

const CARD_FIELDS =
  "id, name, birthdate, city, is_verified, personality, last_active_at, photos(path, position)";

export default function LikesPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-4">
      <h1 className="text-2xl font-semibold">Likes</h1>
      <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
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
    <>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Matches ({matchedProfiles.length})</h2>
        {matchedProfiles.length === 0 ? (
          <p className="text-sm text-gray-500">No matches yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {matchedProfiles.map((p) => (
              <div key={p.id} className="flex flex-col gap-2">
                <ProfileCard profile={p} />
                <Link
                  href={`/chat/${matchIdFor[p.id]}`}
                  className="rounded bg-black p-2 text-center text-sm text-white"
                >
                  Message
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Liked you ({waiting.length})</h2>
        {waiting.length === 0 ? (
          <p className="text-sm text-gray-500">No new likes yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {waiting.map((like) => (
              <div key={like.sender.id} className="flex flex-col gap-2">
                <ProfileCard profile={like.sender} />
                <p className="text-xs text-gray-500">On: {like.target ?? "your profile"}</p>
                <p className="text-sm">&ldquo;{like.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}