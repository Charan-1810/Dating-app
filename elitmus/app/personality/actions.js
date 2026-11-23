"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QUESTIONS } from "@/lib/questions";

export async function savePersonality(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const answers = {};
  for (const question of QUESTIONS) {
    const choice = formData.get(question.id);
    const valid = question.options.some((o) => o.id === choice);
    if (!valid) return { error: "Please answer every question." };
    answers[question.id] = choice;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ personality: answers })
    .eq("id", user.id);

  if (error) return { error: error.message };
  redirect("/");
}