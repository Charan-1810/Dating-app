import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PromptsForm from "./prompts-form";

export default function PromptsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">In your own words</h1>
      <p className="text-sm text-gray-500">
        {"Pick up to 3 prompts. Write as much as you like — real detail beats a clever one-liner."}
      </p>
      <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
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