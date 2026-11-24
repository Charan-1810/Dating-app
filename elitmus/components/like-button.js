"use client";

import { useActionState, useState } from "react";
import { sendLike } from "@/app/likes/actions";

export default function LikeButton({ toUserId, target }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(sendLike, null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-end rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
      >
        ♡ Like
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3">
      <input type="hidden" name="to_user" value={toUserId} />
      <input type="hidden" name="target" value={target} />
      <textarea
        name="comment"
        required
        maxLength={500}
        rows={2}
        autoFocus
        placeholder="Reply to this…"
        className="rounded border bg-white p-2"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex gap-2">
        <button disabled={pending} className="rounded bg-black px-3 py-1 text-white disabled:opacity-50">
          {pending ? "Sending..." : "Send like"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-1 text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function LikeBackButton({ toUserId }) {
  const [state, formAction, pending] = useActionState(sendLike, null);

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <input type="hidden" name="to_user" value={toUserId} />
      <button disabled={pending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Matching..." : "♥ Like back"}
      </button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}