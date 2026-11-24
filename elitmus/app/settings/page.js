import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import SettingsForms from "./settings-forms";

export default function SettingsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
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
