import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ProfileView from "@/components/profile-view";
import { LikeBackButton } from "@/components/like-button";
import SafetyMenu from "@/components/safety-menu";

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: profile, error },
    { data: myLike },
    { data: theirLike },
    { data: sentToday },
    { data: match },  
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, photos(path, position), prompt_answers(position, prompt_id, answer)")
      .eq("id", id)
      .order("position", { referencedTable: "photos" })
      .order("position", { referencedTable: "prompt_answers" })
      .maybeSingle(),
    supabase.from("likes").select("id").eq("from_user", user.id).eq("to_user", id).maybeSingle(),
    supabase.from("likes").select("target, comment").eq("from_user", id).eq("to_user", user.id).maybeSingle(),
    supabase.rpc("likes_sent_today"),
    supabase                  // NEW
      .from("matches")
      .select("id")
      .or(`user_a.eq.${id},user_b.eq.${id}`)
      .maybeSingle(),
  ]);

  if (error) throw new Error(error.message);
  if (!profile) notFound();

  const isMe = user.id === id;
  const likesLeft = 5 - (sentToday ?? 0);
  const canLike = !isMe && !myLike && !theirLike && likesLeft > 0;

  return (
    <>
      {match && (
        <Banner>
          🎉 You and {profile.name} matched!{" "}
          <Link href={`/chat/${match.id}`} className="font-medium underline">
            Send a message →
          </Link>
        </Banner>
      )}
      {myLike && !theirLike && (
        <Banner>You liked {profile.name}. If they like you back, it&apos;s a match.</Banner>
      )}
      {theirLike && !myLike && (
        <Banner>
          <p className="text-sm text-gray-500">
            {profile.name} liked your {theirLike.target ?? "profile"}
          </p>
          {theirLike.comment && <p className="my-1 text-lg">&ldquo;{theirLike.comment}&rdquo;</p>}
          <LikeBackButton toUserId={id} />
        </Banner>
      )}
      {!isMe && !myLike && !theirLike && (
        <p className="text-sm text-gray-500">
          {likesLeft > 0
            ? `${likesLeft} of 5 likes left today. Like something specific and say why.`
            : "You've used all 5 likes today. Come back tomorrow."}
        </p>
      )}
      <ProfileView profile={profile} likeTo={canLike ? id : null} />
      {!isMe && <SafetyMenu userId={id} name={profile.name} />}
    </>
  );
}

function Banner({ children }) {
  return <div className="w-full max-w-md rounded-lg border bg-gray-50 p-4">{children}</div>;

}