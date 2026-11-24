import Link from "next/link";
import { APP_NAME } from "@/lib/brand";

// A static page: no user data, so Next.js prerenders it once at build time.
export default function LegalPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-4 text-sm leading-relaxed">
      <h1 className="text-2xl font-semibold">Terms &amp; Privacy</h1>
      <p className="rounded bg-yellow-50 p-3 text-yellow-800">
        Prototype for the eLitmus assignment. This summarises how a real launch would work; it is not
        legal advice.
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Who can join</h2>
        <p>
          {APP_NAME} is for people aged <strong>18 or older</strong>. Your date of birth is checked at
          sign-up, and the age rule is enforced by our database.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">What we collect, and why</h2>
        <ul className="list-disc pl-5">
          <li>Email and password: to sign you in.</li>
          <li>Name, date of birth (shown only as your age), gender, who you&apos;re interested in, city, intent: to show you relevant people.</li>
          <li>Photos, personality answers and prompts: to build your profile.</li>
          <li>Likes, matches and messages: to run the service.</li>
          <li>When you were last active: to pause inactive profiles after 14 days.</li>
        </ul>
        <p>
          We store your <strong>city only</strong>, never your exact location. We do not sell your data.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">eLitmus data (DPDP Act 2023)</h2>
        <p>
          We only check your email against eLitmus&apos;s records if you <strong>tick the consent box</strong>{" "}
          at sign-up, and we only use the result to show a Verified badge. Nothing else is imported.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Your rights</h2>
        <ul className="list-disc pl-5">
          <li>See and edit your profile at any time in Settings.</li>
          <li>
            <strong>Delete your account</strong> in Settings. This permanently removes your profile,
            photos, answers, likes, matches and messages.
          </li>
          <li>Reports you file are kept for moderation even if the other person deletes their account.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Community rules</h2>
        <p>
          No harassment, hate, nudity, scams, requests for money, or fake profiles. Anyone can be
          blocked or reported in one tap, always free. Reports are reviewed by our team, and reported
          users are never told who reported them.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Grievance Officer (IT Rules 2021)</h2>
        <p>
          Complaints are acknowledged within 24 hours and resolved within 15 days.
          <br />
          Grievance Officer: <em>[name to be appointed]</em>
          <br />
          Email: <em>[grievance@yourdomain.in]</em>
        </p>
      </section>

      <Link href="/" className="underline">
        ← Back
      </Link>
    </main>
  );
}
