"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((position) => {
          const photo = photos.find((p) => p.position === position);
          const busy = busySlot === position;

          return (
            <div
              key={position}
              className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg border bg-gray-50"
            >
              {busy ? (
                <span className="text-sm text-gray-500">Working...</span>
              ) : photo ? (
                <>
                  <img src={photo.url} alt={`Photo ${position}`} className="h-full w-full object-cover" />
                  <button
                    onClick={() => remove(photo)}
                    className="absolute right-1 top-1 rounded bg-white/90 px-2 text-sm"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <label className="cursor-pointer p-4 text-center text-sm text-gray-500">
                  + Add photo
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

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}