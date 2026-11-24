"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateProfile, deleteAccount } from "./actions";
import { CITIES, GENDERS, INTERESTED_IN, INTENTS } from "@/lib/options";
import SelectField from "@/components/select-field";

const CITY_OPTIONS = CITIES.map((c) => ({ value: c, label: c }));

export default function SettingsForms({ email, profile }) {
  const [saveState, saveAction, saving] = useActionState(updateProfile, null);
  const [deleteState, deleteAction, deleting] = useActionState(deleteAccount, null);

  return (
    <>
      {/* Account info (read-only) */}
      <section className="flex flex-col gap-1 rounded-lg border p-4 text-sm">
        <p>
          Signed in as <strong>{email}</strong>
        </p>
        <p className="text-gray-600">
          {profile.is_verified ? "✓ Verified with eLitmus" : "Not verified"}
        </p>
      </section>

      {/* Edit basics */}
      <form action={saveAction} className="flex flex-col gap-3 rounded-lg border p-4">
        <h2 className="font-medium">Your basics</h2>
        <label className="flex flex-col gap-1 text-sm">
          First name
          <input
            name="name"
            required
            maxLength={50}
            defaultValue={profile.name}
            className="rounded border p-2"
          />
        </label>
        <SelectField label="I am a" name="gender" options={GENDERS} defaultValue={profile.gender} />
        <SelectField
          label="Interested in"
          name="interested_in"
          options={INTERESTED_IN}
          defaultValue={profile.interested_in}
        />
        <SelectField label="City" name="city" options={CITY_OPTIONS} defaultValue={profile.city} />
        <SelectField label="Looking for" name="intent" options={INTENTS} defaultValue={profile.intent} />
        <p className="text-xs text-gray-500">
          Date of birth can&apos;t be changed here, to protect the 18+ check.
        </p>

        {saveState?.error && <p className="text-sm text-red-600">{saveState.error}</p>}
        {saveState?.saved && <p className="text-sm text-green-700">Saved ✓</p>}

        <button disabled={saving} className="rounded bg-black p-2 text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Profile content shortcuts */}
      <section className="flex flex-wrap gap-4 text-sm underline">
        <Link href="/photos">Edit photos</Link>
        <Link href="/personality">Retake questions</Link>
        <Link href="/prompts">Edit prompts</Link>
        <Link href="/legal">Terms &amp; Privacy</Link>
      </section>

      {/* Danger zone */}
      <form action={deleteAction} className="flex flex-col gap-3 rounded-lg border border-red-300 p-4">
        <h2 className="font-medium text-red-700">Delete my account</h2>
        <p className="text-sm text-gray-600">
          This permanently deletes your profile, photos, answers, likes, matches and chats. It
          can&apos;t be undone.
        </p>
        <input
          name="confirm"
          placeholder="Type DELETE to confirm"
          autoComplete="off"
          className="rounded border p-2"
        />
        {deleteState?.error && <p className="text-sm text-red-600">{deleteState.error}</p>}
        <button disabled={deleting} className="rounded bg-red-600 p-2 text-white disabled:opacity-50">
          {deleting ? "Deleting..." : "Delete my account"}
        </button>
      </form>
    </>
  );
}
