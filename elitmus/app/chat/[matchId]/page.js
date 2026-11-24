import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { photoUrl } from "@/lib/photos";
import ChatRoom from "./chat-room";

export default function ChatPage({ params }) {
  return (
    <main className="mx-auto flex h-screen max-w-xl flex-col p-4">
      <Suspense fallback={<p className="text-gray-500">Loading chat...</p>}>
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

  const photo = other.photos?.[0];

  return (
    <>
      <header className="flex items-center gap-3 border-b pb-3">
        <Link href="/likes" className="text-sm underline">← Likes</Link>
        <Link href={`/profile/${other.id}`} className="flex items-center gap-2">
          {photo && (
            <img src={photoUrl(photo.path)} alt="" className="h-9 w-9 rounded-full object-cover" />
          )}
          <span className="font-medium">{other.name}</span>
        </Link>
        <Link href={`/profile/${other.id}#safety`} className="ml-auto text-sm text-gray-500 underline">
          Report / Block
        </Link>
      </header>

      <ChatRoom matchId={matchId} userId={user.id} initialMessages={messages ?? []}>
        {openers.map((like) => (
          <div key={like.from_user} className="mx-auto max-w-xs rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-600">
            {like.from_user === user.id ? "You" : other.name} liked{" "}
            {like.from_user === user.id ? "their" : "your"} {like.target ?? "profile"}
            {like.comment && <p className="mt-1 text-base text-gray-900">&ldquo;{like.comment}&rdquo;</p>}
          </div>
        ))}
      </ChatRoom>
    </>
  );
}