import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ProfileView from "@/components/profile-view";

export default function ProfilePage({ params }) {
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-4">
      <Link href="/browse" className="self-start text-sm underline">
        ← Back to browse
      </Link>
      <Suspense fallback={<p className="text-gray-500">Loading profile...</p>}>
        <OtherProfile params={params} />
      </Suspense>
    </main>
  );
}

async function OtherProfile({ params }) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*, photos(path, position), prompt_answers(position, prompt_id, answer)")
    .eq("id", id)
    .order("position", { referencedTable: "photos" })
    .order("position", { referencedTable: "prompt_answers" })
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile) notFound();

  return <ProfileView profile={profile} />;
}