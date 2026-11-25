// Personality quiz: a bank of 100 everyday scenarios, 20 per trait (inspired by the Big Five).
//
// How it works:
//  - Each quiz is 15 questions picked at random: exactly 3 per trait (pickQuiz).
//  - Every question measures ONE trait and has 4 options: 2 lean "high" (+1), 2 lean "low" (-1).
//    All options are meant to sound fine, so there's no obviously "good" answer to fake.
//  - Option order is shuffled per quiz, and scores never leave the server.
//  - A trait's label is decided by the majority of its 3 answers (getTraits).

export const TRAIT_LABELS = {
  openness: { high: "Curious", low: "Grounded" },
  conscientiousness: { high: "Planner", low: "Spontaneous" },
  extraversion: { high: "Social butterfly", low: "Recharges solo" },
  agreeableness: { high: "Warm", low: "Straight-talker" },
  stability: { high: "Calm under pressure", low: "Feels deeply" },
};

export const TRAITS = Object.keys(TRAIT_LABELS);
export const QUESTIONS_PER_TRAIT = 3;
export const QUIZ_LENGTH = TRAITS.length * QUESTIONS_PER_TRAIT; // 15
export const RETAKE_AFTER_DAYS = 7; // also enforced by a database trigger

// Compact way to write a question: ["+", text] scores +1, ["-", text] scores -1
function q(id, trait, text, options) {
  return {
    id,
    trait,
    text,
    options: options.map(([sign, optionText], i) => ({
      id: "abcd"[i],
      text: optionText,
      score: sign === "+" ? 1 : -1,
    })),
  };
}

