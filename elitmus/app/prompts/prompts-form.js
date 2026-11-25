"use client";

import { useActionState } from "react";
import { savePrompts } from "./actions";
import { PROMPTS } from "@/lib/prompts";

export default function PromptsForm({ saved }) {
  const [state, formAction, pending] = useActionState(savePrompts, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {[1, 2, 3].map((position) => {
        const existing = saved.find((a) => a.position === position);

        return (
          <div key={position} className="card flex animate-rise flex-col gap-3 p-5 sm:p-6">
            <p className="eyebrow">
              Prompt {position}
              {position > 1 && <span className="font-normal tracking-normal normal-case"> · optional</span>}
            </p>
            <select name={`prompt_${position}`} defaultValue={existing?.prompt_id ?? ""} className="field font-medium">
              <option value="">Choose a prompt…</option>
              {PROMPTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.text}
                </option>
              ))}
            </select>
            <textarea
              name={`answer_${position}`}
              defaultValue={existing?.answer ?? ""}
              rows={5}
              placeholder="Write it like you'd say it to a friend…"
              className="field min-h-36 font-display text-lg leading-relaxed"
            />
          </div>
        );
      })}

      {state?.error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button disabled={pending} className="btn btn-primary py-3.5">
        {pending ? "Saving…" : "Save & see my profile"}
      </button>
    </form>
  );
}
