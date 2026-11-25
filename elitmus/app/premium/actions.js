"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Demo checkout. In production this would NOT be callable from the app:
// the payment gateway (e.g. Razorpay) calls a webhook after a successful payment,
// we verify its signature, and only then extend the subscription.
export async function activatePremium() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.rpc("activate_demo_premium");
  if (error) return { error: "Couldn't activate Premium. Has step-13-premium.sql been run?" };
  refresh();
  return { activated: true };
}

export async function cancelPremium() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_premium");
  if (error) return { error: error.message };
  refresh();
  return { cancelled: true };
}
