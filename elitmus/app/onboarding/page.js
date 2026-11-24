"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProfile } from "./actions";
import { CITIES, GENDERS, INTERESTED_IN, INTENTS } from "@/lib/options";
import SelectField from "@/components/select-field";

const CITY_OPTIONS = CITIES.map((c) => ({ value: c, label: c }));

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

        <SelectField label="I am a" name="gender" options={GENDERS} />
        <SelectField label="Interested in" name="interested_in" options={INTERESTED_IN} />
        <SelectField label="City" name="city" options={CITY_OPTIONS} />
        <SelectField label="Looking for" name="intent" options={INTENTS} />

        {/* Opt-in only: DPDP requires explicit consent before using eLitmus data */}
        <label className="flex items-start gap-2 rounded border p-3 text-sm">
          <input type="checkbox" name="elitmus_consent" className="mt-1" />
          <span>
            <strong>Verify me with eLitmus</strong> (optional). We check whether this email is in
            eLitmus&apos;s candidate records and, if so, add a ✓ Verified badge. Nothing else is
            imported.
          </span>
        </label>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          disabled={pending}
          className="rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {pending ? "Saving..." : "Continue"}
        </button>

        <p className="text-center text-xs text-gray-500">
          See our <Link href="/legal" className="underline">Terms &amp; Privacy</Link>
        </p>
      </form>
    </main>
  );
}
