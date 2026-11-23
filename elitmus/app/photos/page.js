import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PhotoSlots from "./photo-slots";

export default function PhotosPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">Your photos</h1>
      <p className="text-sm text-gray-500">
        Add up to 3 photos. They appear alongside your answers on your profile.
      </p>

      <Suspense fallback={<p className="text-gray-500">Loading photos...</p>}>
        <PhotoLoader />
      </Suspense>

      <Link href="/" className="rounded bg-black p-2 text-center text-white">
        Done
      </Link>
    </main>
  );
}

async function PhotoLoader() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: photos } = await supabase
    .from("photos")
    .select("id, path, position")
    .eq("user_id", user.id)
    .order("position");

  const withUrls = photos.map((p) => ({
    ...p,
    url: supabase.storage.from("photos").getPublicUrl(p.path).data.publicUrl,
  }));

  return <PhotoSlots userId={user.id} photos={withUrls} />;
}