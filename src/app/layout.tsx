import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compass — Journaling that actually fits you",
  description: "Prompted journaling tailored to your patterns. Not a diagnosis. Just a mirror.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-slate-800 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:border focus:border-slate-200"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