export const QUESTIONS = [
  // ── Openness: Curious (+) vs Grounded (-) ──────────────────────────────
  q("o01", "openness", "A friend invites you to a pottery-meets-poetry night you know nothing about. You…", [
    ["+", "Say yes before they finish the sentence"],
    ["-", "Suggest your usual café instead"],
    ["+", "Go, and secretly hope there's an open mic"],
    ["-", "Ask what else is on, it sounds a bit niche"],
  ]),
  q("o02", "openness", "Ordering food at 11pm, you…", [
    ["-", "Reorder your usual, it never misses"],
    ["+", "Scroll till you find a cuisine you've never tried"],
    ["-", "Stick to your top-3 comfort orders"],
    ["+", "Let the person you're with pick something wild"],
  ]),
  q("o03", "openness", "Your Spotify Wrapped is mostly…", [
    ["+", "Genres you can't even name"],
    ["-", "The same artists as last year, and proudly so"],
    ["+", "A chaotic mix of ghazals, K-pop and lo-fi"],
    ["-", "Songs you already know every word to"],
  ]),
  q("o04", "openness", "Planning a trip with someone you're dating, you'd rather…", [
    ["-", "Go back to a place you both already love"],
    ["+", "Pick a town neither of you has heard of"],
    ["-", "Do the classic: beach, sunset, good food"],
    ["+", "Spin a map and go wherever it lands (within budget)"],
  ]),
  q("o05", "openness", "On a date, they bring up a topic you know nothing about, say astrophysics. You…", [
    ["+", "Ask a hundred questions, this is the fun part"],
    ["-", "Steer it to something you can both talk about"],
    ["+", "Go home and watch three videos on it"],
    ["-", "Nod along and wait for a lighter topic"],
  ]),
  q("o06", "openness", "A new app or trend everyone's talking about drops. You…", [
    ["-", "Wait to see if it sticks around"],
    ["+", "Are trying it the same day"],
    ["-", "Skip it, your current apps are fine"],
    ["+", "Already found it before it was cool"],
  ]),
  q("o07", "openness", "Your ideal Sunday afternoon:", [
    ["-", "Same café, same table, same order"],
    ["+", "A gallery or flea market you haven't explored"],
    ["+", "Learning a random skill from a reel"],
    ["-", "Rewatching a show you've seen five times"],
  ]),
  q("o08", "openness", "The group chat is fighting about a controversial movie. You…", [
    ["+", "Love hearing takes totally different from yours"],
    ["-", "Stick with your take, you've thought it through"],
    ["+", "Rewatch it to see what they saw"],
    ["-", "Think it's just a movie, no deep meaning needed"],
  ]),
  q("o09", "openness", "Your room decor is…", [
    ["-", "Simple and the same for years"],
    ["+", "Always changing: posters, plants, fairy lights, experiments"],
    ["-", "Functional: if it works, it stays"],
    ["+", "Full of souvenirs from random places"],
  ]),
  q("o10", "openness", "If you could take any weekend class, you'd pick…", [
    ["+", "Something wildly new: aerial yoga, stand-up, Japanese"],
    ["-", "Something useful: driving, cooking basics, Excel"],
    ["+", "Philosophy or film appreciation"],
    ["-", "Honestly, you'd skip it and rest"],
  ]),
  q("o11", "openness", "Long 2am conversations about life, the universe and aliens are…", [
    ["+", "Your favourite kind of conversation"],
    ["-", "Fun once in a while, but you'd rather sleep"],
    ["+", "The best way to get to know someone new"],
    ["-", "Less your thing than real, practical talk"],
  ]),
  q("o12", "openness", "For a first date, you'd pick…", [
    ["-", "Coffee, classic for a reason"],
    ["+", "A workshop or gig neither of you has done"],
    ["-", "Dinner at a place you trust"],
    ["+", "A heritage walk or street-food trail in a new area"],
  ]),
  q("o13", "openness", "Your bucket list is…", [
    ["+", "Long and weirdly specific: northern lights, learn tabla…"],
    ["-", "Short and realistic"],
    ["+", "Growing every time you watch a documentary"],
    ["-", "Not really a thing, you don't keep one"],
  ]),
  q("o14", "openness", "A friend recommends a book way outside your usual taste. You…", [
    ["-", "Add it to the list you'll never get to"],
    ["+", "Start it the same week"],
    ["-", "Ask for something closer to what you like"],
    ["+", "Read it and send them a voice-note essay"],
  ]),
  q("o15", "openness", "Where would you like to live in 5 years?", [
    ["+", "Somewhere new, another city or even country"],
    ["-", "Near family and friends, where you are now"],
    ["+", "Wherever life gets interesting"],
    ["-", "Settled in a city you know well"],
  ]),
  q("o16", "openness", "Festivals and family traditions, you…", [
    ["-", "Love them exactly as they are"],
    ["+", "Enjoy them, but like adding your own twist"],
    ["-", "Find comfort in doing things the way your family always has"],
    ["+", "Get curious how other cultures celebrate the same thing"],
  ]),
  q("o17", "openness", "A reel shows someone quitting their job to travel. You think…", [
    ["+", "Bold. I'd love to try something like that someday"],
    ["-", "Fun to watch, but stability matters more"],
    ["+", "Saving it to my 'someday' folder"],
    ["-", "How are they paying rent?"],
  ]),
  q("o18", "openness", "Picking a movie for date night:", [
    ["-", "The blockbuster everyone's talking about"],
    ["+", "An indie or foreign film you've never heard of"],
    ["-", "A comfort rewatch you both love"],
    ["+", "Something strange with great reviews"],
  ]),
  q("o19", "openness", "Your relationship with change:", [
    ["+", "Change keeps life interesting"],
    ["-", "You like knowing what to expect"],
    ["+", "You get restless if things stay the same too long"],
    ["-", "You adapt, but you prefer routine"],
  ]),
  q("o20", "openness", "Your date's playlist is full of artists you've never heard of. You…", [
    ["-", "Ask to switch to something you both know"],
    ["+", "Ask them to explain every song"],
    ["-", "Tolerate it, music isn't a big deal"],
    ["+", "Add half of it to your library"],
  ]),

  // ── Conscientiousness: Planner (+) vs Spontaneous (-) ──────────────────
  q("c01", "conscientiousness", "You have a date on Saturday. By Thursday, you have…", [
    ["+", "A booking, a backup plan and the route sorted"],
    ["-", "A vague idea, you'll figure it out on the day"],
    ["+", "Already checked the place's reviews and menu"],
    ["-", "Nothing yet, the vibe will decide"],
  ]),
  q("c02", "conscientiousness", "Your phone notifications right now:", [
    ["-", "99+ unread, you'll get to them"],
    ["+", "Zero. Inbox zero is a lifestyle"],
    ["-", "Somewhere in the hundreds, it's fine"],
    ["+", "Cleared every night before bed"],
  ]),
  q("c03", "conscientiousness", "On a group trip, you're the one who…", [
    ["+", "Makes the expense sheet and tracks every rupee"],
    ["-", "Pays for stuff and forgets to add it"],
    ["+", "Sends a neat summary at the end"],
    ["-", "Trusts it all evens out somehow"],
  ]),
  q("c04", "conscientiousness", "Your relationship with deadlines:", [
    ["-", "The night before is when the magic happens"],
    ["+", "Done two days early"],
    ["-", "Last-minute pressure is your fuel"],
    ["+", "Broken into a daily to-do list"],
  ]),
  q("c05", "conscientiousness", "Your room right now is…", [
    ["+", "Tidy, everything has a place"],
    ["-", "Organised chaos only you understand"],
    ["+", "Clean enough for a surprise video call"],
    ["-", "Let's not do a video call"],
  ]),
  q("c06", "conscientiousness", "When you say “I'll be there at 7”, you mean…", [
    ["+", "6:55"],
    ["-", "7-ish, give or take 20"],
    ["+", "7 sharp, and you'll text if anything changes"],
    ["-", "Whenever the traffic decides"],
  ]),
  q("c07", "conscientiousness", "Your approach to money:", [
    ["-", "Spend now, figure it out later"],
    ["+", "Budget sheet, savings goal, SIP running"],
    ["-", "Check your balance only when the card declines"],
    ["+", "Track spending roughly every month"],
  ]),
  q("c08", "conscientiousness", "Fitness for you is…", [
    ["+", "A fixed schedule you rarely miss"],
    ["-", "Whenever motivation strikes"],
    ["+", "Tracked in an app, streaks and all"],
    ["-", "Dancing in your room counts, right?"],
  ]),
  q("c09", "conscientiousness", "Before a big purchase like a phone, you…", [
    ["-", "Buy the one that feels right"],
    ["+", "Compare specs, read reviews, wait for a sale"],
    ["-", "Decide in the store"],
    ["+", "Make a pros-and-cons list"],
  ]),
  q("c10", "conscientiousness", "Your calendar is…", [
    ["+", "Colour-coded and up to date"],
    ["-", "Mostly empty, you keep it in your head"],
    ["+", "The only reason you remember birthdays"],
    ["-", "Something you downloaded once"],
  ]),
  q("c11", "conscientiousness", "A friend says “road trip tomorrow?” You…", [
    ["-", "Are already packing"],
    ["+", "Love it, but need a day to plan the route"],
    ["-", "Say yes and figure out the rest on the way"],
    ["+", "Ask about budget, stays and who's driving first"],
  ]),
  q("c12", "conscientiousness", "Your notes app is full of…", [
    ["+", "Lists: to-dos, groceries, goals, gift ideas"],
    ["-", "Random thoughts and half-written poems"],
    ["+", "Plans for the next three months"],
    ["-", "Almost nothing, you don't really take notes"],
  ]),
  q("c13", "conscientiousness", "When you start a new hobby, you…", [
    ["-", "Go all in for two weeks, then move on"],
    ["+", "Stick with it for months"],
    ["-", "Do it only when you feel like it"],
    ["+", "Set a small goal and track it"],
  ]),
  q("c14", "conscientiousness", "Replying to messages:", [
    ["+", "Within a few hours, always"],
    ["-", "In bursts: three days later, ten replies at once"],
    ["+", "You set reminders for ones you can't answer yet"],
    ["-", "Some chats you replied to in your head and forgot"],
  ]),
  q("c15", "conscientiousness", "Packing for a trip:", [
    ["-", "The night before, throwing things in"],
    ["+", "A list made a week before"],
    ["-", "Morning of. Forgot the charger again"],
    ["+", "A checklist you tick off as you go"],
  ]),
  q("c16", "conscientiousness", "Your career plan is…", [
    ["+", "Clear: the next 2–3 steps are mapped out"],
    ["-", "Taking it as it comes"],
    ["+", "A list of skills you're actively building"],
    ["-", "Open, you'll know the right thing when you see it"],
  ]),
  q("c17", "conscientiousness", "Your weekend usually…", [
    ["-", "Just happens, no plan needed"],
    ["+", "Has a loose plan by Friday"],
    ["-", "Starts at noon"],
    ["+", "Includes chores done on Saturday morning"],
  ]),
  q("c18", "conscientiousness", "A group project has gone quiet. You…", [
    ["+", "Take charge and make a task list"],
    ["-", "Wait for someone else to start"],
    ["+", "Set a deadline in the group chat"],
    ["-", "Do your part at the end"],
  ]),
  q("c19", "conscientiousness", "Your relationship with alarms:", [
    ["-", "Seven alarms, five snoozes"],
    ["+", "One alarm and you're up"],
    ["-", "You wake up when you wake up"],
    ["+", "Up before the alarm most days"],
  ]),
  q("c20", "conscientiousness", "In a long-term relationship, you think…", [
    ["+", "Shared goals and plans keep it strong"],
    ["-", "Too much planning kills the spark"],
    ["+", "It's good to talk about the future early"],
    ["-", "Let it unfold naturally"],
  ]),

  // ── Extraversion: Social butterfly (+) vs Recharges solo (-) ───────────
  q("e01", "extraversion", "Friday night and your phone's quiet. You…", [
    ["+", "Post a “who's free?” story"],
    ["-", "Finally start the series you've been saving"],
    ["+", "Call a friend and make a plan"],
    ["-", "Enjoy the quiet, honestly"],
  ]),
  q("e02", "extraversion", "You're at a party where you only know the host. You…", [
    ["-", "Find one person and talk all night"],
    ["+", "Introduce yourself around the room"],
    ["-", "Stay near the host until you warm up"],
    ["+", "Somehow end up in charge of the music"],
  ]),
  q("e03", "extraversion", "Your ideal first date is…", [
    ["+", "A lively bar, gig or comedy show"],
    ["-", "A quiet café where you can actually talk"],
    ["+", "Something with a group, like a quiz night"],
    ["-", "A long walk, just the two of you"],
  ]),
  q("e04", "extraversion", "After a long, busy week, you recharge by…", [
    ["-", "Staying in alone"],
    ["+", "Going out with friends"],
    ["-", "Reading, gaming or a solo walk"],
    ["+", "Hosting people at your place"],
  ]),
  q("e05", "extraversion", "Calls or texts?", [
    ["+", "Calls, why type when you can talk?"],
    ["-", "Texts, always"],
    ["+", "Voice notes all day"],
    ["-", "Texts. Calls only if scheduled"],
  ]),
  q("e06", "extraversion", "In the group chat, you are…", [
    ["-", "The silent reader who reacts with emojis"],
    ["+", "The one who keeps it alive"],
    ["-", "Muted, but you catch up later"],
    ["+", "The one planning the next meetup"],
  ]),
  q("e07", "extraversion", "At a wedding, you're…", [
    ["+", "Dancing at the front of the baraat"],
    ["-", "Enjoying it from the side with a plate of food"],
    ["+", "Dragging others onto the dance floor"],
    ["-", "Slipping away once the photos are done"],
  ]),
  q("e08", "extraversion", "Meeting your partner's friends for the first time feels…", [
    ["-", "A bit draining, but you'll manage"],
    ["+", "Exciting, more people to vibe with"],
    ["-", "Easier one or two at a time"],
    ["+", "Like a chance to tell your best stories"],
  ]),
  q("e09", "extraversion", "Your Instagram stories are…", [
    ["+", "Daily, sometimes hourly"],
    ["-", "Rare, maybe once a month"],
    ["+", "Full of friends and plans"],
    ["-", "Mostly reposts, if anything"],
  ]),
  q("e10", "extraversion", "Your best working style:", [
    ["-", "Remote, headphones on"],
    ["+", "Office buzz and chai breaks with the team"],
    ["-", "Thinking alone, then sharing"],
    ["+", "Brainstorming out loud"],
  ]),
  q("e11", "extraversion", "A long weekend comes up. You…", [
    ["+", "Plan a group trip"],
    ["-", "Plan solo time: a book, a nap, maybe a trek"],
    ["+", "Say yes to every invite"],
    ["-", "Keep at least one full day just for yourself"],
  ]),
  q("e12", "extraversion", "On a road trip, you're…", [
    ["-", "In the window seat with earphones"],
    ["+", "The DJ and the loudest singer"],
    ["-", "Quietly enjoying the view"],
    ["+", "Chatting with the driver the whole way"],
  ]),
  q("e13", "extraversion", "You walk into a café and see a friend of a friend. You…", [
    ["+", "Go say hi and sit with them"],
    ["-", "Smile and wave from your table"],
    ["+", "Introduce them to whoever you're with"],
    ["-", "Hope they don't notice, you came here to work"],
  ]),
  q("e14", "extraversion", "Your birthday plans:", [
    ["-", "A small dinner with two or three people"],
    ["+", "A big party, everyone invited"],
    ["-", "A quiet day and a solo treat"],
    ["+", "Three celebrations across the week"],
  ]),
  q("e15", "extraversion", "When something exciting happens, you…", [
    ["+", "Tell everyone immediately"],
    ["-", "Keep it to yourself until it's real"],
    ["+", "Post about it"],
    ["-", "Tell one close person"],
  ]),
  q("e16", "extraversion", "At a college fest or networking event, you…", [
    ["-", "Stick with the people you came with"],
    ["+", "Leave with ten new contacts"],
    ["-", "Leave once you've done what you came for"],
    ["+", "Somehow end up on stage"],
  ]),
  q("e17", "extraversion", "Your friend circle is…", [
    ["+", "Huge, you have friends in every group"],
    ["-", "Two or three people, and that's perfect"],
    ["+", "Always growing, you collect people"],
    ["-", "One best friend who just gets you"],
  ]),
  q("e18", "extraversion", "A pause in conversation on a first date feels…", [
    ["-", "Comfortable, not every second needs filling"],
    ["+", "Like your cue to tell a story"],
    ["-", "Nice, actually"],
    ["+", "Awkward, you'll fill it fast"],
  ]),
  q("e19", "extraversion", "Concert or Netflix?", [
    ["+", "Concert, front row"],
    ["-", "Netflix and a blanket"],
    ["+", "Concert, then the after-party"],
    ["-", "Netflix, crowds aren't your thing"],
  ]),
  q("e20", "extraversion", "Sharing your life online:", [
    ["-", "Private account, close friends only"],
    ["+", "Open book, you love sharing"],
    ["-", "You lurk more than you post"],
    ["+", "Stories, posts, the whole thing"],
  ]),

  // ── Agreeableness: Warm (+) vs Straight-talker (-) ─────────────────────
  q("a01", "agreeableness", "A friend asks if their new haircut looks good, and you're not sure. You…", [
    ["+", "Find what you genuinely like about it and say that"],
    ["-", "Tell them honestly, they asked"],
    ["+", "Hype them up, it'll grow out anyway"],
    ["-", "Say it's not your favourite, but it's their head"],
  ]),
  q("a02", "agreeableness", "Your date is 20 minutes late without texting. You…", [
    ["-", "Mention it, a heads-up would have been nice"],
    ["+", "Say no worries, traffic happens"],
    ["-", "Bring it up early so it doesn't become a pattern"],
    ["+", "Order a snack and let it go"],
  ]),
  q("a03", "agreeableness", "In an argument with your partner, you…", [
    ["+", "Try to see their side first"],
    ["-", "Make your point clearly, even if it stings"],
    ["+", "Look for a middle ground"],
    ["-", "Don't back down if you know you're right"],
  ]),
  q("a04", "agreeableness", "Your food arrives wrong at a restaurant. You…", [
    ["-", "Tell them clearly, you're paying for it"],
    ["+", "Eat it anyway, no fuss"],
    ["-", "Ask them to fix it right away"],
    ["+", "Ask politely, and tip well anyway"],
  ]),
  q("a05", "agreeableness", "A friend keeps cancelling plans. You…", [
    ["+", "Check if they're okay"],
    ["-", "Tell them it's getting annoying"],
    ["+", "Keep inviting them, they'll come around"],
    ["-", "Stop making plans with them for a while"],
  ]),
  q("a06", "agreeableness", "Someone cuts in front of you in a queue. You…", [
    ["-", "Say “excuse me, there's a line”"],
    ["+", "Let it go, it's a few minutes"],
    ["-", "Call it out, rules are rules"],
    ["+", "Assume they didn't see the line"],
  ]),
  q("a07", "agreeableness", "A friend pitches you their startup idea. You…", [
    ["+", "Encourage them first, then gently share concerns"],
    ["-", "Point out the flaws, better now than later"],
    ["+", "Focus on what's great about it"],
    ["-", "Ask the hard questions an investor would"],
  ]),
  q("a08", "agreeableness", "Your sibling borrows your stuff without asking. You…", [
    ["-", "Tell them to ask first"],
    ["+", "Don't mind, sharing is caring"],
    ["-", "Set a clear rule"],
    ["+", "Laugh it off"],
  ]),
  q("a09", "agreeableness", "Your group is deciding where to eat. You…", [
    ["+", "Go with whatever everyone else wants"],
    ["-", "Say exactly what you want"],
    ["+", "Pick what works for the person with the strictest diet"],
    ["-", "Veto places you don't like"],
  ]),
  q("a10", "agreeableness", "Your friend's new partner seems like a red flag. You…", [
    ["-", "Tell your friend straight up"],
    ["+", "Gently ask how things are going"],
    ["-", "Share your opinion even if they don't ask"],
    ["+", "Support them and wait for them to come to you"],
  ]),
  q("a11", "agreeableness", "In a debate, you're more likely to…", [
    ["+", "Find common ground"],
    ["-", "Play devil's advocate for fun"],
    ["+", "Let it go to keep the peace"],
    ["-", "Argue until the facts are clear"],
  ]),
  q("a12", "agreeableness", "Someone you're dating forgets your birthday. You…", [
    ["-", "Make sure they know it hurt"],
    ["+", "Forgive it, everyone slips up"],
    ["-", "Tell them birthdays are a big deal to you"],
    ["+", "Suggest celebrating together this weekend"],
  ]),
  q("a13", "agreeableness", "A colleague takes credit for your idea. You…", [
    ["+", "Talk to them privately later"],
    ["-", "Correct it in the meeting"],
    ["+", "Let it slide this once"],
    ["-", "Make sure your manager knows"],
  ]),
  q("a14", "agreeableness", "How do you show you care?", [
    ["-", "Honest advice, even when it's tough to hear"],
    ["+", "Little favours and remembering details"],
    ["-", "Solving the actual problem"],
    ["+", "Checking in, always"],
  ]),
  q("a15", "agreeableness", "A friend vents about a problem. You…", [
    ["+", "Listen and comfort first"],
    ["-", "Jump straight to solutions"],
    ["+", "Validate how they feel"],
    ["-", "Point out where they went wrong, kindly but clearly"],
  ]),
  q("a16", "agreeableness", "Someone asks for a favour you don't have time for. You…", [
    ["-", "Say no, clearly"],
    ["+", "Say yes and figure it out"],
    ["-", "Explain you're busy, no guilt"],
    ["+", "Help a little, even if not fully"],
  ]),
  q("a17", "agreeableness", "Someone posts an opinion you disagree with. You…", [
    ["+", "Scroll past, live and let live"],
    ["-", "Comment your view"],
    ["+", "Like the parts you do agree with"],
    ["-", "Send it to a friend to discuss why it's wrong"],
  ]),
  q("a18", "agreeableness", "Your date makes a joke that doesn't land. You…", [
    ["-", "Tell them it didn't land, playfully"],
    ["+", "Laugh anyway, they're trying"],
    ["-", "Roast them back"],
    ["+", "Smile and keep the conversation going"],
  ]),
  q("a19", "agreeableness", "Your friends would call you…", [
    ["+", "The softie of the group"],
    ["-", "The brutally honest one"],
    ["+", "The peacemaker"],
    ["-", "The one who says what everyone's thinking"],
  ]),
  q("a20", "agreeableness", "Splitting the bill on a first date, you…", [
    ["-", "Split it exactly, it keeps things clear"],
    ["+", "Offer to pay, it's a nice gesture"],
    ["-", "Say upfront how you like to handle it"],
    ["+", "Go with whatever makes them comfortable"],
  ]),

  // ── Stability: Calm under pressure (+) vs Feels deeply (-) ─────────────
  q("s01", "stability", "Your crush leaves you on “seen” for six hours. You…", [
    ["+", "Assume they're busy"],
    ["-", "Reread your message ten times"],
    ["+", "Forget about it until they reply"],
    ["-", "Send a screenshot to a friend for analysis"],
  ]),
  q("s02", "stability", "A big presentation is tomorrow. Tonight you…", [
    ["-", "Lie awake running through it"],
    ["+", "Sleep fine, you're prepared enough"],
    ["-", "Feel the nerves, and use them"],
    ["+", "Do one practice run and relax"],
  ]),
  q("s03", "stability", "Your flight is delayed by four hours. You…", [
    ["+", "Find food, a charger and a good podcast"],
    ["-", "Feel like your whole day is ruined"],
    ["+", "Shrug, it happens"],
    ["-", "Stress about everything you'll miss"],
  ]),
  q("s04", "stability", "After a small fight with your partner, you…", [
    ["-", "Replay it in your head for days"],
    ["+", "Move on once it's talked through"],
    ["-", "Need reassurance that you're okay"],
    ["+", "Sleep on it and wake up fine"],
  ]),
  q("s05", "stability", "Plans change at the last minute. You feel…", [
    ["+", "Fine, flexible is fun"],
    ["-", "Thrown off for the rest of the day"],
    ["+", "Mildly annoyed, then over it"],
    ["-", "Uneasy until you know the new plan"],
  ]),
  q("s06", "stability", "You get critical feedback at work. You…", [
    ["-", "Think about it all evening"],
    ["+", "Take notes and move on"],
    ["-", "Feel it deeply, even if it's fair"],
    ["+", "See it as useful, not personal"],
  ]),
  q("s07", "stability", "A rough day for you looks like…", [
    ["+", "Annoyed for an hour, then fine"],
    ["-", "Big emotions, and you need to talk it out"],
    ["+", "One gym session and you've reset"],
    ["-", "A good cry, then feeling better"],
  ]),
  q("s08", "stability", "Your date cancels an hour before. You…", [
    ["-", "Wonder if it was something you did"],
    ["+", "Make other plans, no big deal"],
    ["-", "Feel disappointed for the night"],
    ["+", "Reschedule and enjoy the free evening"],
  ]),
  q("s09", "stability", "Waiting for interview results, you…", [
    ["+", "Forget about it until they arrive"],
    ["-", "Refresh your email every hour"],
    ["+", "Trust that you did your best"],
    ["-", "Brace yourself for the worst"],
  ]),
  q("s10", "stability", "In a crisis, like a lost phone or a friend getting hurt, you're…", [
    ["-", "Shaken, but you push through"],
    ["+", "The calm one making calls"],
    ["-", "Overwhelmed at first"],
    ["+", "Thinking clearly now, feeling it later"],
  ]),
  q("s11", "stability", "Watching a sad movie, you…", [
    ["+", "Feel it, but stay composed"],
    ["-", "Cry. Every time"],
    ["+", "End up analysing the plot instead"],
    ["-", "Need a minute after the credits"],
  ]),
  q("s12", "stability", "When something goes wrong, your first reaction is…", [
    ["-", "Your heart drops for a second"],
    ["+", "“It'll work out”"],
    ["-", "“What if it gets worse?”"],
    ["+", "“Okay, what's the fix?”"],
  ]),
  q("s13", "stability", "When something's bothering you, your texts are…", [
    ["+", "The same as usual"],
    ["-", "Short, and they can tell"],
    ["+", "Calm, you just bring it up"],
    ["-", "A long paragraph, incoming"],
  ]),
  q("s14", "stability", "How often do you replay a conversation afterwards?", [
    ["-", "Often, checking what you said"],
    ["+", "Rarely, it's done"],
    ["-", "Every night before sleep"],
    ["+", "Only if something big happened"],
  ]),
  q("s15", "stability", "Your partner hasn't texted all day. You…", [
    ["+", "Assume they're busy, it's fine"],
    ["-", "Feel a little uneasy"],
    ["+", "Send a meme and get on with your day"],
    ["-", "Check when they were last online"],
  ]),
  q("s16", "stability", "Stuck in traffic for an hour:", [
    ["-", "Your mood is gone"],
    ["+", "Podcast time"],
    ["-", "Checking the ETA, getting more tense"],
    ["+", "Call a friend and pass the time"],
  ]),
  q("s17", "stability", "When you're stressed, people around you…", [
    ["+", "Can't really tell"],
    ["-", "Know immediately"],
    ["+", "Notice you get quieter, but steady"],
    ["-", "Get a full update, you need to vent"],
  ]),
  q("s18", "stability", "Before a first date, you feel…", [
    ["-", "Butterflies all day"],
    ["+", "Relaxed, it's just a coffee"],
    ["-", "Nervous enough to change outfits three times"],
    ["+", "Curious, not nervous"],
  ]),
  q("s19", "stability", "A mean comment on your post:", [
    ["+", "Doesn't bother you"],
    ["-", "Stings for a while"],
    ["+", "Delete it and forget it"],
    ["-", "Stays on your mind more than you'd like"],
  ]),
  q("s20", "stability", "Your mood across a week is usually…", [
    ["-", "Up and down, you feel things fully"],
    ["+", "Pretty steady"],
    ["-", "Intense: highs are high, lows are low"],
    ["+", "Mostly calm with small dips"],
  ]),
];

