"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { describeTarget } from "@/lib/prompts";
import { HeartIcon, MessageIcon, SparklesIcon, XIcon } from "./icons";

// A custom hook: all the live-notification logic in one reusable function.
// The nav bar calls it and gets back { userId, unseen, toast, dismissToast }.
export function useLiveNotifications(pathname) {
  const [supabase] = useState(() => createClient());
  const [userId, setUserId] = useState(null);
  const [unseen, setUnseen] = useState(0);
  const [toast, setToast] = useState(null);

  // Always holds the CURRENT page, so the live listener (created once) can read it
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // 1. Who's logged in? Re-checked on every page change (handles login/logout)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const id = data.user?.id ?? null;
      setUserId(id);
      // Record activity for auto-pause. The database only writes if it's been 5+ minutes.
      // .then() is needed: Supabase queries don't run until you await or .then() them.
      if (id) supabase.rpc("touch_last_active").then(() => {});
    });
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

  // 3. Live: listen for new likes sent to me, and new messages in my chats
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`notify:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "likes", filter: `to_user=eq.${userId}` },
        async (payload) => {
          const fromId = payload.new.from_user;
          const [{ data: sender }, { data: myLike }] = await Promise.all([
            supabase.from("profiles").select("name").eq("id", fromId).single(),
            supabase.from("likes").select("id").eq("from_user", userId).eq("to_user", fromId).maybeSingle(),
          ]);
          setToast(
            myLike
              ? { kind: "match", title: `It's a match with ${sender?.name}!`, text: "Say hello while it's fresh.", href: `/profile/${fromId}` }
              : { kind: "like", title: `${sender?.name} liked ${describeTarget(payload.new.target)}`, text: payload.new.comment, href: `/profile/${fromId}` }
          );
          if (!myLike) setUnseen((n) => n + 1);
        }
      )
      .on(
        "postgres_changes",
        // No filter needed: RLS only delivers messages from chats I'm part of
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const msg = payload.new;
          if (msg.sender_id === userId) return; // my own message
          if (pathnameRef.current === `/chat/${msg.match_id}`) return; // already looking at this chat

          const { data: sender } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", msg.sender_id)
            .single();

          setToast({ kind: "message", title: sender?.name, text: msg.body, href: `/chat/${msg.match_id}` });
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

  return { userId, unseen, toast, dismissToast: () => setToast(null) };
}

const TOAST_ICONS = { like: HeartIcon, match: SparklesIcon, message: MessageIcon };

export function NotificationToast({ toast, onDismiss }) {
  const Icon = TOAST_ICONS[toast.kind];
  return (
    <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-6">
      <div className="card flex w-full max-w-sm animate-rise items-center gap-3 p-3 pr-2 shadow-lift">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-full ${
            toast.kind === "match" ? "bg-accent text-white" : "bg-accent-soft text-accent"
          }`}
        >
          <Icon className="size-5" />
        </span>
        <Link href={toast.href} onClick={onDismiss} className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{toast.title}</p>
          {toast.text && <p className="truncate text-sm text-ink-soft">{toast.text}</p>}
        </Link>
        <button onClick={onDismiss} aria-label="Dismiss" className="btn btn-ghost size-9 p-0">
          <XIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
