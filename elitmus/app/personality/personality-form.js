"use client";

import { useActionState } from "react";
import { savePersonality } from "./actions";
import { QUESTIONS } from "@/lib/questions";

export default function PersonalityForm({ saved }) {
  const [state, formAction, pending] = useActionState(savePersonality, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {QUESTIONS.map((q, i) => (
        <fieldset key={q.id} className="flex flex-col gap-2">
          <legend className="mb-2 font-medium">
            {i + 1}. {q.text}
          </legend>
          {q.options.map((o) => (
            <label
              key={o.id}
              className="flex cursor-pointer items-center gap-2 rounded border p-3 has-[:checked]:border-black has-[:checked]:bg-gray-50"
            >
              <input
                type="radio"
                name={q.id}
                value={o.id}
                defaultChecked={saved[q.id] === o.id}
                required
              />
              {o.text}
            </label>
          ))}
        </fieldset>
      ))}

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        disabled={pending}
        className="rounded bg-black p-2 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "See my traits"}
      </button>
    </form>
  );
}