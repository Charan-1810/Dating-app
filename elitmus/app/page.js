import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ProfileView from "@/components/profile-view";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-4">
      <Suspense fallback={<p className="text-gray-500">Loading your profile...</p>}>
        <MyProfile />
      </Suspense>
    </main>
  );
}

async function MyProfile() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*, photos(path, position), prompt_answers(position, prompt_id, answer)")
    .eq("id", user.id)
    .order("position", { referencedTable: "photos" })
    .order("position", { referencedTable: "prompt_answers" })
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile) redirect("/onboarding");
  // Send unfinished accounts to the step they skipped (browse only shows complete profiles)
  if (!profile.personality) redirect("/personality");
  if (profile.prompt_answers.length === 0) redirect("/prompts");

  return (
    <>
      <ProfileView profile={profile} />
      <nav className="flex gap-4 text-sm underline">
        <Link href="/photos">Edit photos</Link>
        <Link href="/personality">Retake questions</Link>
        <Link href="/prompts">Edit prompts</Link>
      </nav>
    </>
  );
}