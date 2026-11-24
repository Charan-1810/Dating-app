export const PROMPTS = [
  { id: "first_date", text: "My ideal first date is…" },
  { id: "green_flag", text: "The green flag I look for is…" },
  { id: "unpopular_opinion", text: "My most unpopular opinion is…" },
  { id: "new_city", text: "Since moving to a new city, I've discovered…" },
  { id: "weeknight", text: "On a typical weeknight you'll find me…" },
  { id: "learning", text: "Something I'm learning right now…" },
  { id: "proud", text: "Something I'm quietly proud of…" },
  { id: "get_along", text: "We'll get along if…" },
  { id: "non_negotiable", text: "A non-negotiable for me is…" },
];

export function promptText(id) {
  return PROMPTS.find((p) => p.id === id)?.text ?? "";
}