import Link from "next/link";
import { getAge, isActiveThisWeek } from "@/lib/options";
import { getTraits } from "@/lib/questions";
import { photoUrl } from "@/lib/photos";

export default function ProfileCard({ profile }) {
  const photo = profile.photos?.[0];
  const traits = getTraits(profile.personality).slice(0, 2);

  return (
    <Link
      href={`/profile/${profile.id}`}
      className="flex flex-col overflow-hidden rounded-lg border hover:shadow-md"
    >
      {photo ? (
        <img src={photoUrl(photo.path)} alt={profile.name} className="aspect-[3/4] w-full object-cover" />
      ) : (
        <div className="aspect-[3/4] w-full bg-gray-100" />
      )}
      <div className="flex flex-col gap-1 p-2">
        <p className="font-medium">
          {profile.name}, {getAge(profile.birthdate)}
          {profile.is_verified && <span className="ml-1 text-blue-600">✓</span>}
        </p>
        <p className="text-sm text-gray-500">{profile.city}</p>
        {isActiveThisWeek(profile.last_active_at) && (
          <p className="text-xs text-green-700">● Active this week</p>
        )}
        <p className="text-xs text-gray-600">{traits.join(" · ")}</p>
      </div>
    </Link>
  );
}