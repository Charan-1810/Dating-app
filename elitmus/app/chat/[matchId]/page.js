import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mainPhoto } from "@/lib/photos";
import { describeTarget } from "@/lib/prompts";
import { Avatar, Spinner } from "@/components/ui";
import { ChevronLeftIcon, HeartIcon, ShieldIcon } from "@/components/icons";
import ChatRoom from "./chat-room";
import ChatThemePicker from "@/components/chat-theme-picker";

export default function ChatPage({ params }) {
  return (
    // Full height minus the 3.5rem top bar, so only the messages scroll
    <main className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col">
      <Suspense fallback={<Spinner label="Loading chat" />}>
        <ChatLoader params={params} />
      </Suspense>
    </main>
  );
}

async function ChatLoader({ params }) {
  await connection();
  const { matchId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS only returns this match if I'm in it, so anyone else gets a 404
  const { data: match } = await supabase
    .from("matches")
    .select("id, user_a, user_b")
    .eq("id", matchId)
    .maybeSingle();
  if (!match) notFound();

  const otherId = match.user_a === user.id ? match.user_b : match.user_a;

  const [{ data: other }, { data: openers }, { data: messages }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, name, photos(path, position)")
      .eq("id", otherId)
      .order("position", { referencedTable: "photos" })
      .single(),
    supabase
      .from("likes")
      .select("from_user, target, comment")
      .in("from_user", [user.id, otherId])
      .in("to_user", [user.id, otherId])
      .order("created_at"),
    supabase
      .from("messages")
      .select("id, sender_id, body, created_at")
      .eq("match_id", matchId)
      .order("created_at"),
  ]);

  const photo = mainPhoto(other.photos);

  return (
    <>
      <header className="relative z-10 flex items-center gap-2 border-b border-line bg-paper px-2 py-2.5 sm:px-4">
        <Link href="/likes" aria-label="Back to likes" className="btn btn-ghost size-10 p-0">
          <ChevronLeftIcon className="size-5" />
        </Link>
        <Link href={`/profile/${other.id}`} className="flex min-w-0 items-center gap-3 rounded-full py-1 pr-3 hover:bg-sand">
          <Avatar path={photo?.path} name={other.name} className="size-10 text-lg" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-lg">{other.name}</span>
            <span className="text-xs text-muted">View profile</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center">
          <ChatThemePicker matchId={matchId} />
          <Link href={`/profile/${other.id}#safety`} className="btn btn-ghost px-3 text-muted" title="Report or block">
            <ShieldIcon className="size-4" />
            <span className="hidden sm:inline">Safety</span>
          </Link>
        </div>
      </header>

      <ChatRoom matchId={matchId} userId={user.id} initialMessages={messages ?? []} otherName={other.name}>
        <p className="eyebrow text-center text-(--chat-muted)">How it started</p>
        {openers.map((like) => (
          <div key={like.from_user} className="card mx-auto flex w-full max-w-sm flex-col items-center gap-2 p-4 text-center">
            <span className="flex items-center gap-1.5 text-xs text-ink-soft">
              <HeartIcon className="size-3.5 fill-accent text-accent" />
              {like.from_user === user.id ? "You" : other.name} liked{" "}
              {describeTarget(like.target, like.from_user === user.id ? "their" : "your")}
            </span>
            {like.comment && <p className="font-display text-lg leading-snug">&ldquo;{like.comment}&rdquo;</p>}
          </div>
        ))}
      </ChatRoom>
    </>
  );
}
