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
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/onboarding");

  const intent = INTENTS.find((i) => i.value === profile.intent)?.label;

  return (
    <>
      <h1 className="text-2xl font-semibold">
        {profile.name}, {getAge(profile.birthdate)}
      </h1>
      <p>
        {profile.city} · {intent}
      </p>
    </>
  );
}