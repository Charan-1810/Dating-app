"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { useLiveNotifications, NotificationToast } from "./like-notifications";
import { CompassIcon, HeartIcon, LogOutIcon, SlidersIcon, UserIcon } from "./icons";
import { Wordmark } from "./ui";

const LINKS = [
  { href: "/browse", label: "Browse", Icon: CompassIcon },
  { href: "/likes", label: "Likes", Icon: HeartIcon },
  { href: "/", label: "Profile", Icon: UserIcon, alsoFor: ["/photos", "/personality", "/prompts"] },
  { href: "/settings", label: "Settings", Icon: SlidersIcon },
];

// Pages where the nav would get in the way (still signing up)
const HIDDEN_ON = ["/login", "/onboarding"];

export default function NavBar() {
  const pathname = usePathname();
  const { userId, unseen, toast, dismissToast } = useLiveNotifications(pathname);

  if (!userId) return null;
  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));
  const inChat = pathname.startsWith("/chat/");

  // "/" must match exactly; other links also match their sub-pages
  const isCurrent = ({ href, alsoFor = [] }) =>
    href === "/"
      ? pathname === "/" || alsoFor.some((p) => pathname.startsWith(p))
      : pathname.startsWith(href) || (href === "/likes" && inChat);

  return (
    <>
      {!hidden && (
        <>
          {/* Top bar: logo + links on desktop, logo only on phones */}
          <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-5xl items-center gap-8 px-4 sm:px-6">
              <Link href="/browse" aria-label="Home">
                <Wordmark />
              </Link>
              <nav className="hidden items-center gap-1 md:flex">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                      isCurrent(link) ? "bg-ink text-paper" : "text-ink-soft hover:bg-sand hover:text-ink"
                    }`}
                  >
                    {link.label}
                    {link.href === "/likes" && unseen > 0 && <CountBadge count={unseen} />}
                  </Link>
                ))}
              </nav>
              <form action={logout} className="ml-auto">
                <button className="btn btn-ghost px-3" title="Log out">
                  <LogOutIcon className="size-4" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </form>
            </div>
          </header>

          {/* Bottom tab bar on phones (hidden in chat, which needs the space for typing) */}
          {!inChat && (
            <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
              <div className="grid grid-cols-4">
                {LINKS.map((link) => {
                  const active = isCurrent(link);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
                        active ? "text-accent" : "text-muted"
                      }`}
                    >
                      <span className="relative">
                        <link.Icon className="size-6" strokeWidth={active ? 2.2 : 1.8} />
                        {link.href === "/likes" && unseen > 0 && (
                          <span className="absolute -top-1.5 -right-2.5">
                            <CountBadge count={unseen} />
                          </span>
                        )}
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}
        </>
      )}

      {toast && <NotificationToast toast={toast} onDismiss={dismissToast} />}
    </>
  );
}

function CountBadge({ count }) {
  return (
    <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white ring-2 ring-paper">
      {count > 9 ? "9+" : count}
    </span>
  );
}
