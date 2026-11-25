import Link from "next/link";
import { APP_NAME } from "@/lib/brand";
import { PageHeader, Wordmark } from "@/components/ui";
import { ChevronLeftIcon } from "@/components/icons";

export const metadata = { title: "Terms & Privacy" };

// A static page: no user data, so Next.js prerenders it once at build time.
export default function LegalPage() {
  return (
    <main className="page-narrow">
      <Link href="/" className="mb-6 inline-block">
        <Wordmark />
      </Link>
      <PageHeader eyebrow="Legal" title="Terms & Privacy" subtitle="The short, readable version of how we handle you and your data." />

      <p className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Prototype for the eLitmus assignment. This summarises how a real launch would work; it is not legal advice.
      </p>

      <div className="card divide-y divide-line text-[15px] leading-relaxed text-ink-soft">
        <Section n="1" title="Who can join">
          <p>
            {APP_NAME} is for people aged <strong className="text-ink">18 or older</strong>. Your date of birth is
            checked at sign-up, and the age rule is enforced by our database.
          </p>
        </Section>

        <Section n="2" title="What we collect, and why">
          <ul className="list-disc space-y-1 pl-5 marker:text-accent">
            <li>Email and password: to sign you in.</li>
            <li>
              Name, date of birth (shown only as your age), gender, who you&apos;re interested in, city, intent: to show
              you relevant people.
            </li>
            <li>Photos, personality answers and prompts: to build your profile.</li>
            <li>Likes, matches and messages: to run the service.</li>
            <li>When you were last active: to pause inactive profiles after 14 days.</li>
          </ul>
          <p>
            We store your <strong className="text-ink">city only</strong>, never your exact location. We do not sell
            your data.
          </p>
        </Section>

        <Section n="3" title="eLitmus data (DPDP Act 2023)">
          <p>
            We only check your email against eLitmus&apos;s records if you{" "}
            <strong className="text-ink">tick the consent box</strong> at sign-up, and we only use the result to show a
            Verified badge. Nothing else is imported.
          </p>
        </Section>

        <Section n="4" title="Your rights">
          <ul className="list-disc space-y-1 pl-5 marker:text-accent">
            <li>See and edit your profile at any time in Settings.</li>
            <li>
              <strong className="text-ink">Delete your account</strong> in Settings. This permanently removes your
              profile, photos, answers, likes, matches and messages.
            </li>
            <li>Reports you file are kept for moderation even if the other person deletes their account.</li>
          </ul>
        </Section>

        <Section n="5" title="Community rules">
          <p>
            No harassment, hate, nudity, scams, requests for money, or fake profiles. Anyone can be blocked or reported
            in one tap, always free. Reports are reviewed by our team, and reported users are never told who reported
            them.
          </p>
        </Section>

        <Section n="6" title="Grievance Officer (IT Rules 2021)">
          <p>Complaints are acknowledged within 24 hours and resolved within 15 days.</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-2xl bg-paper p-4 text-sm">
            <dt className="text-muted">Officer</dt>
            <dd className="text-ink">[name to be appointed]</dd>
            <dt className="text-muted">Email</dt>
            <dd className="text-ink">[grievance@yourdomain.in]</dd>
          </dl>
        </Section>
      </div>

      <Link href="/" className="btn btn-ghost mt-6 -ml-3 pl-2">
        <ChevronLeftIcon className="size-4" />
        Back
      </Link>
    </main>
  );
}

function Section({ n, title, children }) {
  return (
    <section className="flex flex-col gap-3 p-5 sm:p-7">
      <h2 className="flex items-baseline gap-3 font-display text-xl text-ink">
        <span className="text-sm font-sans font-medium text-accent">{n.padStart(2, "0")}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