const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((question) => [question.id, question]));

// Fisher–Yates shuffle: every order equally likely. Returns a new array.
function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Picks a fresh random quiz: 3 questions per trait, avoiding `excludeIds`
// (the questions from your last quiz) whenever possible. Shuffles question
// and option order, and strips the scores so the browser never sees them.
export function pickQuiz(excludeIds = []) {
  const exclude = new Set(excludeIds);
  const picked = TRAITS.flatMap((trait) => {
    const pool = QUESTIONS.filter((question) => question.trait === trait);
    const fresh = shuffle(pool.filter((question) => !exclude.has(question.id)));
    const seen = shuffle(pool.filter((question) => exclude.has(question.id)));
    return [...fresh, ...seen].slice(0, QUESTIONS_PER_TRAIT);
  });
  return shuffle(picked).map((question) => ({
    id: question.id,
    text: question.text,
    options: shuffle(question.options).map(({ id, text }) => ({ id, text })),
  }));
}

// Checks a submitted quiz. Returns an error message, or null if valid.
export function validateQuiz(answers) {
  const ids = Object.keys(answers);
  if (ids.length !== QUIZ_LENGTH) return "Please answer every question.";
  const perTrait = {};
  for (const id of ids) {
    const question = QUESTION_BY_ID[id];
    if (!question) return "Unknown question.";
    if (!question.options.some((o) => o.id === answers[id])) return "Please answer every question.";
    perTrait[question.trait] = (perTrait[question.trait] ?? 0) + 1;
  }
  if (TRAITS.some((trait) => perTrait[trait] !== QUESTIONS_PER_TRAIT)) return "This quiz is out of date. Reload the page.";
  return null;
}

