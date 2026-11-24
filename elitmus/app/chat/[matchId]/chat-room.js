"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

export default function ChatRoom({ matchId, userId, initialMessages, children }) {
  const [supabase] = useState(() => createClient());
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

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
    <>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto py-4">
        {children}

        {messages.map((m) => {
          const mine = m.sender_id === userId;
          return (
            <div
              key={m.id}
              className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                mine ? "self-end bg-black text-white" : "self-start bg-gray-100"
              }`}
            >
              <p className="whitespace-pre-line">{m.body}</p>
              <p className={`mt-0.5 text-[10px] ${mine ? "text-gray-300" : "text-gray-500"}`}>
                {formatTime(m.created_at)}
              </p>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={send} className="flex gap-2 border-t pt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          maxLength={2000}
          className="flex-1 rounded-full border px-4 py-2"
        />
        <button className="rounded-full bg-black px-4 py-2 text-white">Send</button>
      </form>
    </>
  );
}