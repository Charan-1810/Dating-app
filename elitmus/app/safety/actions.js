"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { REPORT_REASONS } from "@/lib/options";

export async function blockUser(prevState, formData) {
  const supabase = await createClient();
  const userId = formData.get("user_id");

  const { error } = await supabase.from("blocks").insert({ blocked_id: userId });
  // 23505 = already blocked: that's fine, carry on
  if (error && error.code !== "23505") return { error: error.message };

  redirect("/browse");
}

export async function reportUser(prevState, formData) {
  const supabase = await createClient();
  const userId = formData.get("user_id");
  const reason = formData.get("reason");
  const details = formData.get("details")?.trim() || null;

  if (!REPORT_REASONS.some((r) => r.value === reason)) {
    return { error: "Please choose a reason." };
  }

  const { error } = await supabase
    .from("reports")
    .insert({ reported_id: userId, reason, details });
  if (error) return { error: error.message };

  // Reporting also blocks, so they can't contact you while we review
  await supabase.from("blocks").insert({ blocked_id: userId });

  redirect("/browse");
}