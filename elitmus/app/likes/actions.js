"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function sendLike(prevState, formData) {
  const supabase = await createClient();
  const toUser = formData.get("to_user");
  const target = formData.get("target") || null;
  const comment = formData.get("comment")?.trim() || null;

  // Friendly checks first (the database enforces the same rules)
  const { data: likedMe } = await supabase.rpc("liked_me", { other: toUser });
  if (!likedMe) {
    if (!comment) return { error: "Add a comment. Say what caught your eye." };
    const { data: sent } = await supabase.rpc("likes_sent_today");
    if (sent >= 5) return { error: "You've used all 5 likes today. They reset at midnight." };
  }

  const { error } = await supabase
    .from("likes")
    .insert({ to_user: toUser, target, comment });

  if (error) {
    if (error.code === "23505") return { error: "You've already liked them." };
    return { error: error.message };
  }

  refresh();
  return { ok: true };
}