import Link from "next/link";
import { getAge, isActiveThisWeek } from "@/lib/options";
import { getTraits } from "@/lib/questions";
import { mainPhoto, photoUrl } from "@/lib/photos";
import { MapPinIcon, VerifiedIcon } from "./icons";

export default function ProfileCard({ profile }) {
  const photo = mainPhoto(profile.photos);
  const traits = getTraits(profile.personality).slice(0, 2);
  // A line of what they wrote: browse is about words, not just faces
  const snippet = profile.prompt_answers?.[0]?.answer;

  return (
    <Link
      href={`/profile/${profile.id}`}
      className="group card flex animate-rise flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        {photo ? (
          <img
            src={photoUrl(photo.path)}
            alt={profile.name}
            className="size-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid size-full place-items-center font-display text-6xl text-muted">{profile.name[0]}</div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/70 via-black/25 to-transparent" />

        {isActiveThisWeek(profile.last_active_at) && (
          <span className="chip absolute top-3 left-3 bg-white/90 px-2.5 py-0.5 text-[11px] text-sage backdrop-blur">
            <span className="size-1.5 rounded-full bg-sage" />
            Active
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3 text-white sm:p-4">
          <p className="flex items-center gap-1.5">
            <span className="truncate font-display text-xl leading-tight font-medium sm:text-2xl">{profile.name}</span>
            <span className="text-lg font-light opacity-90">{getAge(profile.birthdate)}</span>
            {profile.is_verified && <VerifiedIcon className="size-5 shrink-0" />}
          </p>
          <p className="flex items-center gap-1 text-xs text-white/85 sm:text-sm">
            <MapPinIcon className="size-3.5" />
            {profile.city}
          </p>
        </div>
      </div>

      {(snippet || traits.length > 0) && (
        <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
          {snippet && (
            <p className="line-clamp-2 font-display text-sm leading-snug text-ink-soft italic sm:text-[15px]">
              &ldquo;{snippet}&rdquo;
            </p>
          )}
          {traits.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5">
              {traits.map((t) => (
                <span key={t} className="chip bg-sand px-2.5 py-0.5 text-[11px] text-ink-soft sm:text-xs">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
