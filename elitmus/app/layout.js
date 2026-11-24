import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import LikeNotifications from "@/components/like-notifications";
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

export const metadata = {
  title: APP_NAME,
  description: TAGLINE,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <NavBar />
          <LikeNotifications />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

        