"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateProfile, deleteAccount } from "./actions";
import { CITIES, GENDERS, INTERESTED_IN, INTENTS } from "@/lib/options";
import SelectField from "@/components/select-field";
import ChoiceGroup from "@/components/choice-group";
import { VerifiedBadge } from "@/components/ui";
import {
  CameraIcon,
  CheckIcon,
  ChevronRightIcon,
  FileIcon,
  PencilIcon,
  SparklesIcon,
  TrashIcon,
} from "@/components/icons";

const CITY_OPTIONS = CITIES.map((c) => ({ value: c, label: c }));

const PROFILE_LINKS = [
  { href: "/photos", label: "Photos", Icon: CameraIcon },
  { href: "/personality", label: "Personality questions", Icon: SparklesIcon },
  { href: "/prompts", label: "Prompts", Icon: PencilIcon },
  { href: "/legal", label: "Terms & Privacy", Icon: FileIcon },
];

export default function SettingsForms({ email, profile }) {
  const [saveState, saveAction, saving] = useActionState(updateProfile, null);
  const [deleteState, deleteAction, deleting] = useActionState(deleteAccount, null);

  return (
    <div className="flex flex-col gap-5">
      {/* Account info (read-only) */}
      <section className="card flex items-center gap-4 p-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink font-display text-xl text-paper">
          {profile.name[0]}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate font-medium">{email}</p>
          {profile.is_verified ? (
            <VerifiedBadge />
          ) : (
            <p className="text-sm text-muted">Not verified with eLitmus</p>
          )}
        </div>
      </section>

      {/* Edit basics */}
      <form action={saveAction} className="card flex flex-col gap-5 p-5 sm:p-6">
        <h2 className="font-display text-2xl">Your basics</h2>
        <label className="flex flex-col gap-2">
          <span className="label">First name</span>
          <input name="name" required maxLength={50} defaultValue={profile.name} className="field" />
        </label>
        <ChoiceGroup label="I am a" name="gender" options={GENDERS} defaultValue={profile.gender} />
        <ChoiceGroup label="Interested in" name="interested_in" options={INTERESTED_IN} defaultValue={profile.interested_in} />
        <SelectField label="City" name="city" options={CITY_OPTIONS} defaultValue={profile.city} />
        <ChoiceGroup label="Looking for" name="intent" options={INTENTS} defaultValue={profile.intent} columns={2} />
        <p className="text-xs text-muted">Date of birth can&apos;t be changed, to protect the 18+ check.</p>

        {saveState?.error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{saveState.error}</p>}

        <div className="flex items-center justify-end gap-3">
          {saveState?.saved && !saving && (
            <span className="flex animate-rise items-center gap-1.5 text-sm text-sage">
              <CheckIcon className="size-4" /> Saved
            </span>
          )}
          <button disabled={saving} className="btn btn-primary">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      {/* Profile content shortcuts */}
      <nav className="card overflow-hidden">
        {PROFILE_LINKS.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 border-b border-line px-5 py-4 text-[15px] last:border-0 hover:bg-paper"
          >
            <Icon className="size-5 text-ink-soft" />
            <span className="flex-1">{label}</span>
            <ChevronRightIcon className="size-4 text-muted transition group-hover:translate-x-0.5" />
          </Link>
        ))}
      </nav>

      {/* Danger zone */}
      <form action={deleteAction} className="flex flex-col gap-4 rounded-3xl border border-red-200 bg-red-50/50 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-red-100 text-red-600">
            <TrashIcon className="size-5" />
          </span>
          <h2 className="font-display text-2xl text-red-700">Delete my account</h2>
        </div>
        <p className="text-sm leading-relaxed text-ink-soft">
          This permanently deletes your profile, photos, answers, likes, matches and chats. It can&apos;t be undone.
        </p>
        <input
          name="confirm"
          placeholder="Type DELETE to confirm"
          autoComplete="off"
          className="field border-red-200 focus:border-red-400 focus:ring-red-100"
        />
        {deleteState?.error && <p className="text-sm text-red-700">{deleteState.error}</p>}
        <button disabled={deleting} className="btn btn-danger self-start">
          {deleting ? "Deleting…" : "Delete my account"}
        </button>
      </form>
    </div>
  );
}
