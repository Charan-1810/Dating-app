import { getAge, INTENTS } from "@/lib/options";
import { getTraits, QUESTIONS } from "@/lib/questions";
import { promptText } from "@/lib/prompts";
import { photoUrl } from "@/lib/photos";

export default function ProfileView({ profile }) {
  const intent = INTENTS.find((i) => i.value === profile.intent)?.label;
  const traits = getTraits(profile.personality);
  const photos = profile.photos ?? [];
  const prompts = profile.prompt_answers ?? [];

  // Scenario answers to show (the first 2 questions)
  const scenarios = QUESTIONS.slice(0, 2)
    .map((q) => ({
      question: q.text,
      answer: q.options.find((o) => o.id === profile.personality?.[q.id])?.text,
    }))
    .filter((s) => s.answer);

  // Content blocks, in the order they appear between photos
  const blocks = [];
  if (scenarios[0]) {
    blocks.push(<Card key="scenario-0" label={scenarios[0].question} text={scenarios[0].answer} />);
  }
  if (traits.length > 0) {
    blocks.push(
      <div key="traits" className="flex flex-wrap gap-2 rounded-lg border p-4">
        {traits.map((t) => (
          <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            {t}
          </span>
        ))}
      </div>
    );
  }
  for (const p of prompts) {
    blocks.push(<Card key={`prompt-${p.position}`} label={promptText(p.prompt_id)} text={p.answer} />);
  }
  if (scenarios[1]) {
    blocks.push(<Card key="scenario-1" label={scenarios[1].question} text={scenarios[1].answer} />);
  }

  // Interleave: photo, block, photo, block, ...
  const items = [];
  const count = Math.max(photos.length, blocks.length);
  for (let i = 0; i < count; i++) {
    if (photos[i]) {
      items.push(
        <img
          key={`photo-${photos[i].position}`}
          src={photoUrl(photos[i].path)}
          alt={`${profile.name}'s photo ${i + 1}`}
          className="aspect-[3/4] w-full rounded-lg object-cover"
        />
      );
    }
    if (blocks[i]) items.push(blocks[i]);
  }

  return (
    <article className="flex w-full max-w-md flex-col gap-3">
      <header>
        <h1 className="text-2xl font-semibold">
          {profile.name}, {getAge(profile.birthdate)}
          {profile.is_verified && (
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 align-middle text-xs text-blue-700">
              ✓ Verified
            </span>
          )}
        </h1>
        <p className="text-gray-600">
          {profile.city} · {intent}
        </p>
      </header>
      {items}
    </article>
  );
}

function Card({ label, text }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 whitespace-pre-line text-lg">{text}</p>
    </div>
  );
}