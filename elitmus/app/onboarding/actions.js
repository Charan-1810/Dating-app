"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAge } from "@/lib/options";

export async function createProfile(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = {
    id: user.id,
    name: formData.get("name")?.trim(),
    birthdate: formData.get("birthdate"),
    gender: formData.get("gender"),
    interested_in: formData.get("interested_in"),
    city: formData.get("city"),
    intent: formData.get("intent"),
  };

  if (!profile.birthdate || getAge(profile.birthdate) < 18) {
    return { error: "You must be 18 or older to join." };
  }

  const { error } = await supabase.from("profiles").insert(profile);
  if (error) return { error: error.message };

  redirect("/photos");
}