"use client";

import { useActionState, useState } from "react";
import { sendLike } from "@/app/likes/actions";
import { HeartIcon, SendIcon } from "./icons";

export default function LikeButton({ toUserId, target }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(sendLike, null);

  // Closed: a round heart floating in the corner of the block above it
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label={`Like: ${target}`}
        className="absolute right-4 bottom-4 grid size-12 place-items-center rounded-full bg-surface text-accent shadow-lift ring-1 ring-line transition hover:scale-110 hover:bg-accent hover:text-white active:scale-95"
      >
        <HeartIcon className="size-5" strokeWidth={2.2} />
      </button>
    );
  }

  // Open: a note is required. That's the whole point of the 5-likes rule.
  return (
    <form action={formAction} className="card flex animate-rise flex-col gap-3 border-accent/30 p-4">
      <input type="hidden" name="to_user" value={toUserId} />
      <input type="hidden" name="target" value={target} />
      <p className="flex items-center gap-2 text-sm font-medium">
        <HeartIcon className="size-4 text-accent" strokeWidth={2.2} />
        <span className="truncate">Liking: {target}</span>
      </p>
      <textarea
        name="comment"
        required
        maxLength={500}
        rows={3}
        autoFocus
        placeholder="Say why. A specific note gets a reply far more often than “hey”."
        className="field resize-none"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">
          Cancel
        </button>
        <button disabled={pending} className="btn btn-accent">
          <SendIcon className="size-4" />
          {pending ? "Sending…" : "Send like"}
        </button>
      </div>
    </form>
  );
}

export function LikeBackButton({ toUserId }) {
  const [state, formAction, pending] = useActionState(sendLike, null);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="to_user" value={toUserId} />
      <button disabled={pending} className="btn btn-accent w-full py-3">
        <HeartIcon className="size-4" strokeWidth={2.2} />
        {pending ? "Matching…" : "Like back & match"}
      </button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