// Answers ({ questionId: optionId }) → up to 3 trait labels, strongest first.
// With 3 questions per trait the score is ±1 (2 of 3 agree) or ±3 (all agree),
// so every label shown is backed by a majority of answers.
export function getTraits(answers) {
  if (!answers) return [];

  const scores = {};
  for (const [questionId, optionId] of Object.entries(answers)) {
    const question = QUESTION_BY_ID[questionId];
    const option = question?.options.find((o) => o.id === optionId);
    if (!option) continue; // e.g. an answer from an older version of the quiz
    scores[question.trait] = (scores[question.trait] ?? 0) + option.score;
  }

  return Object.entries(scores)
    .filter(([, score]) => score !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 3)
    .map(([trait, score]) => TRAIT_LABELS[trait][score > 0 ? "high" : "low"]);
}

// A few of the person's actual answers to show on their profile,
// from different traits so they say different things about them.
export function sampleAnswers(answers, count = 2) {
  const result = [];
  const usedTraits = new Set();
  for (const [questionId, optionId] of Object.entries(answers ?? {})) {
    const question = QUESTION_BY_ID[questionId];
    const option = question?.options.find((o) => o.id === optionId);
    if (!option || usedTraits.has(question.trait)) continue;
    usedTraits.add(question.trait);
    result.push({ question: question.text, answer: option.text });
    if (result.length === count) break;
  }
  return result;
}
