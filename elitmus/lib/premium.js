export const PREMIUM_PRICE = 199; // ₹ per month

// What Premium adds. It sells depth (understanding people), never volume (more likes).
export const PREMIUM_FEATURES = [
  { title: "Why you might click", text: "See the traits you share with someone, and the questions you answered the same way." },
  { title: "Filter by personality", text: "Find Planners, Calm-under-pressure types, Social butterflies… in Browse." },
  { title: "Support a fairer app", text: "Premium pays for moderation and safety, so they stay free for everyone." },
];

// Never behind a paywall
export const ALWAYS_FREE = [
  "Browse and search",
  "5 likes a day, each with a note",
  "Seeing who liked you",
  "Messaging your matches",
  "Block and report",
  "eLitmus verification",
];

// Is this user premium right now? Safe to call before the SQL has been run (returns not premium).
export async function getPremium(supabase, userId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("premium_until")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return { active: false, until: null };
  return { active: new Date(data.premium_until) > new Date(), until: data.premium_until };
}

// "24 December 2026", always in India time, same on server and browser
export function formatDateIST(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
