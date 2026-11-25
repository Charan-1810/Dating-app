import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ProfileView from "@/components/profile-view";
import { PageHeader, Spinner } from "@/components/ui";
import { CameraIcon, CheckIcon, ChevronRightIcon, PencilIcon, ShieldIcon, SparklesIcon } from "@/components/icons";

export default function Home() {
  return (
    <main className="page">
      <Suspense fallback={<Spinner label="Loading your profile" />}>
        <MyProfile />
      </Suspense>
    </main>
  );
}

async function MyProfile() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*, photos(path, position), prompt_answers(position, prompt_id, answer)")
    .eq("id", user.id)
    .order("position", { referencedTable: "photos" })
    .order("position", { referencedTable: "prompt_answers" })
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile) redirect("/onboarding");
  // Send unfinished accounts to the step they skipped (browse only shows complete profiles)
  if (!profile.personality) redirect("/personality");
  if (profile.prompt_answers.length === 0) redirect("/prompts");

  // Profile strength: each item is one thing that gets you better likes
  const checklist = [
    { done: profile.photos.length === 3, label: `Photos (${profile.photos.length}/3)`, href: "/photos", Icon: CameraIcon },
    { done: profile.prompt_answers.length === 3, label: `Prompts (${profile.prompt_answers.length}/3)`, href: "/prompts", Icon: PencilIcon },
    { done: Boolean(profile.personality), label: "Personality questions", href: "/personality", Icon: SparklesIcon },
    { done: profile.is_verified, label: "eLitmus verified", href: "/settings", Icon: ShieldIcon },
  ];
  const score = checklist.filter((c) => c.done).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_30rem] lg:gap-12">
      <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
        <PageHeader
          eyebrow="Your profile"
          title={`Hi ${profile.name}, this is you`}
          subtitle="Exactly what others see, in the same order: photos alongside your answers."
        />

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <p className="font-medium">Profile strength</p>
            <p className="text-sm text-ink-soft">{score}/4</p>
          </div>
          <div className="mt-3 flex gap-1.5">
            {checklist.map((c) => (
              <span key={c.label} className={`h-1.5 flex-1 rounded-full ${c.done ? "bg-accent" : "bg-sand"}`} />
            ))}
          </div>
          <ul className="mt-4 flex flex-col">
            {checklist.map(({ done, label, href, Icon }) => (
              <li key={label}>
                <Link href={href} className="group -mx-2 flex items-center gap-3 rounded-2xl px-2 py-2.5 hover:bg-paper">
                  <span
                    className={`grid size-8 place-items-center rounded-full ${
                      done ? "bg-sage-soft text-sage" : "bg-sand text-ink-soft"
                    }`}
                  >
                    {done ? <CheckIcon className="size-4" /> : <Icon className="size-4" />}
                  </span>
                  <span className={`flex-1 text-sm ${done ? "text-ink-soft" : "font-medium"}`}>{label}</span>
                  <ChevronRightIcon className="size-4 text-muted transition group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap gap-2">
          <Link href="/photos" className="btn btn-outline">
            <CameraIcon className="size-4" /> Photos
          </Link>
          <Link href="/personality" className="btn btn-outline">
            <SparklesIcon className="size-4" /> Retake questions
          </Link>
          <Link href="/prompts" className="btn btn-outline">
            <PencilIcon className="size-4" /> Edit prompts
          </Link>
        </div>
      </aside>

      <ProfileView profile={profile} />
    </div>
  );
}
