export const TRAIT_LABELS = {
  openness: { high: "Curious", low: "Grounded" },
  conscientiousness: { high: "Planner", low: "Spontaneous" },
  extraversion: { high: "Social butterfly", low: "Recharges solo" },
  agreeableness: { high: "Warm", low: "Straight-talker" },
  stability: { high: "Calm under pressure", low: "Feels deeply" },
};

export const QUESTIONS = [
  {
    id: "cancel",
    text: "Your friend cancels plans last minute. You…",
    options: [
      { id: "a", text: "Feel secretly relieved — a night in sounds great", traits: { extraversion: -1 } },
      { id: "b", text: "Text three other people to make new plans", traits: { extraversion: 1 } },
      { id: "c", text: "Ask if they're okay", traits: { agreeableness: 1 } },
      { id: "d", text: "Finally tackle something on your to-do list", traits: { conscientiousness: 1 } },
    ],
  },
  {
    id: "weekend",
    text: "You have a free long weekend and some savings. You…",
    options: [
      { id: "a", text: "Book a trip somewhere you've never heard of", traits: { openness: 1, conscientiousness: -1 } },
      { id: "b", text: "Go back to a favourite place", traits: { openness: -1 } },
      { id: "c", text: "Plan a detailed itinerary first", traits: { conscientiousness: 1 } },
      { id: "d", text: "Round up a group and decide together", traits: { extraversion: 1 } },
    ],
  },
  {
    id: "order",
    text: "Your food arrives wrong at a restaurant. You…",
    options: [
      { id: "a", text: "Eat it anyway — no fuss", traits: { agreeableness: 1 } },
      { id: "b", text: "Calmly ask them to fix it", traits: { stability: 1 } },
      { id: "c", text: "Tell them clearly — you're paying for it", traits: { agreeableness: -1 } },
      { id: "d", text: "Try it — might be a new favourite", traits: { openness: 1 } },
    ],
  },
  {
    id: "deadline",
    text: "A big deadline is a week away. You…",
    options: [
      { id: "a", text: "Start today with a plan", traits: { conscientiousness: 1 } },
      { id: "b", text: "Do your best work the night before", traits: { conscientiousness: -1 } },
      { id: "c", text: "Worry about it a bit, but get it done", traits: { stability: -1 } },
      { id: "d", text: "Stay relaxed — it always works out", traits: { stability: 1 } },
    ],
  },
  {
    id: "party",
    text: "You're at a party where you only know the host. You…",
    options: [
      { id: "a", text: "Introduce yourself around the room", traits: { extraversion: 1 } },
      { id: "b", text: "Find one person and talk all night", traits: { extraversion: -1 } },
      { id: "c", text: "Help the host in the kitchen", traits: { agreeableness: 1 } },
      { id: "d", text: "Stay near the host until you warm up", traits: { stability: -1 } },
    ],
  },
  {
    id: "disagree",
    text: "You and someone you're dating disagree on something important. You…",
    options: [
      { id: "a", text: "Talk it through right away", traits: { stability: 1 } },
      { id: "b", text: "Overthink it before saying anything", traits: { stability: -1 } },
      { id: "c", text: "Look for a middle ground", traits: { agreeableness: 1 } },
      { id: "d", text: "Hold your ground if you're right", traits: { agreeableness: -1 } },
    ],
  },
  {
    id: "class",
    text: "A friend invites you to a class you've never tried — salsa, pottery, climbing. You…",
    options: [
      { id: "a", text: "Sign up on the spot", traits: { openness: 1 } },
      { id: "b", text: "Ask what it involves first", traits: { conscientiousness: 1 } },
      { id: "c", text: "Go if the group is going", traits: { extraversion: 1 } },
      { id: "d", text: "Pass — you know what you like", traits: { openness: -1 } },
    ],
  },
  {
    id: "money",
    text: "You get an unexpected ₹10,000. You…",
    options: [
      { id: "a", text: "Save it", traits: { conscientiousness: 1 } },
      { id: "b", text: "Treat your friends", traits: { agreeableness: 1, extraversion: 1 } },
      { id: "c", text: "Spend it on an experience", traits: { openness: 1 } },
      { id: "d", text: "Spend it before you overthink it", traits: { conscientiousness: -1 } },
    ],
  },
  {
    id: "plans",
    text: "Your plans for the day suddenly fall apart. You…",
    options: [
      { id: "a", text: "Roll with it", traits: { stability: 1, conscientiousness: -1 } },
      { id: "b", text: "Quickly make a new plan", traits: { conscientiousness: 1 } },
      { id: "c", text: "Feel thrown off for a while", traits: { stability: -1 } },
      { id: "d", text: "See it as a chance to do something random", traits: { openness: 1 } },
    ],
  },
  {
    id: "sunday",
    text: "Your ideal Sunday morning is…",
    options: [
      { id: "a", text: "Brunch with a big group", traits: { extraversion: 1 } },
      { id: "b", text: "A book and coffee, alone", traits: { extraversion: -1 } },
      { id: "c", text: "A market, museum or somewhere new", traits: { openness: 1 } },
      { id: "d", text: "Chores done, week planned", traits: { conscientiousness: 1 } },
    ],
  },
];

// Turn saved answers ({ cancel: "c", ... }) into up to 3 trait labels
export function getTraits(answers) {
  if (!answers) return [];

  const scores = {};
  for (const question of QUESTIONS) {
    const option = question.options.find((o) => o.id === answers[question.id]);
    if (!option) continue;
    for (const [trait, points] of Object.entries(option.traits)) {
      scores[trait] = (scores[trait] || 0) + points;
    }
  }

  return Object.entries(scores)
    .filter(([, score]) => score !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 3)
    .map(([trait, score]) => TRAIT_LABELS[trait][score > 0 ? "high" : "low"]);
}