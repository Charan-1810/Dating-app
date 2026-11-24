"use client";

import { useActionState } from "react";
import { savePrompts } from "./actions";
import { PROMPTS } from "@/lib/prompts";

export default function PromptsForm({ saved }) {
  const [state, formAction, pending] = useActionState(savePrompts, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {[1, 2, 3].map((position) => {
        const existing = saved.find((a) => a.position === position);

        return (
          <div key={position} className="flex flex-col gap-2 rounded-lg border p-3">
            <select
              name={`prompt_${position}`}
              defaultValue={existing?.prompt_id ?? ""}
              className="rounded border p-2"
            >
              <option value="">Choose a prompt (optional)</option>
              {PROMPTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.text}
                </option>
              ))}
            </select>
            <textarea
              name={`answer_${position}`}
              defaultValue={existing?.answer ?? ""}
              rows={4}
              placeholder="Your answer…"
              className="rounded border p-2"
            />
          </div>
        );
      })}

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        disabled={pending}
        className="rounded bg-black p-2 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}