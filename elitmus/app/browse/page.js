import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CITIES, INTENTS, dateYearsAgo } from "@/lib/options";
import ProfileCard from "@/components/profile-card";

const GENDER_FOR = { women: "woman", men: "man" };
const GROUP_FOR = { woman: "women", man: "men" };

export default function BrowsePage({ searchParams }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Browse</h1>
        <div className="flex gap-4">
          <Link href="/likes" className="text-sm underline">Likes</Link>
          <Link href="/" className="text-sm underline">My profile</Link>
        </div>
      </header>
      <Suspense fallback={<p className="text-gray-500">Loading profiles...</p>}>
        <BrowseResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function BrowseResults({ searchParams }) {
  await connection();
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // My own profile: needed for two-way gender matching
  const { data: me } = await supabase
    .from("profiles")
    .select("gender, interested_in")
    .eq("id", user.id)
    .single();

  // Read and clean the filters from the URL
  const minAge = clampAge(params.min_age);
  const maxAge = clampAge(params.max_age);
  const city = CITIES.includes(params.city) ? params.city : "";
  const intent = INTENTS.some((i) => i.value === params.intent) ? params.intent : "";
  const q = (params.q ?? "").trim().slice(0, 50);

  let query = supabase
    .from("profiles")
    .select(
      "id, name, birthdate, city, is_verified, personality, photos(path, position), prompt_answers!inner(answer)"
    )
    .neq("id", user.id)
    .order("last_active_at", { ascending: false })
    .order("position", { referencedTable: "photos" })
    .limit(50);

  // Two-way matching: they fit what I want, and I fit what they want
  if (me.interested_in !== "everyone") {
    query = query.eq("gender", GENDER_FOR[me.interested_in]);
  }
  const myGroup = GROUP_FOR[me.gender];
  query = myGroup
    ? query.in("interested_in", ["everyone", myGroup])
    : query.eq("interested_in", "everyone");

  // Optional filters
  if (city) query = query.eq("city", city);
  if (intent) query = query.eq("intent", intent);
  if (minAge) query = query.lte("birthdate", dateYearsAgo(minAge));
  if (maxAge) query = query.gt("birthdate", dateYearsAgo(maxAge + 1));
  if (q) query = query.ilike("prompt_answers.answer", `%${q}%`);

  const { data: profiles, error } = await query;
  if (error) throw new Error(error.message);

  return (
    <>
      <form className="grid grid-cols-2 gap-2 rounded-lg border p-3 sm:grid-cols-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search answers (e.g. trekking)"
          className="col-span-2 rounded border p-2"
        />
        <input name="min_age" type="number" min={18} max={99} defaultValue={minAge ?? ""} placeholder="Min age" className="rounded border p-2" />
        <input name="max_age" type="number" min={18} max={99} defaultValue={maxAge ?? ""} placeholder="Max age" className="rounded border p-2" />
        <select name="city" defaultValue={city} className="rounded border p-2">
          <option value="">Any city</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select name="intent" defaultValue={intent} className="rounded border p-2">
          <option value="">Any intent</option>
          {INTENTS.map((i) => (
            <option key={i.value} value={i.value}>{i.label}</option>
          ))}
        </select>
        <button className="col-span-2 rounded bg-black p-2 text-white sm:col-span-6">Search</button>
      </form>

      <p className="text-sm text-gray-500">
        {profiles.length} {profiles.length === 1 ? "person" : "people"}
      </p>

      {profiles.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No one matches these filters yet. Try widening them.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      )}
    </>
  );
}

function clampAge(value) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return null;
  return Math.min(99, Math.max(18, n));
}