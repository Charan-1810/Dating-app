"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PROMPTS } from "@/lib/prompts";

export async function savePrompts(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const rows = [];
  const emptyPositions = [];

  for (const position of [1, 2, 3]) {
    const promptId = formData.get(`prompt_${position}`);
    const answer = formData.get(`answer_${position}`)?.trim();

    if (promptId && answer) {
      if (!PROMPTS.some((p) => p.id === promptId)) {
        return { error: "Unknown prompt." };
      }
      rows.push({ user_id: user.id, position, prompt_id: promptId, answer });
    } else {
      emptyPositions.push(position);
    }
  }

  if (rows.length === 0) {
    return { error: "Answer at least one prompt." };
  }

  const chosen = rows.map((r) => r.prompt_id);
  if (new Set(chosen).size !== chosen.length) {
    return { error: "Pick a different prompt for each answer." };
  }

  const { error } = await supabase
    .from("prompt_answers")
    .upsert(rows, { onConflict: "user_id,position" });
  if (error) return { error: error.message };

  if (emptyPositions.length > 0) {
    await supabase
      .from("prompt_answers")
      .delete()
      .eq("user_id", user.id)
      .in("position", emptyPositions);
  }

  redirect("/");
}