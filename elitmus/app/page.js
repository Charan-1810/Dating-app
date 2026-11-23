import { createClient } from "@/lib/supabase/server";
import { logout } from "./login/actions";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <p>
        Logged in as <strong>{user?.email}</strong>
      </p>
      <form action={logout}>
        <button className="rounded border px-4 py-2">Log out</button>
      </form>
    </main>
  );
}