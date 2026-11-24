// Creates demo profiles so Browse isn't empty during the presentation.
//
//   Create:  node --env-file=.env.local scripts/seed-demo.mjs
//   Delete:  node --env-file=.env.local scripts/seed-demo.mjs --delete
//
// It signs up each account through the normal public API (same rules as a real user),
// so everything still goes through RLS. Safe to re-run: existing accounts are skipped.
// Delete them all before a real launch (the --delete mode needs step-11-12.sql).

import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "Demo@2026!profile";
const PHOTO_DIR = new URL("./seed-photos/", import.meta.url);

const client = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

// personality: one letter per question, in the order of lib/questions.js
const QUESTION_IDS = ["cancel", "weekend", "order", "deadline", "party", "disagree", "class", "money", "plans", "sunday"];

const PEOPLE = [
  {
    name: "Ananya", birthdate: "1999-03-14", gender: "woman", interested_in: "men", city: "Bengaluru", intent: "long-term",
    personality: "cacabcabac",
    prompts: [
      ["first_date", "A long walk through Cubbon Park on a Sunday morning, followed by filter coffee and an argument about which bookshop in Church Street is the best. I'll lose the argument and buy a book anyway."],
      ["green_flag", "You remember small things. The name of my dog, the exam I was nervous about, the song I said I liked. Attention is the most underrated kind of affection."],
      ["learning", "Carnatic violin — badly, at 6am, to the despair of my neighbours."],
    ],
  },
  {
    name: "Rohan", birthdate: "1997-08-02", gender: "man", interested_in: "women", city: "Bengaluru", intent: "long-term",
    personality: "badacbdacb",
    prompts: [
      ["weeknight", "Cooking something ambitious that takes twice as long as the recipe claims. Then eating it at 10:30pm while pretending that was the plan all along."],
      ["unpopular_opinion", "Trekking is better in the monsoon. Yes, the leeches are real. Yes, the waterfalls are worth it. Kudremukh in July changed my life."],
      ["get_along", "You can laugh at yourself and you don't mind long drives with a terrible playlist."],
    ],
  },
  {
    name: "Meera", birthdate: "2000-11-21", gender: "woman", interested_in: "men", city: "Pune", intent: "figuring-out",
    personality: "dabdacdbad",
    prompts: [
      ["new_city", "Moved to Pune for my first job eighteen months ago. Discovered that misal pav is a personality, that Sinhagad at sunrise is worth the 4am alarm, and that I actually enjoy my own company."],
      ["proud", "I taught my mother to use UPI and now she sends me money with a 'for chai' note every month."],
    ],
  },
  {
    name: "Arjun", birthdate: "1996-05-09", gender: "man", interested_in: "women", city: "Hyderabad", intent: "long-term",
    personality: "cccacabcca",
    prompts: [
      ["non_negotiable", "Kindness to waiters, auto drivers and anyone who can't do anything for you. How someone treats strangers tells you how they'll treat you after the honeymoon phase."],
      ["first_date", "Biryani. Obviously. Then a slow walk around the lake while we decide whose biryani loyalty is misguided."],
      ["learning", "Telugu, properly — I grew up in Delhi and my grandmother deserves better than my current vocabulary."],
    ],
  },
  {
    name: "Kavya", birthdate: "1998-01-30", gender: "woman", interested_in: "everyone", city: "Chennai", intent: "friendship",
    personality: "abdbbaddba",
    prompts: [
      ["weeknight", "At a Bharatanatyam class I joined to 'get fit' and stayed in because the teacher is terrifying and wonderful."],
      ["green_flag", "You have a hobby you're genuinely bad at and do anyway."],
      ["unpopular_opinion", "Beach sunsets are overrated. Sunrises at Besant Nagar, with nobody around and a cutting chai in hand — that's the real thing."],
    ],
  },
  {
    name: "Vikram", birthdate: "1995-09-17", gender: "man", interested_in: "women", city: "Mumbai", intent: "long-term",
    personality: "dcabdcbadc",
    prompts: [
      ["proud", "Ran my first full marathon last January. Finished in 5 hours 12 minutes, which my friends describe as 'a long walk' and I describe as 'an achievement'."],
      ["get_along", "You'll forgive me for being ten minutes early to everything. Mumbai traffic made me paranoid."],
    ],
  },
  {
    name: "Ishita", birthdate: "2001-06-05", gender: "woman", interested_in: "men", city: "Delhi NCR", intent: "short-term",
    personality: "bbdcdbbcdb",
    prompts: [
      ["first_date", "Old Delhi food walk. If you can handle parathe wali gali at 8pm with me, you can handle anything."],
      ["learning", "Pottery. My bowls are structurally questionable but emotionally significant."],
      ["non_negotiable", "You read. Anything — comics, thrillers, recipe books. Just read."],
    ],
  },
  {
    name: "Siddharth", birthdate: "1999-12-12", gender: "man", interested_in: "women", city: "Pune", intent: "figuring-out",
    personality: "aacdcaacda",
    prompts: [
      ["new_city", "That the best conversations happen at 2am on the terrace after a hackathon, and that I'm happier building side projects than scrolling. Currently building an app that tells you which local trains are least crowded."],
      ["weeknight", "Badminton at 9pm, then arguing with my roommate about whether that was really out."],
    ],
  },
  {
    name: "Priya", birthdate: "1997-04-22", gender: "woman", interested_in: "men", city: "Hyderabad", intent: "long-term",
    personality: "cdbaccbbac",
    prompts: [
      ["green_flag", "You call your parents without being reminded."],
      ["proud", "I started a weekend reading circle for girls in my apartment complex's staff quarters. Eleven kids now, and two of them have read more books this year than I have."],
      ["first_date", "A board game café. I'm extremely competitive at Codenames — consider yourself warned."],
    ],
  },
  {
    name: "Karthik", birthdate: "1996-02-18", gender: "man", interested_in: "women", city: "Chennai", intent: "long-term",
    personality: "bacabdcaba",
    prompts: [
      ["unpopular_opinion", "Rasam is the greatest soup ever invented and I will defend this at any dinner table, in any city, against any cuisine."],
      ["get_along", "You enjoy quiet. I'm the kind of person who can sit in a café with you for two hours, both reading, and call it a great date."],
    ],
  },
  {
    name: "Neha", birthdate: "1998-10-03", gender: "woman", interested_in: "men", city: "Mumbai", intent: "long-term",
    personality: "dacadcbdac",
    prompts: [
      ["weeknight", "Marine Drive with a friend, a bag of chana jor garam, and a long rant about work that turns into a plan to quit and open a bakery. We never open the bakery."],
      ["non_negotiable", "Honesty, even the awkward kind. Tell me you don't like my playlist. I'll survive."],
      ["learning", "Swimming. At 27. The six-year-olds in my batch are very encouraging."],
    ],
  },
  {
    name: "Aditya", birthdate: "2000-07-27", gender: "man", interested_in: "everyone", city: "Delhi NCR", intent: "friendship",
    personality: "abbdbacbdb",
    prompts: [
      ["first_date", "Stand-up comedy open mic in Hauz Khas. Bonus points if we both agree the guy who went third was the funniest."],
      ["proud", "I've kept the same sourdough starter alive for three years. Her name is Gulabo."],
    ],
  },
  {
    name: "Sam", birthdate: "1998-08-08", gender: "non-binary", interested_in: "everyone", city: "Bengaluru", intent: "figuring-out",
    personality: "aadbbaadba",
    prompts: [
      ["new_city", "Indiranagar's indie music scene, the joy of a working metro line, and that 'Bengaluru weather' is a valid answer to every 'why did you move' question."],
      ["green_flag", "You ask follow-up questions."],
    ],
  },
];

