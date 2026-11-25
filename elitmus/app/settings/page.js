import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import SettingsForms from "./settings-forms";
import { PageHeader, Spinner } from "@/components/ui";

export default function SettingsPage() {
  return (
    <main className="page-narrow">
      <PageHeader eyebrow="Settings" title="Your account" />
      <Suspense fallback={<Spinner />}>
        <SettingsLoader />
      </Suspense>
    </main>
  );
}

async function SettingsLoader() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, gender, interested_in, city, intent, is_verified")
    .eq("id", user.id)
    .single();

  return <SettingsForms email={user.email} profile={profile} />;
}
