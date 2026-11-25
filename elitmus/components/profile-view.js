import { getAge, INTENTS, isActiveThisWeek } from "@/lib/options";
import { getTraits, QUESTIONS } from "@/lib/questions";
import { promptText } from "@/lib/prompts";
import { photoUrl } from "@/lib/photos";
import LikeButton from "./like-button";
import { ActiveBadge, VerifiedBadge } from "./ui";
import { MapPinIcon, SparklesIcon, TargetIcon } from "./icons";

// likeTo = the profile owner's id when likes are allowed, otherwise null
export default function ProfileView({ profile, likeTo = null }) {
  const intent = INTENTS.find((i) => i.value === profile.intent)?.label;
  const traits = getTraits(profile.personality);
  const photos = profile.photos ?? [];
  const prompts = profile.prompt_answers ?? [];

  const scenarios = QUESTIONS.slice(0, 2)
    .map((q) => ({
      question: q.text,
      answer: q.options.find((o) => o.id === profile.personality?.[q.id])?.text,
    }))
    .filter((s) => s.answer);

  // Wrap any block so it gets a Like button (only when likeTo is set)
  function likeable(key, target, content) {
    return (
      <div key={key} className="relative flex animate-rise flex-col gap-3">
        {content}
        {likeTo && <LikeButton toUserId={likeTo} target={target} />}
      </div>
    );
  }

  const blocks = [];
  if (scenarios[0]) {
    blocks.push(likeable("scenario-0", scenarios[0].question,
      <AnswerCard eyebrow="Scenario" label={scenarios[0].question} text={scenarios[0].answer} />));
  }
  if (traits.length > 0) {
    blocks.push(likeable("traits", "Traits",
      <section className="card p-6 sm:p-7">
        <p className="eyebrow">Personality</p>
        <p className="mt-1 text-sm text-ink-soft">From 10 real-life scenarios, not a self-description</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {traits.map((t) => (
            <span key={t} className="chip bg-accent-soft py-1.5 text-[15px] text-accent-dark">
              <SparklesIcon className="size-4" />
              {t}
            </span>
          ))}
        </div>
      </section>));
  }
  for (const p of prompts) {
    blocks.push(likeable(`prompt-${p.position}`, promptText(p.prompt_id),
      <AnswerCard label={promptText(p.prompt_id)} text={p.answer} />));
  }
  if (scenarios[1]) {
    blocks.push(likeable("scenario-1", scenarios[1].question,
      <AnswerCard eyebrow="Scenario" label={scenarios[1].question} text={scenarios[1].answer} />));
  }

  // Interleave: photo, answer, photo, answer… so photos sit alongside words
  const items = [];
  const count = Math.max(photos.length, blocks.length);
  for (let i = 0; i < count; i++) {
    if (photos[i]) {
      items.push(likeable(`photo-${photos[i].position}`, `Photo ${i + 1}`,
        <img
          src={photoUrl(photos[i].path)}
          alt={`${profile.name}'s photo ${i + 1}`}
          className="aspect-[4/5] w-full rounded-3xl bg-sand object-cover shadow-card"
        />));
    }
    if (blocks[i]) items.push(blocks[i]);
  }

  return (
    <article className="flex w-full flex-col gap-4">
      <header className="card p-6 sm:p-7">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <h1 className="font-display text-4xl leading-none font-medium tracking-tight sm:text-5xl">{profile.name}</h1>
          <span className="font-display text-3xl font-light text-ink-soft sm:text-4xl">{getAge(profile.birthdate)}</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="chip bg-sand text-ink-soft">
            <MapPinIcon className="size-4" />
            {profile.city}
          </span>
          {intent && (
            <span className="chip bg-sand text-ink-soft">
              <TargetIcon className="size-4" />
              {intent}
            </span>
          )}
          {profile.is_verified && <VerifiedBadge />}
          {isActiveThisWeek(profile.last_active_at) && <ActiveBadge />}
        </div>
      </header>
      {items}
    </article>
  );
}

function AnswerCard({ eyebrow, label, text }) {
  return (
    <section className="card p-6 sm:p-7">
      {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
      <p className="text-sm font-medium text-ink-soft">{label}</p>
      <p className="mt-3 pr-10 font-display text-[1.375rem] leading-snug whitespace-pre-line text-pretty sm:text-2xl">
        {text}
      </p>
    </section>
  );
}
