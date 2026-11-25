"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SendIcon } from "@/components/icons";
import { useChatTheme } from "@/components/chat-theme";

// Add a message unless it's already in the list (it can arrive twice: from our insert AND from Realtime)
function appendUnique(list, msg) {
  return list.some((m) => m.id === msg.id) ? list : [...list, msg];
}

// Format as India time, e.g. "2:01 PM". Done by hand (not toLocaleTimeString)
// so the server and the browser always produce exactly the same text.
function formatTime(iso) {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // India is UTC + 5:30
  const ist = new Date(new Date(iso).getTime() + IST_OFFSET_MS);

  const hours24 = ist.getUTCHours();
  const minutes = String(ist.getUTCMinutes()).padStart(2, "0");
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${minutes} ${period}`;
}

export default function ChatRoom({ matchId, userId, initialMessages, otherName, children }) {
  const [supabase] = useState(() => createClient());
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const { theme } = useChatTheme();

  // Live: receive new messages in this match
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload) => setMessages((prev) => appendUnique(prev, payload.new))
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, matchId]);

  // Scroll to the newest message whenever the list changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;

    setText("");
    setError(null);

    const { data, error } = await supabase
      .from("messages")
      .insert({ match_id: matchId, body })
      .select("id, sender_id, body, created_at")
      .single();

    if (error) {
      setError("Couldn't send. Try again.");
      setText(body); // give the text back so nothing is lost
      return;
    }
    setMessages((prev) => appendUnique(prev, data));
  }

  return (
    // The theme colours go in as CSS variables / inline styles, so switching is instant
    <div
      className="flex min-h-0 flex-1 flex-col transition-[background] duration-300"
      style={{ background: theme.bg, "--chat-muted": theme.muted }}
    >
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-3">{children}</div>

        {messages.length === 0 && (
          <p className="py-4 text-center text-sm" style={{ color: theme.muted }}>
            Say hello to {otherName}. Pick up from what they liked, it&apos;s the easiest opener there is.
          </p>
        )}

        {messages.map((m, i) => {
          const mine = m.sender_id === userId;
          // Group consecutive messages from the same person: less spacing, one time stamp style
          const firstOfGroup = messages[i - 1]?.sender_id !== m.sender_id;
          return (
            <div
              key={m.id}
              className={`max-w-[78%] animate-rise rounded-3xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${firstOfGroup ? "mt-2" : ""} ${
                mine ? "self-end rounded-br-lg" : "self-start rounded-bl-lg border"
              }`}
              style={
                mine
                  ? { background: theme.mine, color: theme.mineText }
                  : { background: theme.theirs, color: theme.theirsText, borderColor: theme.theirsBorder }
              }
            >
              <p className="whitespace-pre-line">{m.body}</p>
              <p className="mt-0.5 text-right text-[10px] opacity-60">
                {formatTime(m.created_at)}
              </p>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {error && <p className="px-4 pb-2 text-sm text-red-500">{error}</p>}

      <form
        onSubmit={send}
        className="flex items-center gap-2 border-t border-black/5 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-4"
        style={{ background: theme.bar }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message ${otherName}…`}
          maxLength={2000}
          className="field rounded-full py-3"
        />
        <button
          aria-label="Send"
          disabled={!text.trim()}
          className="grid size-12 shrink-0 place-items-center rounded-full text-white transition hover:brightness-95 active:scale-95 disabled:opacity-40"
          style={{ background: theme.mine }}
        >
          <SendIcon className="size-5" />
        </button>
      </form>
    </div>
  );
}
