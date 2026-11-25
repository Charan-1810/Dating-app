import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CITIES, INTENTS, PAUSE_AFTER_DAYS, dateYearsAgo, daysAgo } from "@/lib/options";
import Link from "next/link";
import ProfileCard from "@/components/profile-card";
import { CardGridSkeleton, EmptyState, PageHeader } from "@/components/ui";
import { SearchIcon } from "@/components/icons";

const GENDER_FOR = { women: "woman", men: "man" };
const GROUP_FOR = { woman: "women", man: "men" };

export default function BrowsePage({ searchParams }) {
  return (
    <main className="page">
      <PageHeader
        eyebrow="Browse"
        title="People worth reading"
        subtitle="Search what people actually wrote. Everyone here has been active in the last two weeks."
      />
      <Suspense fallback={<CardGridSkeleton />}>
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
      "id, name, birthdate, city, is_verified, personality, last_active_at, photos(path, position), prompt_answers!inner(position, answer)"
    )
    .neq("id", user.id)
    .gte("last_active_at", daysAgo(PAUSE_AFTER_DAYS)) // auto-pause: hide inactive profiles
    .order("last_active_at", { ascending: false })
    .order("position", { referencedTable: "photos" })
    .order("position", { referencedTable: "prompt_answers" })
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

  const hasFilters = Boolean(q || city || intent || minAge || maxAge);

  return (
    <div className="flex flex-col gap-5">
      <form className="card flex flex-col gap-3 p-3 sm:p-4">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search answers: trekking, biryani, startups…"
            className="field pl-12"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[0.8fr_0.8fr_1.2fr_1.5fr_auto]">
          <input name="min_age" type="number" min={18} max={99} defaultValue={minAge ?? ""} placeholder="Min age" className="field" />
          <input name="max_age" type="number" min={18} max={99} defaultValue={maxAge ?? ""} placeholder="Max age" className="field" />
          <select name="city" defaultValue={city} className="field">
            <option value="">Any city</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select name="intent" defaultValue={intent} className="field">
            <option value="">Any intent</option>
            {INTENTS.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
          <button className="btn btn-primary col-span-2 py-3 sm:col-span-1">Search</button>
        </div>
      </form>

      <div className="flex items-center justify-between gap-4 px-1 text-sm text-ink-soft">
        <p>
          <span className="font-medium text-ink">{profiles.length}</span>{" "}
          {profiles.length === 1 ? "person" : "people"}
          {q && <> mentioning &ldquo;{q}&rdquo;</>}
        </p>
        {hasFilters && (
          <Link href="/browse" className="text-sm underline underline-offset-2 hover:text-ink">
            Clear filters
          </Link>
        )}
      </div>

      {profiles.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No one here yet"
          text={`No active profiles match these filters. Try widening them. Profiles inactive for ${PAUSE_AFTER_DAYS}+ days are paused.`}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function clampAge(value) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return null;
  return Math.min(99, Math.max(18, n));
}