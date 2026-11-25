import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PersonalityForm from "./personality-form";
import { PageHeader, Spinner, Stepper } from "@/components/ui";

export default function PersonalityPage() {
  return (
    <main className="page-narrow">
      <Stepper current={2} />
      <PageHeader
        title="What would you actually do?"
        subtitle="Ten everyday situations, no right answers. Your choices build a short trait summary (inspired by the Big Five) that others see on your profile."
      />
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("personality")
    .eq("id", user.id)
    .maybeSingle();

  return <PersonalityForm saved={profile?.personality ?? {}} />;
}