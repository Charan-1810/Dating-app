"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CameraIcon, XIcon } from "@/components/icons";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB, same as the bucket limit

export default function PhotoSlots({ userId, photos }) {
  const supabase = createClient();
  const router = useRouter();
  const [busySlot, setBusySlot] = useState(null);
  const [error, setError] = useState(null);

  async function upload(position, file) {
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setError("Photo must be under 5 MB.");
      return;
    }
    setError(null);
    setBusySlot(position);

    const ext = file.name.split(".").pop().toLowerCase();
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    // 1. Upload the file to Storage
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setBusySlot(null);
      return;
    }

    // 2. Record it in the photos table
    const { error: dbError } = await supabase
      .from("photos")
      .insert({ user_id: userId, path, position });

    if (dbError) {
      await supabase.storage.from("photos").remove([path]); // clean up the orphan file
      setError(dbError.message);
    }

    setBusySlot(null);
    router.refresh(); // re-run the server component so the new photo shows
  }

  async function remove(photo) {
    setBusySlot(photo.position);
    await supabase.from("photos").delete().eq("id", photo.id);
    await supabase.storage.from("photos").remove([photo.path]);
    setBusySlot(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[1, 2, 3].map((position) => {
          const photo = photos.find((p) => p.position === position);
          const busy = busySlot === position;

          return (
            <div
              key={position}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand shadow-card"
            >
              {busy ? (
                <div className="grid size-full place-items-center">
                  <span className="size-6 animate-spin rounded-full border-2 border-line border-t-ink" />
                </div>
              ) : photo ? (
                <>
                  <img src={photo.url} alt={`Photo ${position}`} className="size-full animate-rise object-cover" />
                  <button
                    onClick={() => remove(photo)}
                    aria-label={`Remove photo ${position}`}
                    className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    <XIcon className="size-4" />
                  </button>
                  {position === 1 && (
                    <span className="chip absolute bottom-2 left-2 bg-white/90 px-2.5 py-0.5 text-[11px] backdrop-blur">
                      Main
                    </span>
                  )}
                </>
              ) : (
                <label className="flex size-full cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-line bg-surface text-center text-ink-soft transition hover:border-ink/30 hover:bg-paper">
                  <span className="grid size-11 place-items-center rounded-full bg-sand">
                    <CameraIcon className="size-5" />
                  </span>
                  <span className="text-xs font-medium sm:text-sm">{position === 1 ? "Main photo" : "Add photo"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => upload(position, e.target.files[0])}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted">JPG, PNG or WebP, up to 5 MB each.</p>
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
