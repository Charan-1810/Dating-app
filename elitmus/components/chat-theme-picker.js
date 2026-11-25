"use client";

import { useState } from "react";
import { CHAT_THEMES } from "@/lib/chat-themes";
import { useChatTheme } from "./chat-theme";
import { CheckIcon, PaletteIcon } from "./icons";

// Palette button in the chat header; opens a small grid of theme swatches.
export default function ChatThemePicker() {
  const [open, setOpen] = useState(false);
  const { theme: current, changeTheme, error } = useChatTheme();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        title="Chat theme"
        className="btn btn-ghost px-3 text-muted"
      >
        <PaletteIcon className="size-4" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {error && !open && (
        <p className="absolute top-full right-0 z-50 mt-2 w-56 rounded-2xl bg-red-50 px-3 py-2 text-xs text-red-700 shadow-card">
          {error}
        </p>
      )}

      {open && (
        <>
          {/* Invisible full-screen layer: tapping anywhere outside closes the menu */}
          <button type="button" aria-label="Close" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="card absolute top-full right-0 z-50 mt-2 w-64 animate-rise p-3">
            <p className="eyebrow px-1 pb-2">Chat theme</p>
            <div className="grid grid-cols-3 gap-2">
              {CHAT_THEMES.map((t) => {
                const active = t.id === current.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      changeTheme(t.id);
                      setOpen(false);
                    }}
                    className="flex flex-col items-center gap-1.5 rounded-2xl p-1.5 text-xs transition hover:bg-sand"
                  >
                    {/* Mini preview: the background with one bubble from each side */}
                    <span
                      className={`relative flex h-14 w-full flex-col justify-center gap-1 overflow-hidden rounded-xl px-1.5 ring-2 ${
                        active ? "ring-accent" : "ring-line"
                      }`}
                      style={{ background: t.bg }}
                    >
                      <span
                        className="h-2.5 w-8 rounded-full"
                        style={{ background: t.theirs, border: `1px solid ${t.theirsBorder}` }}
                      />
                      <span className="h-2.5 w-8 self-end rounded-full" style={{ background: t.mine }} />
                      {active && (
                        <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-accent text-white">
                          <CheckIcon className="size-3" strokeWidth={3} />
                        </span>
                      )}
                    </span>
                    <span className={active ? "font-medium text-ink" : "text-ink-soft"}>{t.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="px-1 pt-2 text-[11px] leading-snug text-muted">Both of you see the theme you pick.</p>
          </div>
        </>
      )}
    </div>
  );
}
