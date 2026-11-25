"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { themeById } from "@/lib/chat-themes";

// One theme per match, shared by both people.
// The provider wraps the chat header (picker) and the messages, so both read the same theme.
const ChatThemeContext = createContext(null);

export function ChatThemeProvider({ matchId, initialTheme, children }) {
  const [supabase] = useState(() => createClient());
  const [themeId, setThemeId] = useState(initialTheme);
  const [error, setError] = useState(null);

  // Live: when the other person changes the theme, switch too
  useEffect(() => {
    const channel = supabase
      .channel(`match-theme:${matchId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "matches", filter: `id=eq.${matchId}` },
        (payload) => {
          if (payload.new.chat_theme) setThemeId(payload.new.chat_theme);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, matchId]);

  async function changeTheme(newId) {
    const previous = themeId;
    setThemeId(newId); // optimistic: switch instantly, undo if the save fails
    setError(null);
    const { error } = await supabase.rpc("set_chat_theme", { p_match_id: matchId, p_theme: newId });
    if (error) {
      setThemeId(previous);
      setError("Couldn't change the theme. Try again.");
      setTimeout(() => setError(null), 4000); // hide the message after 4 seconds
    }
  }

  return (
    <ChatThemeContext.Provider value={{ theme: themeById(themeId), changeTheme, error }}>
      {children}
    </ChatThemeContext.Provider>
  );
}

export function useChatTheme() {
  return useContext(ChatThemeContext);
}
