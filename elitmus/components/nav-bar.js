"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/login/actions";
import { APP_NAME } from "@/lib/brand";

const LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/likes", label: "Likes" },
  { href: "/", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

// Pages where the nav would get in the way (still signing up)
const HIDDEN_ON = ["/login", "/onboarding"];

export default function NavBar() {
  const [supabase] = useState(() => createClient());
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setLoggedIn(Boolean(data.user)));
  }, [supabase, pathname]);

  if (!loggedIn || HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  // "/" must match exactly; other links also match their sub-pages
  const isCurrent = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav className="sticky top-0 z-40 flex items-center gap-4 border-b bg-white py-3 pl-4 pr-16 text-sm">
      <Link href="/browse" className="hidden font-semibold sm:inline">
        {APP_NAME}
      </Link>
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={isCurrent(link.href) ? "font-medium text-black underline" : "text-gray-600"}
        >
          {link.label}
        </Link>
      ))}
      <form action={logout} className="ml-auto">
        <button className="text-gray-600">Log out</button>
      </form>
    </nav>
  );
}
