"use client";

import { useActionState, useState } from "react";
import { savePersonality } from "./actions";

// `questions` come from the server already picked and shuffled, without scores
export default function PersonalityForm({ questions }) {
  const [state, formAction, pending] = useActionState(savePersonality, null);
  const [answered, setAnswered] = useState(0);

  // Any radio change bubbles up to the form: recount from the form's current values
  function handleChange(e) {
    const data = new FormData(e.currentTarget);
    setAnswered(questions.filter((q) => data.get(q.id)).length);
  }

  const total = questions.length;

  return (
    <form action={formAction} onChange={handleChange} className="flex flex-col gap-4">
      {/* Tells the server which questions this quiz had */}
      <input type="hidden" name="quiz" value={questions.map((q) => q.id).join(",")} />

      {questions.map((q, i) => (
        <fieldset key={q.id} className="card animate-rise p-5 sm:p-6">
          <legend className="sr-only">{q.text}</legend>
          <p className="eyebrow">
            Question {i + 1} of {total}
          </p>
          <p aria-hidden="true" className="mt-2 mb-4 font-display text-xl leading-snug sm:text-2xl">
            {q.text}
          </p>
          <div className="flex flex-col gap-2">
            {q.options.map((o) => (
              <label
                key={o.id}
                className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-line px-4 py-3.5 text-[15px] transition hover:border-ink/25 has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/15"
              >
                <input type="radio" name={q.id} value={o.id} required className="sr-only" />
                {/* Custom radio circle: the dot appears when the hidden input is checked */}
                <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-line bg-surface transition group-has-[:checked]:border-accent">
                  <span className="size-2.5 scale-0 rounded-full bg-accent transition group-has-[:checked]:scale-100" />
                </span>
                {o.text}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      {state?.error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {/* Sticky footer: progress + submit, always in reach while scrolling */}
      <div className="sticky bottom-20 z-30 md:bottom-4">
        <div className="card flex items-center gap-4 p-3 pl-5 shadow-lift">
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-sm">
              <span className="font-medium">{answered}</span>
              <span className="text-ink-soft"> of {total} answered</span>
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${(answered / total) * 100}%` }}
              />
            </div>
          </div>
          <button disabled={pending} className="btn btn-primary py-3">
            {pending ? "Saving…" : "See my traits"}
          </button>
        </div>
      </div>
    </form>
  );
}
