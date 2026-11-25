import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import NavBar from "@/components/nav-bar";
import { APP_NAME, TAGLINE } from "@/lib/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display serif for names, headings and prompt answers: makes people's words the hero
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

export const metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: TAGLINE,
};

export const viewport = {
  themeColor: "#faf7f2",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* NavBar also runs live notifications (toast + unread likes badge) */}
        <Suspense fallback={null}>
          <NavBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
