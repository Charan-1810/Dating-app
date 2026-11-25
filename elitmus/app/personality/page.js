import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PersonalityForm from "./personality-form";
import { getTraits, pickQuiz, QUESTIONS, QUIZ_LENGTH, RETAKE_AFTER_DAYS } from "@/lib/questions";
import { daysAgo } from "@/lib/options";
import { PageHeader, Spinner, Stepper } from "@/components/ui";
import { SparklesIcon } from "@/components/icons";

export default function PersonalityPage() {
  return (
    <main className="page-narrow">
      <Stepper current={2} />
      <Suspense fallback={<Spinner />}>
        <PersonalityLoader />
      </Suspense>
    </main>
  );
}

async function PersonalityLoader() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("personality, personality_taken_at")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw new Error(error.message);

  // Retake lock: once every 7 days (the database enforces this too)
  const takenAt = profile?.personality_taken_at;
  if (profile?.personality && takenAt && new Date(takenAt) > new Date(daysAgo(RETAKE_AFTER_DAYS))) {
    return <RetakeLocked takenAt={takenAt} traits={getTraits(profile.personality)} />;
  }

  // A fresh random quiz, avoiding the questions from your last attempt
  const questions = pickQuiz(Object.keys(profile?.personality ?? {}));
  const isRetake = Boolean(profile?.personality);

  return (
    <>
      <PageHeader
        title={isRetake ? "A fresh set of questions" : "What would you actually do?"}
        subtitle={`${QUIZ_LENGTH} everyday situations, picked at random from ${QUESTIONS.length}. There are no right answers; go with your gut. Your choices build a short trait summary (inspired by the Big Five) that others see on your profile.`}
      />
      <PersonalityForm questions={questions} />
    </>
  );
}

function RetakeLocked({ takenAt, traits }) {
  const next = new Date(new Date(takenAt).getTime() + RETAKE_AFTER_DAYS * 24 * 60 * 60 * 1000);
  const nextText = next.toLocaleDateString("en-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" });

  return (
    <>
      <PageHeader
        title="Your traits are set for now"
        subtitle={`You can retake the quiz once every ${RETAKE_AFTER_DAYS} days, so traits reflect you rather than whichever answers look best. You'll get a new set of questions on ${nextText}.`}
      />
      <section className="card p-6">
        <p className="eyebrow">Your current traits</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {traits.map((t) => (
            <span key={t} className="chip bg-accent-soft py-1.5 text-[15px] text-accent-dark">
              <SparklesIcon className="size-4" />
              {t}
            </span>
          ))}
        </div>
      </section>
      <Link href="/" className="btn btn-primary mt-6">
        Back to my profile
      </Link>
    </>
  );
}
