"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LikeNotifications() {
  const [supabase] = useState(() => createClient());
  const pathname = usePathname();
  const [userId, setUserId] = useState(null);
  const [unseen, setUnseen] = useState(0);
  const [toast, setToast] = useState(null);

  // 1. Who's logged in? Re-checked on every page change (handles login/logout)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, [supabase, pathname]);

  // 2. Count likes received since I last opened /likes
  useEffect(() => {
    if (!userId) return;
    async function loadCount() {
      const { data: me } = await supabase
        .from("profiles")
        .select("likes_seen_at")
        .eq("id", userId)
        .maybeSingle();
      if (!me) return;
      const { count } = await supabase
        .from("likes")
        .select("id", { count: "exact", head: true })
        .eq("to_user", userId)
        .gt("created_at", me.likes_seen_at);
      setUnseen(count ?? 0);
    }
    loadCount();
  }, [supabase, userId, pathname]);

  // 3. Live: listen for new likes sent to me
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`likes:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "likes", filter: `to_user=eq.${userId}` },
        async (payload) => {
          const fromId = payload.new.from_user;
          const [{ data: sender }, { data: myLike }] = await Promise.all([
            supabase.from("profiles").select("name").eq("id", fromId).single(),
            supabase.from("likes").select("id").eq("from_user", userId).eq("to_user", fromId).maybeSingle(),
          ]);
          setToast({
            text: myLike
              ? `🎉 You matched with ${sender?.name}!`
              : `♥ ${sender?.name} liked your ${payload.new.target ?? "profile"}`,
            href: `/profile/${fromId}`,
          });
          if (!myLike) setUnseen((n) => n + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  // 4. Hide the toast after 6 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!userId) return null;

  return (
    <>
      <Link
        href="/likes"
        className="fixed right-4 top-4 z-50 rounded-full border bg-white px-3 py-1 text-sm shadow"
      >
        ♥
        {unseen > 0 && (
          <span className="ml-1 rounded-full bg-red-600 px-1.5 text-xs text-white">{unseen}</span>
        )}
      </Link>

      {toast && (
        <Link
          href={toast.href}
          onClick={() => setToast(null)}
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black px-4 py-3 text-white shadow-lg"
        >
          {toast.text}
        </Link>
      )}
    </>
  );
}