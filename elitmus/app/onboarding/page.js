"use client";

import { useActionState } from "react";
import { createProfile } from "./actions";
import { CITIES, GENDERS, INTERESTED_IN, INTENTS } from "@/lib/options";

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState(createProfile, null);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form action={formAction} className="flex w-full max-w-sm flex-col gap-3">
        <h1 className="text-2xl font-semibold">Tell us about you</h1>

        <label className="flex flex-col gap-1 text-sm">
          First name
          <input name="name" required maxLength={50} className="rounded border p-2" />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Date of birth
          <input name="birthdate" type="date" required className="rounded border p-2" />
        </label>

        <Select label="I am a" name="gender" options={GENDERS} />
        <Select label="Interested in" name="interested_in" options={INTERESTED_IN} />
        <Select
          label="City"
          name="city"
          options={CITIES.map((c) => ({ value: c, label: c }))}
        />
        <Select label="Looking for" name="intent" options={INTENTS} />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          disabled={pending}
          className="rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {pending ? "Saving..." : "Continue"}
        </button>
      </form>
    </main>
  );
}

function Select({ label, name, options }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <select name={name} required defaultValue="" className="rounded border p-2">
        <option value="" disabled>
          Choose...
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}