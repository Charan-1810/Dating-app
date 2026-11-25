import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PhotoSlots from "./photo-slots";
import { PageHeader, Spinner, Stepper } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";

export default function PhotosPage() {
  return (
    <main className="page-narrow">
      <Stepper current={1} />
      <PageHeader
        title="Add your photos"
        subtitle="Up to 3. They appear between your answers, so pick ones that show what you're like, not just what you look like."
      />

      <Suspense fallback={<Spinner label="Loading photos" />}>
        <PhotoLoader />
      </Suspense>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link href="/" className="btn btn-ghost">
          Back to profile
        </Link>
        <Link href="/personality" className="btn btn-primary py-3">
          Continue <ArrowRightIcon className="size-4" />
        </Link>
      </div>
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
