import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PromptsForm from "./prompts-form";
import { PageHeader, Spinner, Stepper } from "@/components/ui";

export default function PromptsPage() {
  return (
    <main className="page-narrow">
      <Stepper current={3} />
      <PageHeader
        title="In your own words"
        subtitle="Pick up to 3 prompts. There's no character limit: real detail beats a clever one-liner, and it's what people search for."
      />
      <Suspense fallback={<Spinner />}>
        <PromptsLoader />
      </Suspense>
    </main>
  );
}

async function PromptsLoader() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: answers } = await supabase
    .from("prompt_answers")
    .select("position, prompt_id, answer")
    .eq("user_id", user.id);

  return <PromptsForm saved={answers ?? []} />;
}