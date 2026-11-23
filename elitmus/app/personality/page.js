import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PersonalityForm from "./personality-form";

export default function PersonalityPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">How do you handle…</h1>
      <p className="text-sm text-gray-500">
        {"No right answers. Pick what you'd actually do — it builds your trait summary."}
      </p>
      <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
        <PersonalityLoader />
      </Suspense>
    </main>
  );
}

async function PersonalityLoader() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("personality")
    .eq("id", user.id)
    .maybeSingle();

  return <PersonalityForm saved={profile?.personality ?? {}} />;
}