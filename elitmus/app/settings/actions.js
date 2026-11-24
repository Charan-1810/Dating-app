"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CITIES, GENDERS, INTERESTED_IN, INTENTS } from "@/lib/options";

const isOneOf = (list, value) => list.some((o) => o.value === value);

export async function updateProfile(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const updates = {
    name: formData.get("name")?.trim(),
    gender: formData.get("gender"),
    interested_in: formData.get("interested_in"),
    city: formData.get("city"),
    intent: formData.get("intent"),
  };

  if (!updates.name) return { error: "Name can't be empty." };
  if (
    !isOneOf(GENDERS, updates.gender) ||
    !isOneOf(INTERESTED_IN, updates.interested_in) ||
    !CITIES.includes(updates.city) ||
    !isOneOf(INTENTS, updates.intent)
  ) {
    return { error: "Please choose from the options." };
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) return { error: error.message };

  return { saved: true };
}

export async function deleteAccount(prevState, formData) {
  if (formData.get("confirm") !== "DELETE") {
    return { error: "Type DELETE (in capitals) to confirm." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 1. Photo files live in Storage, which the database cascade doesn't reach, so delete them first
  const { data: files } = await supabase.storage.from("photos").list(user.id);
  if (files?.length) {
    await supabase.storage.from("photos").remove(files.map((f) => `${user.id}/${f.name}`));
  }

  // 2. Delete the account. Cascades remove profile, prompts, likes, matches, messages, blocks.
  const { error } = await supabase.rpc("delete_my_account");
  if (error) return { error: error.message };

  // 3. Clear the login cookie in this browser (the account no longer exists)
  await supabase.auth.signOut({ scope: "local" });
  redirect("/login");
}