const emailFor = (person) => `demo-${person.name.toLowerCase()}@example.com`;

async function signIn(person) {
  const sb = client();
  const email = emailFor(person);
  let { data, error } = await sb.auth.signInWithPassword({ email, password: PASSWORD });
  let isNew = false;
  if (error) {
    ({ data, error } = await sb.auth.signUp({ email, password: PASSWORD }));
    isNew = true;
  }
  if (error || !data.session) return { error: error?.message ?? "no session (is email confirmation on?)" };
  return { sb, id: data.user.id, isNew };
}

async function create(person) {
  const { sb, id, error } = await signIn(person);
  if (error) return `FAIL  ${person.name}: ${error}`;

  const { data: existing } = await sb.from("profiles").select("id").eq("id", id).maybeSingle();
  if (existing) return `skip  ${person.name} (already exists)`;

  const personality = Object.fromEntries(QUESTION_IDS.map((q, i) => [q, person.personality[i]]));
  const { name, birthdate, gender, interested_in, city, intent } = person;
  const { error: e1 } = await sb.from("profiles").insert({ id, name, birthdate, gender, interested_in, city, intent });
  if (e1) return `FAIL  ${person.name} profile: ${e1.message}`;
  await sb.from("profiles").update({ personality }).eq("id", id);

  const rows = person.prompts.map(([prompt_id, answer], i) => ({ user_id: id, position: i + 1, prompt_id, answer }));
  const { error: e2 } = await sb.from("prompt_answers").insert(rows);
  if (e2) return `FAIL  ${person.name} prompts: ${e2.message}`;

  for (const position of [1, 2]) {
    const file = await readFile(new URL(`${person.name.toLowerCase()}-${position}.jpg`, PHOTO_DIR));
    const path = `${id}/${crypto.randomUUID()}.jpg`;
    const { error: up } = await sb.storage.from("photos").upload(path, file, { contentType: "image/jpeg" });
    if (up) return `FAIL  ${person.name} photo: ${up.message}`;
    await sb.from("photos").insert({ user_id: id, path, position });
  }
  return `ok    ${person.name} (${emailFor(person)})`;
}

async function remove(person) {
  const { sb, id, isNew, error } = await signIn(person);
  if (error) return `skip  ${person.name}: ${error}`;
  const { data: files } = await sb.storage.from("photos").list(id);
  if (files?.length) await sb.storage.from("photos").remove(files.map((f) => `${id}/${f.name}`));
  const { error: e } = await sb.rpc("delete_my_account");
  if (e) return `FAIL  ${person.name}: ${e.message}`;
  return `gone  ${person.name}${isNew ? " (was not seeded)" : ""}`;
}

const action = process.argv.includes("--delete") ? remove : create;
for (const person of PEOPLE) console.log(await action(person));
