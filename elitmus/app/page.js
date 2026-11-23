import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./login/actions";
import { getAge, INTENTS } from "@/lib/options";
import { connection } from "next/server";

// Static shell: the same for everyone, shown instantly
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-4">
      <Suspense fallback={<p className="text-gray-500">Loading your profile...</p>}>
        <ProfileCard />
      </Suspense>
      <form action={logout} className="mt-4">
        <button className="rounded border px-4 py-2">Log out</button>
      </form>
    </main>
  );
}

// Dynamic part: runs per request (cookies, database, current date)
async function ProfileCard() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
  .from("profiles")
  .select("*, photos(path, position)")
  .eq("id", user.id)
  .order("position", { referencedTable: "photos" })
  .maybeSingle();

  if (!profile) redirect("/onboarding");

  const intent = INTENTS.find((i) => i.value === profile.intent)?.label;

    return (
    <>
      <div className="grid w-full max-w-md grid-cols-3 gap-2">
        {profile.photos.map((p) => (
          <img
            key={p.position}
            src={supabase.storage.from("photos").getPublicUrl(p.path).data.publicUrl}
            alt=""
            className="aspect-[3/4] w-full rounded-lg object-cover"
          />
        ))}
      </div>
      <h1 className="text-2xl font-semibold">
        {profile.name}, {getAge(profile.birthdate)}
      </h1>
      <p>
        {profile.city} · {intent}
      </p>
      <a href="/photos" className="text-sm underline">
        Edit photos
      </a>
    </>
  );
}