"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QUESTIONS, validateQuiz, RETAKE_AFTER_DAYS } from "@/lib/questions";

const BANK_IDS = new Set(QUESTIONS.map((q) => q.id));

export async function savePersonality(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Which questions were in this quiz (a hidden field), and what was picked for each
  const quizIds = String(formData.get("quiz") ?? "").split(",").filter((id) => BANK_IDS.has(id));
  const answers = {};
  for (const id of quizIds) {
    const choice = formData.get(id);
    if (!choice) return { error: "Please answer every question." };
    answers[id] = choice;
  }

  const problem = validateQuiz(answers);
  if (problem) return { error: problem };

  // The database also stamps personality_taken_at and blocks retakes within 7 days
  const { error } = await supabase.from("profiles").update({ personality: answers }).eq("id", user.id);

  if (error) {
    if (error.code === "P0001") return { error: `You can retake the quiz once every ${RETAKE_AFTER_DAYS} days.` };
    return { error: error.message };
  }
  redirect("/");
}
