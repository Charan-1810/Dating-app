import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ProfileView from "@/components/profile-view";
import { LikeBackButton } from "@/components/like-button";
import SafetyMenu from "@/components/safety-menu";
import { describeTarget } from "@/lib/prompts";
import { getPremium } from "@/lib/premium";
import WhyWeMatched from "@/components/why-we-matched";
import { Spinner } from "@/components/ui";
import { ChevronLeftIcon, HeartIcon, MessageIcon, SparklesIcon } from "@/components/icons";

export default function ProfilePage({ params }) {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 pt-4 pb-28 sm:px-6 sm:pt-6 md:pb-16">
      <Link href="/browse" className="btn btn-ghost -ml-3 self-start pl-2">
        <ChevronLeftIcon className="size-4" />
        Browse
      </Link>
      <Suspense fallback={<Spinner label="Loading profile" />}>
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
    { data: me },
    premium,
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
    supabase
      .from("matches")
      .select("id")
      .or(`user_a.eq.${id},user_b.eq.${id}`)
      .maybeSingle(),
    supabase.from("profiles").select("personality").eq("id", user.id).maybeSingle(),
    getPremium(supabase, user.id),
  ]);

  if (error) throw new Error(error.message);
  if (!profile) notFound();

  const isMe = user.id === id;
  const likesLeft = 5 - (sentToday ?? 0);
  const canLike = !isMe && !myLike && !theirLike && likesLeft > 0;

  return (
    <>
      {match && (
        <div className="relative animate-rise overflow-hidden rounded-3xl bg-linear-to-br from-accent to-[#f0905f] p-6 text-white shadow-lift">
          <SparklesIcon className="absolute -top-2 -right-2 size-24 opacity-15" />
          <p className="font-display text-3xl font-medium">It&apos;s a match!</p>
          <p className="mt-1 text-white/85">You and {profile.name} liked each other.</p>
          <Link href={`/chat/${match.id}`} className="btn mt-4 bg-white text-accent-dark hover:bg-white/90">
            <MessageIcon className="size-4" />
            Send a message
          </Link>
        </div>
      )}
      {myLike && !theirLike && !match && (
        <div className="card flex items-center gap-3 p-4 text-sm text-ink-soft">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <HeartIcon className="size-4" strokeWidth={2.2} />
          </span>
          You liked {profile.name}. If they like you back, it&apos;s a match.
        </div>
      )}
      {theirLike && !myLike && (
        <div className="card animate-rise border-accent/30 p-5">
          <p className="text-sm text-ink-soft">
            <span className="font-medium text-ink">{profile.name}</span> liked {describeTarget(theirLike.target)}
          </p>
          {theirLike.comment && (
            <p className="mt-3 rounded-2xl rounded-tl-md bg-accent-soft px-4 py-3 font-display text-xl leading-snug">
              &ldquo;{theirLike.comment}&rdquo;
            </p>
          )}
          <div className="mt-4">
            <LikeBackButton toUserId={id} />
          </div>
        </div>
      )}
      {!isMe && !myLike && !theirLike && <LikesLeft left={likesLeft} />}
      {!isMe && (
        <WhyWeMatched name={profile.name} mine={me?.personality} theirs={profile.personality} premium={premium.active} />
      )}
      <ProfileView profile={profile} likeTo={canLike ? id : null} />
      {!isMe && <SafetyMenu userId={id} name={profile.name} />}
    </>
  );
}

// "●●●○○ 3 likes left today": makes the daily limit feel deliberate, not punishing
function LikesLeft({ left }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-sand/70 px-4 py-3 text-sm text-ink-soft">
      <span className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <HeartIcon
            key={i}
            className={`size-4 ${i < left ? "fill-accent text-accent" : "text-line"}`}
            strokeWidth={2}
          />
        ))}
      </span>
      {left > 0 ? (
        <span>
          <span className="font-medium text-ink">{left} left today.</span> Tap a heart on what you like and say why.
        </span>
      ) : (
        <span>You&apos;ve used all 5 likes today. Come back tomorrow.</span>
      )}
    </div>
  );
}
